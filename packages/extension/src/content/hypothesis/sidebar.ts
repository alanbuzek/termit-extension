import Vocabulary from "../../common/model/Vocabulary";

import { sendErrorsTo } from "../../shared/frame-error-capture";
import { ListenerCollection } from "../../shared/listener-collection";
import { MessageType } from "../../types/messageTypes";
import { createShadowRoot } from "./ContentPopupContainer";
import SidebarContainer from "../components/sidebar/SidebarContainer";
import { ToolbarController } from "./toolbar";
import { ContentState } from "..";
import { Annotation } from "../../common/util/Annotation";

export class Sidebar {
  private sidebarComponent: SidebarContainer;
  private container: HTMLDivElement;
  private hypothesisSidebar: HTMLElement;
  private listeners: any;
  private toolbar: ToolbarController;
  private shadowRoot: ShadowRoot;

  constructor(
    element: HTMLElement,
    state: ContentState,
    handleAnnotatePage: (vocabulary: Vocabulary) => void,
    handleDeleteAnnotation: (annotation: Annotation) => void,
  ) {

    this.container = document.createElement("div");
    this.container.className = "annotator-frame annotator-collapsed termit-sidebar-container";
    this.container.style.marginLeft = "";

    // Wrap up the 'container' element into a shadow DOM so it is not affected by host CSS styles
    this.hypothesisSidebar = document.createElement("hypothesis-sidebar");
    this.shadowRoot = createShadowRoot(this.hypothesisSidebar);
    this.shadowRoot.appendChild(this.container);

    element.appendChild(this.hypothesisSidebar);

    const sidebarContainer = document.createElement(
      "hypothesis-sidebar-container"
    );
    sidebarContainer.style.width = "100%";
    sidebarContainer.style.height = "100%";
    sidebarContainer.style.position = "relative";
    sidebarContainer.style["z-index"] = 3;

    this.container.appendChild(sidebarContainer);
    this.sidebarComponent = new SidebarContainer(
      sidebarContainer,
      state,
      handleAnnotatePage,
      handleDeleteAnnotation
    );
    this.listeners = new ListenerCollection();

    // Set up the toolbar on the left edge of the sidebar.
    const toolbarContainer = document.createElement("div");
    this.toolbar = new ToolbarController(
      toolbarContainer,
      (open) => (open ? this.open() : this.close()),
      state
    );

    chrome.runtime.onMessage.addListener((message) => {
      switch (message.type) {
        case MessageType.OpenToolbar: {
          if (this.toolbar.sidebarOpen) {
            this.close();
          } else {
            this.open();
          }
        }
      }
    });

    this.container.prepend(toolbarContainer);

    this.close();
  }

  destroy() {
    this.listeners.removeAll();
    if (this.hypothesisSidebar) {
      this.hypothesisSidebar.remove();
    }
    this.sidebarComponent?.destroy();

    sendErrorsTo(null);
  }

  open() {
    if (this.container) {
      const width = this.container.getBoundingClientRect().width;
      this.container.style.marginLeft = `${-1 * width}px`;
      this.container.classList.remove("annotator-collapsed");
    }

    this.toolbar.sidebarOpen = true;
  }

  close() {
    if (this.container) {
      this.container.style.marginLeft = "";
      this.container.classList.add("annotator-collapsed");
    }

    this.toolbar.sidebarOpen = false;
  }


  render() {
    this.sidebarComponent.render();
    this.toolbar.render();
  }

  public getShadowRoot() {
    return this.shadowRoot;
  }
}
