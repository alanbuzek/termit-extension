import Vocabulary from "../../common/model/Vocabulary";

import { sendErrorsTo } from "../../shared/frame-error-capture";
import { ListenerCollection } from "../../shared/listener-collection";
import { MessageType } from "../../types/messageTypes";
import { createShadowRoot } from "./ContentPopupContainer";
import SidebarContainer from "../components/sidebar/SidebarContainer";
import { ToolbarController } from "./toolbar";
import { ContentState } from "..";
import { BucketBar } from "./BucketBar";
import { Annotation } from "../../common/util/Annotation";

// Minimum width to which the iframeContainer can be resized.
export const MIN_RESIZE = 280;

/**
 * The `Sidebar` class creates (1) the sidebar application, (2) its container,
 * as well as (3) the adjacent controls.
 *
 * @implements {Destroyable}
 */
export class Sidebar {
  private config: {};
  private sidebarComponent: SidebarContainer;
  private bucketBar: BucketBar;
  private iframeContainer: HTMLDivElement;
  private hypothesisSidebar: HTMLElement;
  private listeners: any;
  private toolbar: any;
  private shadowRoot: ShadowRoot;

  /**
   * @param {HTMLElement} element
   * @param {import('./util/emitter').EventBus} eventBus -
   *   Enables communication between components sharing the same eventBus
   * @param {Record<string, any>} [config]
   */
  constructor(
    element: HTMLElement,
    state: ContentState,
    handleAnnotatePage: (vocabulary: Vocabulary) => void,
    handleDeleteAnnotation: (annotation: Annotation) => void,
    config: Record<string, any> = {}
  ) {
    this.config = config;

    this.iframeContainer = document.createElement("div");
    this.iframeContainer.className = "annotator-frame";

    this.bucketBar = new BucketBar(this.iframeContainer, {
      onFocusAnnotations: (tags) => {
        console.log("BucketBar: onFocusAnnotations");
      },
      onScrollToClosestOffScreenAnchor: (tags, direction) =>
        console.log("onScrollToClosestOffScreenAnchor"),
      onSelectAnnotations: (tags, toggle) => console.log("onSelectAnnotations"),
    });

    // Wrap up the 'iframeContainer' element into a shadow DOM so it is not affected by host CSS styles
    this.hypothesisSidebar = document.createElement("hypothesis-sidebar");
    this.shadowRoot = createShadowRoot(this.hypothesisSidebar);
    this.shadowRoot.appendChild(this.iframeContainer);

    element.appendChild(this.hypothesisSidebar);

    const sidebarContainer = document.createElement(
      "hypothesis-sidebar-container"
    );
    sidebarContainer.style.width = "100%";
    sidebarContainer.style.height = "100%";
    sidebarContainer.style.position = "relative";
    sidebarContainer.style["z-index"] = 3;

    this.iframeContainer.appendChild(sidebarContainer);
    this.sidebarComponent = new SidebarContainer(
      sidebarContainer,
      state,
      handleAnnotatePage,
      handleDeleteAnnotation
    );
    this.listeners = new ListenerCollection();

    // Set up the toolbar on the left edge of the sidebar.
    const toolbarContainer = document.createElement("div");
    this.toolbar = new ToolbarController(toolbarContainer, {
      createAnnotation: () => {
        // TODO: is this needed?
      },
      setSidebarOpen: (open) => (open ? this.open() : this.close()),
      setHighlightsVisible: (show) => this.setHighlightsVisible(show),
    });

    // TODO: add listener to promisify browserApi abstraction
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.type) {
        case MessageType.OpenToolbar: {
          if (this.toolbar.sidebarOpen) {
            this.close();
          } else {
            this.open();
          }
        }
      }
      return true;
    });

    if (config.theme === "clean") {
      this.toolbar.useMinimalControls = true;
    } else {
      this.toolbar.useMinimalControls = false;
    }

    this.iframeContainer.prepend(toolbarContainer);
    this.toolbarWidth = this.toolbar.getWidth();

    this.listeners.add(window, "resize", () => this._onResize());

    this.close();

    this.onLayoutChange = config.onLayoutChange;
  }

  destroy() {
    this.bucketBar?.destroy();
    this.listeners.removeAll();
    if (this.hypothesisSidebar) {
      this.hypothesisSidebar.remove();
    }
    this.sidebarComponent.destroy();

    sendErrorsTo(null);
  }

  /**
   *  On window resize events, update the marginLeft of the sidebar by calling hide/show methods.
   */
  _onResize() {
    if (this.toolbar.sidebarOpen === true) {
      if (window.innerWidth < MIN_RESIZE) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  open() {
    // this._sidebarRPC.call("sidebarOpened");

    if (this.iframeContainer) {
      const width = this.iframeContainer.getBoundingClientRect().width;
      this.iframeContainer.style.marginLeft = `${-1 * width}px`;
      this.iframeContainer.classList.remove("annotator-collapsed");
    }

    this.toolbar.sidebarOpen = true;

    if (this.config.showHighlights === "whenSidebarOpen") {
      this.setHighlightsVisible(true);
    }
  }

  close() {
    if (this.iframeContainer) {
      this.iframeContainer.style.marginLeft = "";
      this.iframeContainer.classList.add("annotator-collapsed");
    }

    this.toolbar.sidebarOpen = false;

    if (this.config.showHighlights === "whenSidebarOpen") {
      this.setHighlightsVisible(false);
    }
  }

  /**
   * Set whether highlights are visible in guest frames.
   *
   * @param {boolean} visible
   */
  setHighlightsVisible(visible: boolean) {
    this.toolbar.highlightsVisible = visible;
  }

  /**
   * Shows the sidebar's controls
   */
  show() {
    if (this.iframeContainer) {
      this.iframeContainer.classList.remove("is-hidden");
    }
  }

  /**
   * Hides the sidebar's controls
   */
  hide() {
    if (this.iframeContainer) {
      this.iframeContainer.classList.add("is-hidden");
    }
  }

  render() {
    this.sidebarComponent.render();
  }

  public getShadowRoot() {
    return this.shadowRoot;
  }
}
