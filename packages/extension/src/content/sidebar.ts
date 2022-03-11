import Hammer from "hammerjs";

import { sendErrorsTo } from "../shared/frame-error-capture";
import { ListenerCollection } from "../shared/listener-collection";
import { MessageType } from "../types";
import { createShadowRoot } from "./adder";

import { annotationCounts } from "./annotation-counts";
import { BucketBar } from "./bucket-bar";
// import { createAppConfig } from './config/app';
import { features } from "./features";
import { sidebarTrigger } from "./sidebar-trigger";
import SidebarBox from "./SidebarBox";
import { ToolbarController } from "./toolbar";

/**
 * @typedef {import('./guest').Guest} Guest
 * @typedef {import('../types/annotator').AnchorPosition} AnchorPosition
 * @typedef {import('../types/annotator').SidebarLayout} SidebarLayout
 * @typedef {import('../types/annotator').Destroyable} Destroyable
 * @typedef {import('../types/port-rpc-events').GuestToHostEvent} GuestToHostEvent
 * @typedef {import('../types/port-rpc-events').HostToGuestEvent} HostToGuestEvent
 * @typedef {import('../types/port-rpc-events').HostToSidebarEvent} HostToSidebarEvent
 * @typedef {import('../types/port-rpc-events').SidebarToHostEvent} SidebarToHostEvent
 */

// Minimum width to which the iframeContainer can be resized.
export const MIN_RESIZE = 280;

/**
 * Create the iframe that will load the sidebar application.
 *
 * @return {HTMLIFrameElement}
 */
function createSidebarIframe(config): HTMLIFrameElement {
  // const sidebarAppSrc = addConfigFragment(
  //   config.sidebarAppUrl,
  //   createAppConfig(config.sidebarAppUrl, config)
  // );
  const sidebarAppSrc = "";

  const sidebarFrame = document.createElement("iframe");

  // Enable media in annotations to be shown fullscreen
  sidebarFrame.setAttribute("allowfullscreen", "");

  sidebarFrame.src = sidebarAppSrc;
  sidebarFrame.title = "Hypothesis annotation viewer";
  sidebarFrame.className = "h-sidebar-iframe";

  return sidebarFrame;
}

/**
 * The `Sidebar` class creates (1) the sidebar application iframe, (2) its container,
 * as well as (3) the adjacent controls.
 *
 * @implements {Destroyable}
 */
