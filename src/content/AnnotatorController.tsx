import Annotator from './Annotator';
import Sidebar from './react-tree-container/SidebarContainer';
import Vocabulary from '../termit-ui-common/model/Vocabulary';
import Annotation, { AnnotationFocusTime, AnnotationType } from './Annotation';
import api from '../shared/api';
import VocabularyUtils, { IRI } from '../termit-ui-common/util/VocabularyUtils';
import Term from '../termit-ui-common/model/Term';
import backgroundApi from './util/BackgroundApi';
import Website from '../termit-ui-common/model/Website';
import BrowserApi from '../shared/BrowserApi';
import User from '../termit-ui-common/model/User';
import Constants from '../termit-ui-common/util/Constants';
import DomUtils from './util/ExtensionDomUtils';
import ExtensionMessage from '../shared/ExtensionMessage';
import { SKIP_CACHE } from '../shared/api/cache';
import StyleSheetLoader from './util/StyleSheetLoader';
import StorageUtils from './util/StorageUtils';
import TermOccurrenceFactory from './util/TermOccurrenceFactory';
import PageOverlay from './util/PageOverlay';
import ExtensionDomUtils from './util/ExtensionDomUtils';

export type TermsMap = { [key: string]: Term };

/*
Content script-wide state;
*/
export type ContentState = {
  vocabulary: Vocabulary | null;
  annotations: Annotation[] | null;
  failedAnnotations: Annotation[] | null;
  terms: TermsMap | null;
  website: Website | null;
  vocabularies: Vocabulary[];
  user: User | null;
  extensionActive: boolean;
  globalLoading: boolean;
  pageUrl: string;
  language: string;
  locale: string;
  waitingForAuth: boolean;
  isVocabPrompt: boolean;
  originalPageHtml: string;
  instance: {
    termitServer: string;
    termitUi: string;
    annotaceService: string;
    label: string;
  } | null;
};

// global important classes
let sidebar: Sidebar | null = null;
let annotator: Annotator | null = null;
let hasBeenPageInited = false;

/**
 * global state of the extension
 * all important global content script calls should be done here
 */
const contentState = {} as ContentState;

/**
 * InternalActions represent functions that modify global state and may call APIs,
 * but can only be invoke within this contenxt, and are not exposed to elsewhere, unlike AnnotatorActions that are exposed
 */
