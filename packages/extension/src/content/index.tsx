import Annotator from "./hypothesis/Annotator";
import { Sidebar } from "./hypothesis/Sidebar";
import Vocabulary from "../common/model/Vocabulary";
import { preloadContentStyles } from "./hypothesis/helpers";
import { overlay } from "./helper/overlay";
import {
  Annotation,
  AnnotationClass,
  AnnotationType,
} from "../common/util/Annotation";
import api, { Website } from "../api";
import VocabularyUtils, { IRI } from "../common/util/VocabularyUtils";
import Term from "../common/model/Term";
import { occurrenceFromRange, markTerms } from "./marker";
import backgroundApi from "../shared/backgroundApi";

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
  hasBeenAnnotated: boolean;
  vocabularies: Vocabulary[];
};

const contentState: ContentState = {
  annotations: null,
  vocabulary: null,
  terms: null,
  website: null,
  hasBeenAnnotated: false,
  vocabularies: [],
};

// TODO: on some of these actions, sidebar (or event annotator) will need to be updated to show the most up to date data (e.g., rerender the whole tree through reactDOM, roll out redux, or solve in another way, to be determined)
// TODO: re-evaluate how things are done with respect to annotator, maybe can move all things there instead?
/**
 * all important global content script calls should be done here
 */
export const globalActions = {
  showPopup(annotation: Annotation) {
    annotator!.showPopup(annotation);
  },
  async annotateNewWebsite(vocabulary: Vocabulary) {
    const result = await backgroundApi.getPageAnnotations(
      vocabulary.iri,
      document.body.outerHTML
    );
    const vocabularyTerms = await api.loadAllTerms(
      VocabularyUtils.create(vocabulary.iri)
    );
    contentState.terms = vocabularyTerms;
    contentState.vocabulary = vocabulary;

    await annotator!.annotatePage(vocabulary, result);
    contentState.annotations = annotator!.getAnnotations();
    contentState.website = await api.createWebsiteInDocument(
      { url: document.URL },
      VocabularyUtils.create(vocabulary!.iri)
    );
    await api.savePageAnnotationResults(result);
    contentState.hasBeenAnnotated = true;

    // this makes sure to re-render sidebar on data update
    sidebar!.render();
  },
  async attemptAnnotatingExistingWebsite() {
    const website: Website | null = await api.getExistingWebsite(document.URL);

    if (!website) {
      // website hasn't been annotated yet, wait for explicit user action
      return;
    }

    contentState.vocabularies = await api.loadVocabularies();
    // TODO: how to handle multiple vocabularies? schema adjustments, state adjustments
    const foundVocabulary = contentState.vocabularies.find(
      (vocab) => vocab.document?.iri === (website as Website).document
    );
    if (!foundVocabulary) {
      throw new Error("Matching vocabulary of an existing website not found!");
    }
    contentState.terms = await api.loadAllTerms(
      VocabularyUtils.create(foundVocabulary.iri)
    );
    const result = await api.getWebsitesTermOccurrences(website);
    await annotator!.annotatePage(foundVocabulary, result);
    contentState.annotations = annotator!.getAnnotations();
    contentState.vocabulary = foundVocabulary;
    contentState.hasBeenAnnotated = true;
    contentState.annotations = annotator!.getAnnotations();

    // TODO: fix bug where this opens on the wrong side
    setTimeout(() => {
      sidebar!.open();
    }, 200)
    
    sidebar!.render();
  },
  async assignTermToSuggestedTermOccurrence(
    term: Term,
    annotation: Annotation
  ) {
    annotation.assignTerm(term, true);
    // TODO: is hiding popup needed?
    annotator!.hidePopup();
    await api.updateTermOccurrence(annotation);
    // TODO: maybe the annotace service needs to be run again to help out with that?

    sidebar?.render();
  },
  async assignTermToSuggestedDefinitionOccurrence(
    term: Term,
    annotation: Annotation
  ) {
    console.log("term in global actions: ", term);
    annotation.assignTerm(term, false);
    annotator!.hidePopup();
    await api.updateTermOccurrence(annotation);

    sidebar?.render();
  },
  async createUnknownTermOccurrence(selectionRange: Range) {
    console.log("contentState.annotations: ", contentState.annotations);
    const newTermOccurrence = occurrenceFromRange(
      selectionRange,
      AnnotationType.OCCURRENCE
    );
    const [newAnnotation] = await markTerms(
      newTermOccurrence,
      contentState.terms
    );
    contentState.annotations!.push(newAnnotation);
    this.showPopup(newAnnotation);

    // TODO: this maybe not need to be persisted, as the user will likely create a term or assign occurrence to existing term from this unknown occurrence, but double check this to be sure
    // TODO: if we don't persist it initially, it will make things a bit more complicated in figuring out if we need to create the term occurrence or just update it instead
    await api.createTermOccurrence(newAnnotation);

    sidebar?.render();
  },
  async createUnknownDefinitionOccurrence(selectionRange: Range) {
    const newDefinitionOccurrence = occurrenceFromRange(
      selectionRange,
      AnnotationType.DEFINITION
    );
    const [newAnnotation] = await markTerms(
      newDefinitionOccurrence,
      contentState.terms
    );
    contentState.annotations!.push(newAnnotation);
    this.showPopup(newAnnotation);

    // TODO: this maybe not need to be persisted, as per the comment in createUnknownTermOccurrence()
    await api.createDefinitionOccurrence(newAnnotation);

    sidebar?.render();
  },
  async createTerm(term: Term, vocabularyIri: IRI, annotation: Annotation) {
    await api.createTerm(term, vocabularyIri);
    contentState.terms![term.iri] = term;
    annotation.assignTerm(term, true);

    sidebar?.render();
  },
  async removeOccurrence(annotation: Annotation) {
    await api.removeOccurrence(annotation);
    await annotation.removeOccurrence();
    const annotationIdx = contentState.annotations!.indexOf(annotation);
    contentState.annotations?.splice(annotationIdx, 1);

    sidebar?.render();
  },
};

window.addEventListener("load", async () => {
  overlay.init();
  preloadContentStyles();
  initSidebar();

  globalActions.attemptAnnotatingExistingWebsite();

  annotator = new Annotator(document.body, contentState);
});

function initSidebar() {
  sidebar = new Sidebar(
    document.body,
    // TODO: maybe not pass the whole state inside, or restructure state such that it doesn't contain whole classes instances of Annotator and Sidebar
    contentState,
    globalActions.annotateNewWebsite
  );
}