export class Sidebar {
  _emitter: any;
  _guestWithSelection: null;
  _guestRPC: never[];
  iframe: HTMLIFrameElement;
  _config: {};
  _sidebar: any;
  bucketBar: null;
  externalFrame: any;
  iframeContainer: HTMLDivElement;
  hypothesisSidebar: HTMLElement;
  _listeners: any;
  toolbar: any;
  toolbarWidth: any;
  _gestureState: {
    // Initial position at the start of a drag/pan resize event (in pixels).
    initial: null;
    // Final position at end of drag resize event.
    final: null;
  };
  onLoginRequest: any;
  onLogoutRequest: any;
  onSignupRequest: any;
  onProfileRequest: any;
  onHelpRequest: any;
  onLayoutChange: any;
  _sidebarRPC: any;
  _hammerManager: any;
  renderFrame: any;
  /**
   * @param {HTMLElement} element
   * @param {import('./util/emitter').EventBus} eventBus -
   *   Enables communication between components sharing the same eventBus
   * @param {Record<string, any>} [config]
   */
  constructor(
    element: HTMLElement,
    eventBus: any,
    state: any,
    annotatePage: any,
    config: Record<string, any> = {}
  ) {
    this._emitter = eventBus.createEmitter();

    /**
     * Tracks which `Guest` has a text selection. `null` indicates to default
     * to the first connected guest frame.
     *
     * @type {PortRPC|null}
     */
    this._guestWithSelection = null;

    /**
     * Channels for host-guest communication.
     *
     * @type {PortRPC<GuestToHostEvent, HostToGuestEvent>[]}
     */
    this._guestRPC = [];

    /**
     * Channel for host-sidebar communication.
     *
     * @type {PortRPC<SidebarToHostEvent, HostToSidebarEvent>}
     */
    // this._sidebarRPC = new PortRPC();

    /**
     * The `<iframe>` element containing the sidebar application.
     */
    // this.iframe = createSidebarIframe(config);

    this._config = config;

    /** @type {BucketBar|null} */
    this.bucketBar = null;

    // if (config.externalContainerSelector) {
    //   this.externalFrame =
    //     /** @type {HTMLElement} */
    //     (document.querySelector(config.externalContainerSelector)) ?? element;
    //   this.externalFrame.appendChild(this.iframe);
    // } else {
    this.iframeContainer = document.createElement("div");
    // this.iframeContainer.style.display = "none";
    this.iframeContainer.className = "annotator-frame";

    // if (config.theme === "clean") {
    //   this.iframeContainer.classList.add("annotator-frame--theme-clean");
    // } else {
    this.bucketBar = new BucketBar(this.iframeContainer, {
      onFocusAnnotations: (tags) =>
        this._guestRPC.forEach((rpc) => rpc.call("focusAnnotations", tags)),
      onScrollToClosestOffScreenAnchor: (tags, direction) =>
        this._guestRPC.forEach((rpc) =>
          rpc.call("scrollToClosestOffScreenAnchor", tags, direction)
        ),
      onSelectAnnotations: (tags, toggle) =>
        this._guestRPC.forEach((rpc) =>
          rpc.call("selectAnnotations", tags, toggle)
        ),
    });
    // }

    // this.iframeContainer.appendChild(this.iframe);

    // Wrap up the 'iframeContainer' element into a shadow DOM so it is not affected by host CSS styles
    this.hypothesisSidebar = document.createElement("hypothesis-sidebar");
    const shadowRoot = createShadowRoot(this.hypothesisSidebar);
    shadowRoot.appendChild(this.iframeContainer);

    element.appendChild(this.hypothesisSidebar);

    const sidebarContainer = document.createElement(
      "hypothesis-sidebar-container"
    );
    sidebarContainer.style.width = "100%";
    sidebarContainer.style.height = "100%";
    sidebarContainer.style.position = "relative";
    sidebarContainer.style["z-index"] = 3;

    this.iframeContainer.appendChild(sidebarContainer);

    this._sidebar = new SidebarBox(sidebarContainer, state, annotatePage);

    // Register the sidebar as a handler for Hypothesis errors in this frame.
    // if (this.iframe.contentWindow) {
    //   sendErrorsTo(this.iframe.contentWindow);
    // }

    this._listeners = new ListenerCollection();

    // Set up the toolbar on the left edge of the sidebar.
    const toolbarContainer = document.createElement("div");
    this.toolbar = new ToolbarController(toolbarContainer, {
      createAnnotation: () => {
        if (this._guestRPC.length === 0) {
          return;
        }

        const rpc = this._guestWithSelection ?? this._guestRPC[0];
        rpc.call("createAnnotation");
      },
      setSidebarOpen: (open) => (open ? this.open() : this.close()),
      setHighlightsVisible: (show) => this.setHighlightsVisible(show),
    });

    console.log("registering listener");
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("got message");
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

    // if (this.iframeContainer) {
    // If using our own container frame for the sidebar, add the toolbar to it.
    this.iframeContainer.prepend(toolbarContainer);
    this.toolbarWidth = this.toolbar.getWidth();
    // console.log('added toolbar container: ', this.iframeContainer, ', toolbar Contatiner')
    // } else {
    //   // If using a host-page provided container for the sidebar, the toolbar is
    //   // not shown.
    //   this.toolbarWidth = 0;
    // }

    this._listeners.add(window, "resize", () => this._onResize());

    this._gestureState = {
      // Initial position at the start of a drag/pan resize event (in pixels).
      initial: /** @type {number|null} */ null,

      // Final position at end of drag resize event.
      final: /** @type {number|null} */ null,
    };
    this._setupGestures();
    this.close();

    // Publisher-provided callback functions
    const [serviceConfig] = config.services || [];
    if (serviceConfig) {
      this.onLoginRequest = serviceConfig.onLoginRequest;
      this.onLogoutRequest = serviceConfig.onLogoutRequest;
      this.onSignupRequest = serviceConfig.onSignupRequest;
      this.onProfileRequest = serviceConfig.onProfileRequest;
      this.onHelpRequest = serviceConfig.onHelpRequest;
    }

    this.onLayoutChange = config.onLayoutChange;

    // Initial layout notification
    this._notifyOfLayoutChange(false);
    this._setupSidebarEvents();
  }

  destroy() {
    this._guestRPC.forEach((rpc) => rpc.destroy());
    this._sidebarRPC?.destroy();
    this.bucketBar?.destroy();
    this._listeners.removeAll();
    this._hammerManager?.destroy();
    if (this.hypothesisSidebar) {
      this.hypothesisSidebar.remove();
    } else {
      this.iframe.remove();
    }
    this._emitter.destroy();

    // Unregister the sidebar iframe as a handler for errors in this frame.
    sendErrorsTo(null);
  }

