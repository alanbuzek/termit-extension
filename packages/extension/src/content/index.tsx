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
import backgroundApi from "../shared/backgroundApi";
import Website from "../common/model/Website";
import TermOccurrence, {
  TermOccurrenceFactory,
} from "../common/model/TermOccurrence";
import BrowserApi from "../shared/BrowserApi";
import User from "../common/model/User";
import Constants from "../common/util/Constants";
import { overlay } from "./helper/overlay";
import { getPageUrl } from "./helper/url";
import { isPagePDFViewer } from "./helper/domHelpers";

// TODO: this should be dynamic when language selection is implemented
const language = "cs";
// global important classes
let sidebar: Sidebar | null = null;
let annotator: Annotator | null = null;
let hasBeenPageInited = false;

export type TermsMap = { [key: string]: Term };

export type ContentState = {
  // api data
  vocabulary: Vocabulary | null;
  annotations: Annotation[] | null;
  failedAnnotations: Annotation[] | null;
  terms: TermsMap | null;
  website: Website | null;
  // local state data
  // hasBeenAnnotated: boolean;
  vocabularies: Vocabulary[];
  user: User | null;
  extensionActive: boolean;
  globalLoading: boolean;
  pageUrl: string;
};

const resetContentState = async () => {
  contentState.annotations = null;
  contentState.failedAnnotations = null;
  contentState.vocabulary = null;
  contentState.terms = null;
  contentState.website = null;
  // NOTE: these two fields, we want to preserve even on content state reset
  // contentState.vocabularies = [];
  // contentState.user = null;
  contentState.extensionActive = false;
  contentState.globalLoading = false;
  contentState.extensionActive = await BrowserApi.storage.get(
    Constants.STORAGE.EXTENSION_ACTIVE
  );
};

let contentState = {} as ContentState;

// TODO: on some of these actions, sidebar (or event annotator) will need to be updated to show the most up to date data (e.g., rerender the whole tree through reactDOM, roll out redux, or solve in another way, to be determined)
// TODO: re-evaluate how things are done with respect to annotator, maybe can move all things there instead?
/**
 * all important global content script calls should be done here
 */

const originalQuerySelectorAll = document.querySelectorAll.bind(document);

const internals = {
  async initPage() {
    if (hasBeenPageInited) {
      return;
    }

    hasBeenPageInited = true;
    contentState.pageUrl = getPageUrl();

    // we don't support pdf pages yet
    if (isPagePDFViewer()) {
      return;
    }

    await resetContentState();
    contentState.user = await api.getUser();
    preloadContentStyles();

    if (!contentState.user) {
      internals.initSidebar();
      return;
    }
    contentState.vocabularies = await api.loadVocabularies();

    internals.initSidebar();

    if (contentState.extensionActive) {
      await ContentActions.tryAnnotatingExistingWebsite();
    }
  },
  updateSidebar() {
    sidebar?.render();
  },
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
  async deactivatePage() {
    document.querySelectorAll = originalQuerySelectorAll;
    // reset page
    annotator?.destroy();
    annotator = null;
    await resetContentState();

    contentState.globalLoading = false;
    internals.updateSidebar();
  },
  async initSidebar() {
    sidebar = new Sidebar(
      document.body,
      contentState,
      ContentActions.annotateNewWebsite,
      ContentActions.removeOccurrence
    );
  },
  parseQueryParamAnnotationToFocus() {
    const match = document.URL.match(/termit-focus-annotation=(.+)$/);
    if (!match) {
      return;
    }

    return match[1];
  },
  handleLocationChange() {
    if (!contentState.pageUrl) {
      // location changed before we page inited
      return;
    }

    if (contentState.pageUrl !== getPageUrl()) {
      console.log("change detected!");
      // new url detected -> deactivate last page and try annotating again
      contentState.pageUrl = getPageUrl();

      internals.deactivatePage();
      contentState.globalLoading = true;
      internals.updateSidebar();

      // avoid any possible race condions
      setTimeout(() => {
        ContentActions.tryAnnotatingExistingWebsite();
      }, 100);
    }
  },
};

