import Annotator from "./hypothesis/Annotator";
import { Sidebar } from "./hypothesis/Sidebar";
import Vocabulary from "../common/model/Vocabulary";
import { preloadContentStyles } from "./hypothesis/helpers";
import {
  Annotation,
  AnnotationFocusTime,
  AnnotationType,
  isDefinitionAnnotation,
} from "../common/util/Annotation";
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

// TODO: this should be dynamic when language selection is implemented
const language = "cs";

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
  // contentState.user = null;
};

let contentState = {} as ContentState;

resetContentState();

// helper functions also operating on global data if needed
const internalActions = {};

// TODO: on some of these actions, sidebar (or event annotator) will need to be updated to show the most up to date data (e.g., rerender the whole tree through reactDOM, roll out redux, or solve in another way, to be determined)
// TODO: re-evaluate how things are done with respect to annotator, maybe can move all things there instead?
/**
 * all important global content script calls should be done here
 */

const originalQuerySelectorAll = document.querySelectorAll.bind(document);

const internals = {
  activatePage() {
    annotator = new Annotator(document.body, contentState);

    // so that reactboostrap works fine (needs be able to query select elements withing shadow dom)
    document.querySelectorAll = function (str) {
      const originalResult = originalQuerySelectorAll(str);
      const contentPopupResult = annotator!
        .getContentPoup()
        .getShadowRoot()
        .querySelectorAll(str);
      const sidebarResult = sidebar!.getShadowRoot().querySelectorAll(str);
      return [
        ...originalResult,
        ...contentPopupResult,
        ...sidebarResult,
      ] as any;
    };
  },
  deactivatePage() {
    document.querySelectorAll = originalQuerySelectorAll;
  },
  getPageUrl() {
    console.log(
      "shortened url: ",
      document.URL.replace(/[?&]?termit-focus-annotation=.*$/, "")
    );
    return document.URL.replace(/[?&]?termit-focus-annotation=.*$/, "");
  },
  parseAnnotationToFocus() {
    const match = document.URL.match(/termit-focus-annotation=(.+)$/);
    if (!match){
      return;
    }

    return match[1];
  },
};