const InternalActions = {
  async resetContentState() {
    contentState.annotations = null;
    contentState.failedAnnotations = null;
    contentState.vocabulary = null;
    contentState.terms = null;
    contentState.website = null;
    // NOTE: these two fields, we want to preserve even on content state reset
    // contentState.vocabularies = [];
    // contentState.user = null;
    contentState.globalLoading = false;
    contentState.isVocabPrompt = false;
    contentState.originalPageHtml = '';
    const extensionActive = await BrowserApi.storage.get(
      Constants.STORAGE.EXTENSION_ACTIVE
    );
    contentState.extensionActive =
      typeof extensionActive === 'boolean' ? extensionActive : true;
    contentState.language =
      (await BrowserApi.storage.get(Constants.STORAGE.LANGUAGE)) || 'cs'; // fallback to Czech as default language (not locale)
    contentState.locale =
      (await BrowserApi.storage.get(Constants.STORAGE.LOCALE)) ||
      Constants.DEFAULT_LANGUAGE;

    contentState.instance = await BrowserApi.storage.get(
      Constants.STORAGE.TERMIT_INSTANCE
    );

    if (contentState.instance) {
      await api.initApi(contentState.instance.termitServer);
    }
  },
  async authenticateUser() {
    PageOverlay.on();

    console.log('authenticateUser()');
    annotator!.hidePopup();

    contentState.waitingForAuth = false;
    contentState.globalLoading = true;
    InternalActions.updateSidebar();
    contentState.user = await api.getUser();

    if (!contentState.user) {
      console.error('Inconsistent state! Login event but no user!');
      return;
    }

    contentState.vocabularies = await api.loadVocabularies();

    if (!contentState.vocabularies.length) {
      await api.createDefaultVocabulary();
      contentState.vocabularies = await api.loadVocabularies(SKIP_CACHE);
      // create default vocabulary
    }

    if (!contentState.vocabularies.length) {
      throw new Error('Failed to create default vocabulary!!');
    }

    if (contentState.vocabularies.length > 1) {
      contentState.globalLoading = false;
      contentState.isVocabPrompt = true;
      sidebar?.open();
      InternalActions.updateSidebar();
      return;
    }
    [contentState.vocabulary] = contentState.vocabularies;

    await AnnotatorActions.setupLoggedInUser(contentState.vocabulary);
  },
  isAnonymous() {
    return !contentState.user;
  },
  async initPage() {
    if (hasBeenPageInited) {
      return;
    }

    hasBeenPageInited = true;
    contentState.pageUrl = DomUtils.getPageUrl();

    // we don't support pdf pages so far
    if (DomUtils.isPagePDFViewer()) {
      return;
    }

    await InternalActions.resetContentState();
    contentState.user = await api.getUser();
    StyleSheetLoader.preloadContentStylesheets();

    if (contentState.user && !contentState.instance) {
      // data inconcistency -> cleanup and init page
      await StorageUtils.clearStorageOnLogout();
      InternalActions.initPage();
      return;
    }

    if (!contentState.user) {
      InternalActions.initSidebar();
      return;
    }
    contentState.vocabularies = await api.loadVocabularies();

    InternalActions.initSidebar();

    if (contentState.extensionActive) {
      await InternalActions.annotateExistingWebsite();
    }
  },
  updateSidebar() {
    sidebar?.render();
  },
  activatePage() {
    annotator = new Annotator(document.body, contentState);
    // save this in its original form, without annotations, if we want to run annotation multiple times
    contentState.originalPageHtml = `${document.body.outerHTML}`;
    // so that reactboostrap works fine (needs be able to query select elements withing shadow dom)
    ExtensionDomUtils.exposeShadowDomInQuerySelectorAll(annotator, sidebar!);
  },
  async deactivatePage() {
    ExtensionDomUtils.resetQuerySelectorAll();
    // reset page
    annotator?.destroy();
    annotator = null;
    await InternalActions.resetContentState();

    PageOverlay.off();
    contentState.globalLoading = false;
    InternalActions.updateSidebar();
  },
  async initSidebar() {
    sidebar = new Sidebar(
      document.body,
      contentState,
      AnnotatorActions.annotateNewWebsite,
      AnnotatorActions.removeOccurrence
    );
  },

  handleLocationChange() {
    if (!contentState.pageUrl) {
      // location changed before we page inited
      return;
    }

    if (contentState.pageUrl !== DomUtils.getPageUrl()) {
      console.log('change detected!');
      // new url detected -> deactivate last page and try annotating again
      contentState.pageUrl = DomUtils.getPageUrl();

      InternalActions.deactivatePage();
      contentState.globalLoading = true;
      InternalActions.updateSidebar();

      // avoid any possible race condions
      setTimeout(() => {
        InternalActions.annotateExistingWebsite();
      }, 100);
    }
  },
  async annotateExistingWebsite() {
    if (InternalActions.isAnonymous()) {
      return;
    }

    contentState.globalLoading = true;
    InternalActions.updateSidebar();

    const foundExistingWebsite = await api.getExistingWebsite(
      contentState.pageUrl,
      contentState.vocabularies
    );

    if (!foundExistingWebsite) {
      contentState.globalLoading = false;
      InternalActions.updateSidebar();
      // website hasn't been annotated yet, wait for explicit user action
      return;
    }

    // refresh vocabularies cache for later
    api.loadVocabularies(SKIP_CACHE);

    const { website, vocabulary } = foundExistingWebsite;

    contentState.terms = await api.loadAllTerms(
      VocabularyUtils.create(vocabulary.iri)
    );

    const termOccurrences = await api.getWebsiteTermOccurrences(
      website,
      contentState.terms!
    );
    InternalActions.activatePage();

    await annotator!.annotatePage(termOccurrences);
    contentState.annotations = annotator!.getAnnotations();
    contentState.failedAnnotations = annotator!.getFailedAnnotations();
    contentState.vocabulary = vocabulary;
    contentState.website = website;

    const occurrenceToFocusIri =
      ExtensionDomUtils.parseQueryParamAnnotationToFocus();

    if (occurrenceToFocusIri) {
      const foundAnnotation = contentState.annotations.find(
        (annotation) => annotation.termOccurrence.iri === occurrenceToFocusIri
      );
      if (!foundAnnotation) {
        console.warn('Focused annotation not found: ', foundAnnotation);
      } else {
        foundAnnotation.focusAnnotation(AnnotationFocusTime.LONG);
      }
    }

    contentState.globalLoading = false;
    InternalActions.updateSidebar();

    setTimeout(() => {
      sidebar!.open();
    }, 200);
  },
};

/**
 * InternalActions represent functions that modify global state and may call APIs,
 * and exposed to React components to call
 */
