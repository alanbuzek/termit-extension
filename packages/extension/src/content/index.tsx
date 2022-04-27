import Annotator from "./hypothesis/Annotator";
import { Sidebar } from "./hypothesis/Sidebar";
import Vocabulary from "../common/model/Vocabulary";
import { preloadContentStyles } from "./hypothesis/helpers";
import { overlay } from "./helper/overlay";
import { Annotation, AnnotationType } from "../common/util/Annotation";
import api from "../api";
import VocabularyUtils, { IRI } from "../common/util/VocabularyUtils";
import Term from "../common/model/Term";
import { occurrenceFromRange, markTerms } from "./marker";
import backgroundApi from "../shared/backgroundApi";
import Website from "../common/model/Website";
import TermOccurrence, {
  createTermOccurrences,
} from "../common/model/TermOccurrence";
import BrowserApi from "../shared/BrowserApi";
import User from "../common/model/User";

// global important classes
let sidebar: Sidebar | null = null;
let annotator: Annotator | null = null;

export type TermsMap = { [key: string]: Term };

export type ContentState = {
  // api data
  vocabulary: Vocabulary | null;
  annotations: Annotation[] | null;
  terms: TermsMap | null;
  website: Website | null;
  // local state data
  // hasBeenAnnotated: boolean;
  vocabularies: Vocabulary[];
  user: User | null;
};

const resetContentState = () => {
  contentState.annotations = null;
  contentState.vocabulary = null;
  contentState.terms = null;
  contentState.website = null;
  contentState.vocabularies = [];
  contentState.user = null;
};

let contentState: ContentState = {};

resetContentState();

// helper functions also operating on global data if needed
const internalActions = {};

// TODO: on some of these actions, sidebar (or event annotator) will need to be updated to show the most up to date data (e.g., rerender the whole tree through reactDOM, roll out redux, or solve in another way, to be determined)
// TODO: re-evaluate how things are done with respect to annotator, maybe can move all things there instead?
/**
 * all important global content script calls should be done here
 */