export const ContentActions = {
  showPopup(annotation: Annotation) {
    annotator!.showPopup(annotation);
  },
  async annotateNewWebsite(vocabulary: Vocabulary) {
    internals.activatePage();
    console.log("annotated new website called");

    contentState.website = await api.createWebsiteInDocument(
      internals.getPageUrl(),
      VocabularyUtils.create(vocabulary.document!.iri)
    );
    console.log("about to run text analysis");
    const textAnalysisResult = await backgroundApi.getPageAnnotations(
      vocabulary.iri,
      document.body.outerHTML
    );
    console.log("load all terms, textAnalysisResult: ", textAnalysisResult);
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
      AnnotationType.OCCURRENCE,
      [VocabularyUtils.SUGGESTED_TERM_OCCURRENCE]
    );

    await api.savePageAnnotationResults(
      termOccurrencesGrouped.flatMap((occGroup) => occGroup),
      contentState.website,
      vocabulary.iri
    );

    await annotator!.annotatePage(vocabulary, termOccurrencesGrouped);
    contentState.annotations = annotator!.getAnnotations();

    contentState.vocabulary.document?.websites.push(contentState.website);

    // update vocabulary cache
    await BrowserApi.storage.set("vocabularies", contentState.vocabularies);

    // this makes sure to re-render sidebar on data update
    sidebar!.render();

    setTimeout(() => {
      sidebar?.render();
    }, 200);
  },
  async attemptAnnotatingExistingWebsite() {
    const foundExistingWebsite = await api.getExistingWebsite(
      internals.getPageUrl(),
      contentState.vocabularies
    );

    if (!foundExistingWebsite) {
      // website hasn't been annotated yet, wait for explicit user action
      return;
    }

    internals.activatePage();

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

    const occurrenceToFocusIri = internals.parseAnnotationToFocus()

    if (occurrenceToFocusIri){
      const foundAnnotation = contentState.annotations.find(annotation => annotation.termOccurrence.iri === occurrenceToFocusIri);
      if (!foundAnnotation){
        throw new Error('Focused annotation not found: ', foundAnnotation);
      }

      foundAnnotation.focusAnnotation(AnnotationFocusTime.LONG);
    }

    sidebar!.render();
    // TODO: fix bug where this opens on the wrong side
    setTimeout(() => {
      sidebar!.open();
    }, 200);
  },
  async assignTermToOccurrence(
    term: Term,
    annotation: Annotation,
    annotationType: string,
    isDuringTermCreation: boolean = false
  ) {
    const originalTerm = annotation.term;
    annotation.assignTerm(term);
    annotator!.hidePopup();
    const hasBeenPersisted = !!annotation.termOccurrence.iri;
    const isDefinition = annotationType === AnnotationType.DEFINITION;
    console.log("contentState: ", contentState);
    if (isDefinition) {
      if (hasBeenPersisted) {
        // if we got here, we must be reassigning definition to a new element -> delete old definition source
        await api.removeTermDefinitionSource(
          annotation.termOccurrence,
          originalTerm!
        );
      }

      if (!isDuringTermCreation) {
        const annotationIdx = contentState.annotations!.findIndex(
          (currAnnotation) =>
            currAnnotation?.term?.iri === term.iri &&
            currAnnotation.isDefinition() &&
            annotation !== currAnnotation
        );

        // delete previous definition annotation from the same term (can only have one)
        // from front-end only, back-end will automatically delete previous existing
        if (annotationIdx >= 0) {
          // TODO: put into an internals helper function and remove
          contentState.annotations![annotationIdx].removeOccurrence();
          contentState.annotations?.splice(annotationIdx, 1);
        }

        // this must mean we're updating a definition source of a term -> also update the definition

        // get full term from API, as standard loaded terms don't contain certain properties (e.g, glossary, causing issues during updates)
        const fullTerm = await api.loadTerm(
          VocabularyUtils.create(term.iri).fragment,
          VocabularyUtils.create(contentState.vocabulary!.iri)
        );

        fullTerm.definition = {
          ...fullTerm.definition,
          [language]: annotation.termOccurrence
            .getTextQuoteSelector()
            .exactMatch.replace(/(\r\n|\n|\r)/gm, " "),
        };

        term.definition = {
          ...term.definition,
          [language]: annotation.termOccurrence
            .getTextQuoteSelector()
            .exactMatch.replace(/(\r\n|\n|\r)/gm, " "),
        };

        console.log("full term: ", fullTerm);

        await api.updateTerm(fullTerm);
      }

      await api.setTermDefinitionSource(
        annotation.termOccurrence,
        term,
        contentState.website!
      );
    } else if (hasBeenPersisted) {
      await api.updateTermOccurrence(annotation.termOccurrence);
    } else {
      await api.createTermOccurrences(
        [annotation.termOccurrence],
        contentState.website!,
        annotationType,
        contentState.vocabulary!.iri
      );
    }

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

    const [newAnnotation] = await markTerms(
      [newTermOccurrence],
      contentState.terms
    );

    newAnnotation.updateRelatedAnnotationElements();

    contentState.annotations!.push(newAnnotation);
    this.showPopup(newAnnotation);

    sidebar?.render();
    return newAnnotation;
  },
  async createTerm(
    term: Term,
    vocabularyIri: IRI,
    annotation: Annotation,
    definitionAnnotation?: Annotation
  ) {
    annotator?.hidePopup();
    await api.createTerm(term, vocabularyIri);
    contentState.terms![term.iri] = term;
    term.vocabulary = {
      iri: contentState!.vocabulary!.iri,
      types: contentState!.vocabulary!.types,
    };
    await this.assignTermToOccurrence(
      term,
      annotation,
      AnnotationType.OCCURRENCE
    );
    if (definitionAnnotation) {
      await this.assignTermToOccurrence(
        term,
        definitionAnnotation,
        AnnotationType.DEFINITION,
        true
      );
    }

    sidebar?.render();
  },
  async removeOccurrence(annotation: Annotation) {
    await annotation.removeOccurrence();
    if (annotation.termOccurrence.iri) {
      if (annotation.isDefinition()) {
        await api.removeTermDefinitionSource(
          annotation.termOccurrence,
          annotation.term!
        );
      } else {
        await api.removeOccurrence(annotation.termOccurrence);
      }
    }
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
    annotator!.turnOffAnnotations();
    resetContentState();
    contentState.vocabularies = await api.loadVocabularies();

    sidebar!.render();
    initPage();
  },
};

const initPage = async () => {
  contentState.user = await api.getUser();
  preloadContentStyles();

  if (!contentState.user) {
    initSidebar();
    return;
  }
  contentState.vocabularies = await api.loadVocabularies();

  initSidebar();

  await ContentActions.attemptAnnotatingExistingWebsite();
};

window.addEventListener("load", initPage);

function initSidebar() {
  if (sidebar) {
    sidebar.destroy();
  }

  sidebar = new Sidebar(
    document.body,
    // TODO: maybe not pass the whole state inside, or restructure state such that it doesn't contain whole classes instances of Annotator and Sidebar
    contentState,
    ContentActions.annotateNewWebsite
  );
}