export const AnnotatorActions = {
  showPopup(annotation: Annotation) {
    annotator!.showPopup(annotation);
  },
  async annotateNewWebsite(vocabulary?: Vocabulary) {
    contentState.globalLoading = true;
    InternalActions.updateSidebar();
    InternalActions.activatePage();

    const textAnalysisResult = await backgroundApi.runPageTextAnalysis(
      // maybe cache this outerHTML as a string?
      contentState.originalPageHtml,
      vocabulary?.iri
    );

    if (!InternalActions.isAnonymous()) {
      // refresh vocabularies cache for later
      api.loadVocabularies(SKIP_CACHE);

      contentState.website = await api.createWebsiteInDocument(
        contentState.pageUrl,
        VocabularyUtils.create(vocabulary!.document!.iri)
      );

      contentState.vocabulary = vocabulary!;
      contentState.vocabulary!.document?.websites.push(contentState.website!);

      // update vocabulary cache
      await BrowserApi.storage.set('vocabularies', contentState.vocabularies);

      const vocabularyTerms = await api.loadAllTerms(
        VocabularyUtils.create(vocabulary!.iri)
      );

      contentState.terms = vocabularyTerms;
    }

    const termOccurrences = TermOccurrenceFactory.createFromTextAnalysisResults(
      textAnalysisResult,
      contentState.website?.iri,
      contentState.terms
    );

    await annotator!.annotatePage(termOccurrences, true);
    contentState.annotations = annotator!.getAnnotations();
    contentState.failedAnnotations = annotator!.getFailedAnnotations();

    if (!InternalActions.isAnonymous()) {
      await api.savePageAnnotationResults(
        annotator!.getFoundTermOccurrences(),
        contentState.website!,
        vocabulary!.iri
      );
    }

    PageOverlay.off();
    contentState.globalLoading = false;
    // this makes sure to re-render sidebar on data update
    InternalActions.updateSidebar();

    setTimeout(() => {
      InternalActions.updateSidebar();
    }, 200);
  },

  async assignTermToOccurrence(
    term: Term,
    annotation: Annotation,
    annotationType: string,
    isDuringTermCreation = false
  ) {
    if (InternalActions.isAnonymous()) {
      annotator!.hidePopup();

      return;
    }

    // const originalTerm = annotation.term;
    annotation.assignTerm(term);
    annotator!.hidePopup();
    const hasBeenPersisted = !!annotation.termOccurrence.iri;
    const isDefinition = annotationType === AnnotationType.DEFINITION;

    if (isDefinition) {
      if (hasBeenPersisted) {
        // if we got here, we must be reassigning definition to a new element -> delete old definition source
        await api.removeOccurrence(annotation.termOccurrence);
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
          [contentState.language]: annotation.termOccurrence
            .getTextQuoteSelector()
            .exactMatch.replace(/(\r\n|\n|\r)/gm, ' '),
        };

        // eslint-disable-next-line no-param-reassign
        term.definition = {
          ...term.definition,
          [contentState.language]: annotation.termOccurrence
            .getTextQuoteSelector()
            .exactMatch.replace(/(\r\n|\n|\r)/gm, ' '),
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
        contentState.vocabulary!.iri
      );
    }

    InternalActions.updateSidebar();
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

    InternalActions.updateSidebar();
    return newAnnotation;
  },
  async createTerm(
    term: Term,
    vocabularyIri: IRI,
    annotation: Annotation,
    definitionAnnotation?: Annotation
  ) {
    await api.createTerm(term, vocabularyIri);
    contentState.terms![term.iri] = term;
    // eslint-disable-next-line no-param-reassign
    term.vocabulary = {
      iri: contentState!.vocabulary!.iri,
      types: contentState!.vocabulary!.types,
    };
    await AnnotatorActions.assignTermToOccurrence(
      term,
      annotation,
      AnnotationType.OCCURRENCE
    );
    if (definitionAnnotation) {
      await AnnotatorActions.assignTermToOccurrence(
        term,
        definitionAnnotation,
        AnnotationType.DEFINITION,
        true
      );
    }

    InternalActions.updateSidebar();
  },
  async removeOccurrence(annotation: Annotation) {
    await annotation.removeOccurrence();
    if (annotation.termOccurrence.iri && !InternalActions.isAnonymous()) {
      if (annotation.isDefinition() && annotation.term) {
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

    InternalActions.updateSidebar();
  },
  async removeWebsiteAnnotations() {
    if (InternalActions.isAnonymous()) {
      InternalActions.deactivatePage();
      return;
    }
    PageOverlay.on();

    contentState.globalLoading = true;
    InternalActions.updateSidebar();

    await api.removeWebsiteFromDocument(
      contentState.vocabulary!.document!,
      contentState.website!
    );
    contentState.vocabulary!.document!.websites =
      contentState.vocabulary!.document!.websites.filter(
        (w) => w.iri !== contentState.website!.iri
      );
    // update vocabulary cache
    await BrowserApi.storage.set('vocabularies', contentState.vocabularies);

    InternalActions.deactivatePage();
  },
  async removeSuggestedAnnotations() {
    contentState.globalLoading = true;
    InternalActions.updateSidebar();

    annotator!.removeSuggestedOccurrences();

    if (!InternalActions.isAnonymous()) {
      await api.removeSuggestedOccurrences(
        contentState.vocabulary!.document!,
        contentState.website!
      );
    }

    contentState.globalLoading = false;
    InternalActions.updateSidebar();
  },
  async toggleExtensionActive() {
    // if this is ever called, we assume having a logged-in user

    contentState.globalLoading = true;
    contentState.extensionActive = !contentState.extensionActive;
    await BrowserApi.storage.set(
      Constants.STORAGE.EXTENSION_ACTIVE,
      contentState.extensionActive
    );

    if (contentState.extensionActive) {
      await InternalActions.annotateExistingWebsite();
    } else {
      await InternalActions.deactivatePage();
    }
  },
  async handleInstanceSelected(currentInstance) {
    if (contentState.user) {
      // cleanup
      await StorageUtils.clearWholeStorage();
      return;
    }

    await BrowserApi.storage.set(
      Constants.STORAGE.TERMIT_INSTANCE,
      currentInstance
    );
    contentState.instance = currentInstance;
    await api.initApi(contentState.instance!.termitServer);
    await backgroundApi.setWaitingForAuth();
    InternalActions.updateSidebar();
    contentState.waitingForAuth = true;
  },

  async setupLoggedInUser(vocabulary: Vocabulary) {
    contentState.globalLoading = true;
    InternalActions.updateSidebar();
    contentState.vocabulary = vocabulary;

    const foundExistingWebsite = await api.getExistingWebsite(
      contentState.pageUrl,
      contentState.vocabularies
    );

    if (foundExistingWebsite) {
      // turns out the user already has this page annotated -> just reload and have it fallback to existing page
      // eslint-disable-next-line no-restricted-globals
      location.reload();
      return;
    }

    contentState.website = await api.createWebsiteInDocument(
      contentState.pageUrl,
      VocabularyUtils.create(contentState.vocabulary!.document!.iri)
    );

    contentState.vocabulary!.document!.websites.push(contentState.website!);

    // update vocabulary cache
    await BrowserApi.storage.set('vocabularies', contentState.vocabularies);

    const vocabularyTerms = await api.loadAllTerms(
      VocabularyUtils.create(contentState.vocabulary!.iri)
    );

    contentState.terms = vocabularyTerms;

    const textAnalysisResult = await backgroundApi.runPageTextAnalysis(
      contentState.originalPageHtml,
      contentState.vocabulary!.iri
    );

    // generic suggestions should be the same from back-end now, so to avoid duplicates, let's remove them now
    // (this will leave any manually created unassigned occurrences by the previously anoymous user)
    annotator!.removeSuggestedOccurrences();

    const newTermOccurrences =
      TermOccurrenceFactory.createFromTextAnalysisResults(
        textAnalysisResult,
        contentState.website?.iri,
        contentState.terms
      );

    await annotator!.annotatePage(newTermOccurrences, true);

    await api.savePageAnnotationResults(
      annotator!.getFoundTermOccurrences(),
      contentState.website!,
      contentState.vocabulary!.iri
    );

    PageOverlay.off();
    contentState.globalLoading = false;
    contentState.isVocabPrompt = false;
    // this makes sure to re-render sidebar on data update
    InternalActions.updateSidebar();
  },
  async saveUnassignedOccurrence(annotation: Annotation) {
    if (InternalActions.isAnonymous()) {
      return;
    }
    await api.saveTermOccurrences(
      [annotation.termOccurrence],
      contentState.website!,
      contentState.vocabulary!.iri
    );

    InternalActions.updateSidebar();
  },
};

window.addEventListener('load', InternalActions.initPage);
// don't wait too long for page load event, which might not fire until loading all unimportant parts (e.g., ads, iframes etc...) -> force it after 5s
setTimeout(InternalActions.initPage, 5000);

const listeners = ['click', 'popstate', 'locationchange'];
listeners.forEach((listener) =>
  window.addEventListener(listener, InternalActions.handleLocationChange)
);

chrome.runtime.onMessage.addListener(handleMessages);

function handleMessages(message, sender, sendResponse) {
  // eslint-disable-next-line default-case
  switch (message.type) {
    case ExtensionMessage.LoginEvent: {
      if (contentState.waitingForAuth) {
        InternalActions.authenticateUser();
      }
    }
  }

  sendResponse({ success: true });
  return true;
}