  /**
   * Setup communication with a frame that has connected to the host.
   *
   * @param {'guest'|'sidebar'} source
   * @param {MessagePort} port
   */
  onFrameConnected(source: "guest" | "sidebar", port: MessagePort) {
    switch (source) {
      case "guest":
        this._connectGuest(port);
        break;
      case "sidebar":
        this._sidebarRPC.connect(port);
        break;
    }
  }

  /**
   * @param {MessagePort} port
   */
  _connectGuest(port: MessagePort) {
    /** @type {PortRPC<GuestToHostEvent, HostToGuestEvent>} */
    const guestRPC: PortRPC<GuestToHostEvent, HostToGuestEvent> = new PortRPC();

    // guestRPC.on("textSelected", () => {
    //   this._guestWithSelection = guestRPC;
    //   this.toolbar.newAnnotationType = "annotation";
    //   this._guestRPC
    //     .filter((port) => port !== guestRPC)
    //     .forEach((rpc) => rpc.call("clearSelection"));
    // });

    // guestRPC.on("textUnselected", () => {
    //   this._guestWithSelection = null;
    //   this.toolbar.newAnnotationType = "note";
    //   this._guestRPC
    //     .filter((port) => port !== guestRPC)
    //     .forEach((rpc) => rpc.call("clearSelection"));
    // });

    // The listener will do nothing if the sidebar doesn't have a bucket bar
    // (clean theme)
    const bucketBar = this.bucketBar;
    // Currently, we ignore `anchorsChanged` for all the guests except the first connected guest.
    if (bucketBar) {
      // guestRPC.on(
      //   "anchorsChanged",
      //   (
      //     /** @param {AnchorPosition[]} positions  */
      //     positions: AnchorPosition[]
      //   ) => {
      //     if (this._guestRPC.indexOf(guestRPC) === 0) {
      //       bucketBar.update(positions);
      //     }
      //   }
      // );
    }

    // guestRPC.on("close", () => {
    //   guestRPC.destroy();
    //   if (guestRPC === this._guestWithSelection) {
    //     this._guestWithSelection = null;
    //   }
    //   this._guestRPC = this._guestRPC.filter((rpc) => rpc !== guestRPC);
    // });

    // guestRPC.connect(port);
    this._guestRPC.push(guestRPC);
  }

  _setupSidebarEvents() {
    annotationCounts(document.body, this._sidebarRPC);
    sidebarTrigger(document.body, () => this.open());
    features.init(this._sidebarRPC);

    // this._sidebarRPC.on("connect", () => {
    //   // Show the UI
    //   if (this.iframeContainer) {
    //     this.iframeContainer.style.display = "";
    //   }

    //   const showHighlights = this._config.showHighlights === "always";
    //   this.setHighlightsVisible(showHighlights);

    //   if (
    //     this._config.openSidebar ||
    //     this._config.annotations ||
    //     this._config.query ||
    //     this._config.group
    //   ) {
    //     this.open();
    //   }
    // });

    // this._sidebarRPC.on("showHighlights", () =>
    //   this.setHighlightsVisible(true)
    // );

    // this._sidebarRPC.on("openSidebar", () => this.open());

    // this._sidebarRPC.on("closeSidebar", () => this.close());

    // // Sidebar listens to the `openNotebook` event coming from the sidebar's
    // // iframe and re-publishes it via the emitter to the Notebook
    // this._sidebarRPC.on(
    //   "openNotebook",
    //   (/** @param {string} groupId */ groupId: string) => {
    //     this.hide();
    //     this._emitter.publish("openNotebook", groupId);
    //   }
    // );

    this._emitter.subscribe("closeNotebook", () => {
      this.show();
    });

    const eventHandlers: Array<[any, Function]> = [
      ["loginRequested", this.onLoginRequest],
      ["logoutRequested", this.onLogoutRequest],
      ["signupRequested", this.onSignupRequest],
      ["profileRequested", this.onProfileRequest],
      ["helpRequested", this.onHelpRequest],
    ];
    eventHandlers.forEach(([event, handler]) => {
      if (handler) {
        // this._sidebarRPC.on(event, () => handler());
      }
    });
  }

  _resetGestureState() {
    this._gestureState = { initial: null, final: null };
  }

