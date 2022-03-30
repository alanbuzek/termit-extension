import Annotator from "./hypothesis/Annotator";
import { Sidebar } from "./hypothesis/Sidebar";
import Vocabulary from "../common/model/Vocabulary";
import { preloadContentStyles } from "./hypothesis/helpers";
import { overlay } from "./helper/overlay";
import { Annotation } from "../common/util/Annotation";
import api from "../api";
import VocabularyUtils from "../common/util/VocabularyUtils";
import Term from "../common/model/Term";

// global important classes
let sidebar: Sidebar | null = null;
let annotator: Annotator | null = null;

export type ContentState = {
  vocabulary: Vocabulary | null;
  annotations: Annotation[] | null;
  terms: { [key: string]: Term } | null;
};

const contentState: ContentState = {
  annotations: null,
  vocabulary: null,
  terms: null,
};

// TODO: re-evaluate how things are done with respect to annotator, maybe can move all things there instead?
/**
 * all important global content script calls should be done here
 */
export const globalActions = {
  showPopup(annotation: Annotation) {
    annotator!.showPopup(annotation);
  },
  async annotatePage(vocabulary: Vocabulary) {
    await annotator!.annotatePage(vocabulary);

    contentState.vocabulary = vocabulary;
    contentState.annotations = annotator!.getAnnotations();
    const vocabularyTerms = await api.loadAllTerms(
      VocabularyUtils.create(vocabulary.iri)
    );
    contentState.terms = vocabularyTerms;
    // this makes sure to re-render sidebar on data update
    // TODO: is this needed? what is the best way this to ensure this is working?
    console.log('contentState: ', contentState);
    sidebar!.render();
  },
};

window.addEventListener("load", async () => {
  overlay.init();
  preloadContentStyles();
  initSidebar();

  annotator = new Annotator(document.body, contentState);
});

function initSidebar() {
  sidebar = new Sidebar(
    document.body,
    // TODO: maybe not pass the whole state inside, or restructure state such that it doesn't contain whole classes instances of Annotator and Sidebar
    contentState,
    globalActions.annotatePage
  );
}
