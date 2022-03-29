import Annotator from "./hypothesis/Annotator";
import { Sidebar } from "./hypothesis/Sidebar";
import Vocabulary from "../common/model/Vocabulary";
import { preloadContentStyles } from "./hypothesis/helpers";
import { overlay } from "./helper/overlay";

export type ContentState = {
  sidebar?: Sidebar | null;
  annotator: Annotator | null;
};

const contentState: ContentState = {
  sidebar: null,
  annotator: null,
};

// TODO: re-evaluate how things are done with respect to annotator, maybe can move all things there instead?
/**
 * all important global content script calls should be done here
 */
export const globalActions = {
  showPopup(annotation) {
    contentState.annotator?.showPopup(annotation);
  },
};

window.addEventListener("load", async () => {
  overlay.init();
  preloadContentStyles();
  initSidebar();

  contentState.annotator = new Annotator(document.body);
});

function initSidebar() {
  contentState.sidebar = new Sidebar(
    document.body,
    // TODO: maybe not pass the whole state inside, or restructure state such that it doesn't contain whole classes instances of Annotator and Sidebar
    contentState,
    async (vocabulary: Vocabulary) => {
      await contentState.annotator?.annotatePage(vocabulary);
      contentState.sidebar?.render();
    }
  );
}