export const ContentActions = {
  showPopup(annotation: Annotation) {
    annotator!.showPopup(annotation);
  },
  async annotateNewWebsite(vocabulary: Vocabulary) {
    annotator = new Annotator(document.body, contentState);

    contentState.website = await api.createWebsiteInDocument(
      document.URL,
      VocabularyUtils.create(vocabulary.document!.iri)
    );
    const textAnalysisResult = await backgroundApi.getPageAnnotations(
      vocabulary.iri,
      document.body.outerHTML
    );

    const vocabularyTerms = await api.loadAllTerms(
      VocabularyUtils.create(vocabulary.iri)
    );

    contentState.terms = vocabularyTerms;
    contentState.vocabulary = vocabulary;
    // TODO: make this call only once (not from inside of sidebar)

    const termOccurrencesGrouped: TermOccurrence[][] = createTermOccurrences(
      textAnalysisResult,
      contentState.website.iri,
      contentState.terms!,
      [VocabularyUtils.SUGGESTED_TERM_OCCURRENCE]
    );
    await annotator!.annotatePage(vocabulary, termOccurrencesGrouped);

    contentState.annotations = annotator!.getAnnotations();

    contentState.vocabulary.document?.websites.push(contentState.website);

    // update vocabulary cache
    await BrowserApi.storage.set("vocabularies", contentState.vocabularies);

    await api.savePageAnnotationResults(
      termOccurrencesGrouped.flatMap((occGroup) => occGroup),
      contentState.website,
      vocabulary.iri
    );

    // this makes sure to re-render sidebar on data update
    sidebar!.render();
  },
  async attemptAnnotatingExistingWebsite() {
    const foundExistingWebsite = await api.getExistingWebsite(
      document.URL,
      contentState.vocabularies
    );

    if (!foundExistingWebsite) {
      // website hasn't been annotated yet, wait for explicit user action
      return;
    }

    annotator = new Annotator(document.body, contentState);

    const { website, vocabulary } = foundExistingWebsite;
    // TODO: how to handle multiple vocabularies? schema adjustments, state adjustments

    contentState.terms = await api.loadAllTerms(
      VocabularyUtils.create(vocabulary.iri)
    );
    const termOccurrencesGroups: TermOccurrence[][] =
      await api.getWebsiteTermOccurrences(website, contentState.terms!);
    await annotator!.annotatePage(vocabulary, termOccurrencesGroups);
    contentState.annotations = annotator!.getAnnotations();
    contentState.vocabulary = vocabulary;
    contentState.website = website;

    sidebar!.render();
    // TODO: fix bug where this opens on the wrong side
    setTimeout(() => {
      sidebar!.open();
    }, 200);
  },
  async assignTermToSuggestedOccurrence(
    term: Term,
    annotation: Annotation,
    annotationType: string
  ) {
    annotation.assignTerm(term, annotationType);
    if (!annotation.termOccurrence.iri) {
      // term occurrence doesn't exist in the back-end yet
      await api.createTermOccurrence(
        annotation.termOccurrence,
        contentState.website!,
        annotationType,
        contentState.vocabulary!.iri
      );
    } else {
      await api.updateTermOccurrence(annotation.termOccurrence);
    }
    annotator!.hidePopup();

    sidebar?.render();
  },
  async createUnknownOccurrenceFromRange(
    selectionRange: Range,
    annotationType: string
  ) {
    const newTermOccurrence = occurrenceFromRange(
      selectionRange,
      annotationType,
      contentState.website?.iri,
      contentState.terms
    );

    console.log("new term Occurrence: ", newTermOccurrence);
    const [newAnnotation] = await markTerms(
      [newTermOccurrence],
      contentState.terms
    );

    contentState.annotations!.push(newAnnotation);
    this.showPopup(newAnnotation);

    sidebar?.render();
  },
  async createTerm(term: Term, vocabularyIri: IRI, annotation: Annotation) {
    await api.createTerm(term, vocabularyIri);
    contentState.terms![term.iri] = term;
    await this.assignTermToSuggestedOccurrence(term, annotation, AnnotationType.OCCURRENCE);
    overlay.off();
    annotator?.hidePopup();

    sidebar?.render();
  },
  async removeOccurrence(annotation: Annotation) {
    await api.removeOccurrence(annotation.termOccurrence);
    await annotation.removeOccurrence();
    const annotationIdx = contentState.annotations!.indexOf(annotation);
    contentState.annotations?.splice(annotationIdx, 1);

    sidebar?.render();
  },
  async removeWebsiteAnnotations() {
    await api.removeWebsiteFromDocument(
      contentState.vocabulary!.document!,
      contentState.website!
    );
    contentState.vocabulary!.document!.websites =
      contentState.vocabulary!.document!.websites.filter(
        (w) => w.iri !== contentState.website!.iri
      );
    // update vocabulary cache
    await BrowserApi.storage.set("vocabularies", contentState.vocabularies);

    // reset page
    // contentState = getEmptyContentState();
    annotator!.turnOffAnnotations();
    resetContentState();
    contentState.vocabularies = await api.loadVocabularies();

    sidebar!.render();
    initPage();
  },
};

const initPage = async () => {
  contentState.user = await api.getUser();

  if (!contentState.user) {
    return;
  }
  contentState.vocabularies = await api.loadVocabularies();

  overlay.init();
  preloadContentStyles();
  initSidebar();

  await ContentActions.attemptAnnotatingExistingWebsite();
};

window.addEventListener("load", initPage);

function initSidebar() {
  sidebar = new Sidebar(
    document.body,
    // TODO: maybe not pass the whole state inside, or restructure state such that it doesn't contain whole classes instances of Annotator and Sidebar
    contentState,
    ContentActions.annotateNewWebsite
  );
}