  _setupGestures() {
    const toggleButton = this.toolbar.sidebarToggleButton;
    if (toggleButton) {
      this._hammerManager = new Hammer.Manager(toggleButton).on(
        "panstart panend panleft panright",
        /* istanbul ignore next */
        (event) => this._onPan(event)
      );
      this._hammerManager.add(
        new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL })
      );
    }
  }

  // Schedule any changes needed to update the sidebar layout.
  _updateLayout() {
    // Only schedule one frame at a time.
    if (this.renderFrame) {
      return;
    }

    // Schedule a frame.
    this.renderFrame = requestAnimationFrame(() => {
      this.renderFrame = null;

      if (
        this._gestureState.final !== this._gestureState.initial &&
        this.iframeContainer
      ) {
        const margin = /** @type {number} */ this._gestureState.final;
        const width = -margin;
        this.iframeContainer.style.marginLeft = `${margin}px`;
        if (width >= MIN_RESIZE) {
          this.iframeContainer.style.width = `${width}px`;
        }
        this._notifyOfLayoutChange();
      }
    });
  }

  /**
   * Notify integrator when sidebar is opened, closed or resized.
   *
   * @param {boolean} [expanded] -
   *   `true` or `false` if the sidebar is being directly opened or closed, as
   *   opposed to being resized via the sidebar's drag handles
   */
  _notifyOfLayoutChange(expanded: boolean) {
    // The sidebar structure is:
    //
    // [ Toolbar    ][                                   ]
    // [ ---------- ][ Sidebar iframe container (@frame) ]
    // [ Bucket Bar ][                                   ]
    //
    // The sidebar iframe is hidden or shown by adjusting the left margin of
    // its container.

    const toolbarWidth = (this.iframeContainer && this.toolbar.getWidth()) || 0;
    const frame =
      /** @type {HTMLElement} */ this.iframeContainer ?? this.externalFrame;
    const rect = frame.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(frame);
    const width = parseInt(computedStyle.width);
    const leftMargin = parseInt(computedStyle.marginLeft);

    // The width of the sidebar that is visible on screen, including the
    // toolbar, which is always visible.
    let frameVisibleWidth = toolbarWidth;

    if (typeof expanded === "boolean") {
      if (expanded) {
        frameVisibleWidth += width;
      }
    } else {
      if (leftMargin < MIN_RESIZE) {
        frameVisibleWidth -= leftMargin;
      } else {
        frameVisibleWidth += width;
      }

      // Infer expanded state based on whether at least part of the sidebar
      // frame is visible.
      expanded = frameVisibleWidth > toolbarWidth;
    }

    const layoutState = /** @type {SidebarLayout} */ {
      expanded,
      width: expanded ? frameVisibleWidth : toolbarWidth,
      height: rect.height,
      toolbarWidth,
    };

    if (this.onLayoutChange) {
      this.onLayoutChange(layoutState);
    }

    this._guestRPC.forEach((rpc) =>
      rpc.call("sidebarLayoutChanged", layoutState)
    );
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

  _onPan(event) {
    const frame = this.iframeContainer;
    if (!frame) {
      return;
    }

    switch (event.type) {
      case "panstart":
        this._resetGestureState();

        // Disable animated transition of sidebar position
        frame.classList.add("annotator-no-transition");

        // Disable pointer events on the iframe.
        frame.style.pointerEvents = "none";

        this._gestureState.initial = parseInt(
          getComputedStyle(frame).marginLeft
        );

        break;
      case "panend":
        frame.classList.remove("annotator-no-transition");

        // Re-enable pointer events on the iframe.
        frame.style.pointerEvents = "";

        // Snap open or closed.
        if (
          this._gestureState.final === null ||
          this._gestureState.final <= -MIN_RESIZE
        ) {
          this.open();
        } else {
          this.close();
        }
        this._resetGestureState();
        break;
      case "panleft":
      case "panright": {
        if (typeof this._gestureState.initial !== "number") {
          return;
        }

        const margin = this._gestureState.initial;
        const delta = event.deltaX;
        this._gestureState.final = Math.min(Math.round(margin + delta), 0);
        this._updateLayout();
        break;
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

    if (this._config.showHighlights === "whenSidebarOpen") {
      this.setHighlightsVisible(true);
    }

    this._notifyOfLayoutChange(true);
  }

  close() {
    if (this.iframeContainer) {
      this.iframeContainer.style.marginLeft = "";
      this.iframeContainer.classList.add("annotator-collapsed");
    }

    this.toolbar.sidebarOpen = false;

    if (this._config.showHighlights === "whenSidebarOpen") {
      this.setHighlightsVisible(false);
    }

    this._notifyOfLayoutChange(false);
  }

  /**
   * Set whether highlights are visible in guest frames.
   *
   * @param {boolean} visible
   */
  setHighlightsVisible(visible: boolean) {
    this.toolbar.highlightsVisible = visible;

    // Notify sidebar app of change which will in turn reflect state to guest frames.
    // this._sidebarRPC.call("setHighlightsVisible", visible);
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
    this._sidebar.render();
  }
}