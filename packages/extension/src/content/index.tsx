import Annotator from "./hypothesis/Annotator";
import { Sidebar } from "./hypothesis/Sidebar";
import Vocabulary from "../common/model/Vocabulary";
import { preloadURL } from "./hypothesis/helpers";
import { overlay } from "./helper/overlay";

export type ContentState = {
  sidebar: Sidebar | null;
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
  showPopup(element, termOccurrence) {
    if (!contentState.annotator) {
      return;
    }
    contentState.annotator.showPopup(element, termOccurrence);
  },
};

window.addEventListener("load", async () => {
  overlay.init();

  const styleSheetsToLoad = [
    "/static/css/annotator.css",
    "/static/css/styles.css",
    "/static/css/bootstrap-termit.css",
  ];

  styleSheetsToLoad.forEach((stylesheetPath) =>
    preloadURL(document, "style", chrome.runtime.getURL(stylesheetPath))
  );

  initSidebar();

  contentState.annotator = new Annotator(document.body);
});

function initSidebar() {
  contentState.sidebar = new Sidebar(
    document.body,
    contentState,
    async (vocabulary: Vocabulary) => {
      await contentState.annotator?.annotatePage(vocabulary);
      contentState.sidebar?.render();
    }
  );
}