export const ContentActions = {
  showPopup(annotation: Annotation) {
    annotator!.showPopup(annotation);
  },
  async annotateNewWebsite(vocabulary: Vocabulary) {
    contentState.globalLoading = true;
    internals.updateSidebar();
    internals.activatePage();

    contentState.website = await api.createWebsiteInDocument(
      contentState.pageUrl,
      VocabularyUtils.create(vocabulary.document!.iri)
    );
    const textAnalysisResult = await backgroundApi.runTextAnalysis(
      vocabulary.iri,
      document.body.outerHTML
    );
    const vocabularyTerms = await api.loadAllTerms(
      VocabularyUtils.create(vocabulary.iri)
    );

    contentState.terms = vocabularyTerms;
    contentState.vocabulary = vocabulary;

    const termOccurrences = TermOccurrenceFactory.createFromTextAnalysisResults(
      textAnalysisResult,
      contentState.website.iri,
      contentState.terms!
    );

    await annotator!.annotatePage(termOccurrences, false);
    contentState.annotations = annotator!.getAnnotations();
    contentState.failedAnnotations = annotator!.getFailedAnnotations();

    await api.savePageAnnotationResults(
      annotator!.getFoundTermOccurrences(),
      contentState.website,
      vocabulary.iri
    );

    contentState.vocabulary.document?.websites.push(contentState.website);

    // update vocabulary cache
    await BrowserApi.storage.set("vocabularies", contentState.vocabularies);

    overlay.off();
    contentState.globalLoading = false;
    // this makes sure to re-render sidebar on data update
    internals.updateSidebar();

    setTimeout(() => {
      internals.updateSidebar();
    }, 200);
  },
  async tryAnnotatingExistingWebsite() {
    contentState.globalLoading = true;
    internals.updateSidebar();

    const foundExistingWebsite = await api.getExistingWebsite(
      contentState.pageUrl,
      contentState.vocabularies
    );

    if (!foundExistingWebsite) {
      contentState.globalLoading = false;
      internals.updateSidebar();
      // website hasn't been annotated yet, wait for explicit user action
      return;
    }

    const { website, vocabulary } = foundExistingWebsite;

    contentState.terms = await api.loadAllTerms(
      VocabularyUtils.create(vocabulary.iri)
    );

    const termOccurrences = await api.getWebsiteTermOccurrences(
      website,
      contentState.terms!
    );
    internals.activatePage();

    await annotator!.annotatePage(termOccurrences);
    contentState.annotations = annotator!.getAnnotations();
    contentState.failedAnnotations = annotator!.getFailedAnnotations();
    contentState.vocabulary = vocabulary;
    contentState.website = website;

    const occurrenceToFocusIri = internals.parseQueryParamAnnotationToFocus();

    if (occurrenceToFocusIri) {
      const foundAnnotation = contentState.annotations.find(
        (annotation) => annotation.termOccurrence.iri === occurrenceToFocusIri
      );
      if (!foundAnnotation) {
        console.warn("Focused annotation not found: ", foundAnnotation);
      } else {
        foundAnnotation.focusAnnotation(AnnotationFocusTime.LONG);
      }
    }

    contentState.globalLoading = false;
    internals.updateSidebar();

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
      await api.saveTermOccurrences(
        [annotation.termOccurrence],
        contentState.website!,
        annotationType,
        contentState.vocabulary!.iri
      );
    }

    internals.updateSidebar();
  },
  async createUnknownOccurrenceFromRange(
    selectionRange: Range,
    annotationType: string
  ) {
    const newTermOccurrence = TermOccurrenceFactory.createFromRange(
      selectionRange,
      annotationType,
      contentState.website?.iri,
      contentState.terms
    );

    const newAnnotation = await annotator!.annotateTermOccurrence(
      newTermOccurrence
    );

    internals.updateSidebar();
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
    await ContentActions.assignTermToOccurrence(
      term,
      annotation,
      AnnotationType.OCCURRENCE
    );
    if (definitionAnnotation) {
      await ContentActions.assignTermToOccurrence(
        term,
        definitionAnnotation,
        AnnotationType.DEFINITION,
        true
      );
    }

    internals.updateSidebar();
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
    const annotationsArray = annotation.isFailed()
      ? contentState.failedAnnotations
      : contentState.annotations;

    const annotationIdx = annotationsArray!.indexOf(annotation);
    annotationsArray?.splice(annotationIdx, 1);

    internals.updateSidebar();
  },
  async removeWebsiteAnnotations() {
    contentState.globalLoading = true;
    internals.updateSidebar();

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

    internals.deactivatePage();
  },
  async removeSuggestedAnnotations() {
    contentState.globalLoading = true;
    internals.updateSidebar();

    annotator!.removeSuggestedOccurrences();

    await api.removeSuggestedOccurrences(
      contentState.vocabulary!.document!,
      contentState.website!
    );

    contentState.globalLoading = false;
    internals.updateSidebar();
  },
  async toggleExtensionActive() {
    contentState.globalLoading = true;
    // if this is ever called, we assume having a logged-in user
    contentState.extensionActive = !contentState.extensionActive;
    await BrowserApi.storage.set(
      Constants.STORAGE.EXTENSION_ACTIVE,
      contentState.extensionActive
    );

    if (contentState.extensionActive) {
      await ContentActions.tryAnnotatingExistingWebsite();
    } else {
      await internals.deactivatePage();
    }
  },
};

window.addEventListener("load", internals.initPage);
// don't wait too long for page load event, which might not fire until loading all unimportant parts (e.g., ads, iframes etc...) -> force it after 5s
setTimeout(internals.initPage, 5000);

const listeners = ["click", "popstate", "locationchange"];

listeners.forEach((listener) =>
  window.addEventListener(listener, internals.handleLocationChange)
);
