import AdderToolbar from "./components/AdderToolbar";
import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import cs from "../cs.locale";
import { overlay } from '.';

/**
 * Returns true when the device is a touch device such
 * as android or iOS.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer#browser_compatibility
 *
 * @param _window {Window} - Test seam
 */
export const isTouchDevice = (_window = window) => {
  return _window.matchMedia("(pointer: coarse)").matches;
};


/**
 * Load stylesheets for annotator UI components into the shadow DOM root.
 */
export function loadStyles(shadowRoot, fileName = "annotator") {
  // Find the preloaded stylesheet added by the boot script.
  const url = /** @type {HTMLLinkElement|undefined} */ document.querySelector(
    `link[rel="preload"][href*="/static/css/${fileName}.css"]`
  )?.href;

  if (!url) {
    return;
  }

  const linkEl = document.createElement("link");
  linkEl.rel = "stylesheet";
  linkEl.href = url;
  shadowRoot.appendChild(linkEl);
}

/**
 * Stop bubbling up of several events.
 *
 * This makes the host page a little bit less aware of the annotator activity.
 * It is still possible for the host page to manipulate the events on the capturing
 * face.
 *
 * Another benefit is that click and touchstart typically causes the sidebar to close.
 * By preventing the bubble up of these events, we don't have to individually stop
 * the propagation.
 *
 * @param {HTMLElement|ShadowRoot} element
 */
function stopEventPropagation(element) {
  element.addEventListener("mouseup", (event) => event.stopPropagation());
  element.addEventListener("mousedown", (event) => event.stopPropagation());
  element.addEventListener("touchstart", (event) => event.stopPropagation(), {
    passive: true,
  });
}

/**
 * Create the shadow root for an annotator UI component and load the annotator
 * CSS styles into it.
 *
 * @param {HTMLElement} container - Container element to render the UI into
 * @return {ShadowRoot}
 */
export function createShadowRoot(container) {
  const shadowRoot = container.attachShadow({ mode: "open" });
  loadStyles(shadowRoot);

  // @ts-ignore The window doesn't know about the polyfill
  // applyFocusVisiblePolyfill comes from the focus-visible package.
  const applyFocusVisible = window.applyFocusVisiblePolyfill;
  if (applyFocusVisible) {
    applyFocusVisible(shadowRoot);
  }

  stopEventPropagation(shadowRoot);
  return shadowRoot;
}

/**
 *  @typedef {1} ArrowPointingDown
 * Show the adder above the selection with an arrow pointing down at the
 * selected text.
 */
export const ARROW_POINTING_DOWN = 1;

/**
 *  @typedef {2} ArrowPointingUp
 * Show the adder above the selection with an arrow pointing up at the
 * selected text.
 */
export const ARROW_POINTING_UP = 2;

/**
 *  @typedef {ArrowPointingDown|ArrowPointingUp} ArrowDirection
 * Show the adder above the selection with an arrow pointing up at the
 * selected text.
 */

/**
 * @typedef Target
 * @prop {number} left - Offset from left edge of viewport.
 * @prop {number} top - Offset from top edge of viewport.
 * @prop {ArrowDirection} arrowDirection - Direction of the adder's arrow.
 */

function toPx(pixels) {
  return pixels.toString() + "px";
}

const ARROW_HEIGHT = 10;

// The preferred gap between the end of the text selection and the adder's
// arrow position.
const ARROW_H_MARGIN = 20;

/**
 * Return the closest ancestor of el which has been positioned.
 *
 * If no ancestor has been positioned, returns the root element.
 *
 * @param {Element} el
 * @return {Element}
 */
function nearestPositionedAncestor(el) {
  let parentEl = /** @type {Element} */ el.parentElement;
  while (parentEl.parentElement) {
    if (getComputedStyle(parentEl).position !== "static") {
      break;
    }
    parentEl = parentEl.parentElement;
  }
  return parentEl;
}

/**
 * @typedef AdderOptions
 * @prop {() => void} onAnnotate - Callback invoked when "Annotate" button is clicked
 * @prop {() => void} onHighlight - Callback invoked when "Highlight" button is clicked
 * @prop {(tags: string[]) => void} onShowAnnotations -
 *   Callback invoked when  "Show" button is clicked
 *
 * @typedef {import('../types/annotator').Destroyable} Destroyable
 */

/**
 * Container for the 'adder' toolbar which provides controls for the user to
 * annotate and highlight the selected text.
 *
 * The toolbar implementation is split between this class, which is
 * the container for the toolbar that positions it on the page and isolates
 * it from the page's styles using shadow DOM, and the AdderToolbar Preact
 * component which actually renders the toolbar.
 *
 * @implements {Destroyable}
 */
export class Adder {
  _outerContainer: HTMLElement;
  _shadowRoot: any;
  _view: any;
  _width: () => any;
  _height: () => any;
  _isVisible: boolean;
  _arrowDirection: string;
  _onAnnotate: any;
  _onHighlight: any;
  _onShowAnnotations: any;
  annotationsForSelection: never[];
  /**
   * Create the toolbar's container and hide it.
   *
   * The adder is initially hidden.
   *
   * @param {HTMLElement} element - The DOM element into which the adder will be created
   * @param {AdderOptions} options - Options object specifying onAnnotate and onHighlight
   *        event handlers.
   */
  constructor(element, options) {
    this._outerContainer = document.createElement("hypothesis-adder");
    element.appendChild(this._outerContainer);
    this._shadowRoot = createShadowRoot(this._outerContainer);

    // console.log("SR 3: ", this._shadowRoot.children);

    // Set initial style
    Object.assign(this._outerContainer.style, {
      // take position out of layout flow initially
      position: "absolute",
      top: 0,
      left: 0,
      'z-index': 1000,
    });

    this._view = /** @type {Window} */ element.ownerDocument.defaultView;

    this._width = () => {
      const firstChild = /** @type {Element} */ this._shadowRoot.firstChild;
      return firstChild.getBoundingClientRect().width;
    };

    this._height = () => {
      const firstChild = /** @type {Element} */ this._shadowRoot.firstChild;
      return firstChild.getBoundingClientRect().height;
    };

    this._isVisible = false;

    /** @type {'up'|'down'} */
    this._arrowDirection = "up";

    this._onAnnotate = options.onAnnotate;
    this._onHighlight = options.onHighlight;
    this._onShowAnnotations = options.onShowAnnotations;

    /**
     * Annotation tags associated with the current selection. If non-empty,
     * a "Show" button appears in the toolbar. Clicking the button calls the
     * onShowAnnotations callback with the current value of annotationsForSelection.
     *
     * @type {string[]}
     */
    this.annotationsForSelection = [];

    this._render();
  }

  /** Hide the adder */
  hide() {
    // overlay.off();
    this._isVisible = false;
    this._render();
    // Reposition the outerContainer because it affects the responsiveness of host page
    // https://github.com/hypothesis/client/issues/3193
    Object.assign(this._outerContainer.style, {
      top: 0,
      left: 0,
    });
  }

  destroy() {
    ReactDOM.render(null, this._shadowRoot); // First, unload the Preact component
    this._outerContainer.remove();
  }

  /**
   * Display the adder in the best position in order to target the
   * selected text in selectionRect.
   *
   * @param {DOMRect} selectionRect - The rect of text to target, in viewport
   *        coordinates.
   * @param {boolean} isRTLselection - True if the selection was made
   *        rigth-to-left, such that the focus point is mosty likely at the
   *        top-left edge of targetRect.
   */
  show(selectionRect, isRTLselection, selectionRange) {
    const { left, top, arrowDirection } = this._calculateTarget(
      selectionRect,
      isRTLselection
    );
    this._showAt(left, top);

    this._isVisible = true;
    this._arrowDirection = arrowDirection === ARROW_POINTING_UP ? "up" : "down";

    this._render(selectionRange);
  }

  /**
   *  Determine the best position for the Adder and its pointer-arrow.
   * - Position the pointer-arrow near the end of the selection (where the user's
   *   cursor/input is most likely to be)
   * - Position the Adder to center horizontally on the pointer-arrow
   * - Position the Adder below the selection (arrow pointing up) for LTR selections
   *   and above (arrow down) for RTL selections
   *
   * @param {DOMRect} selectionRect - The rect of text to target, in viewport
   *        coordinates.
   * @param {boolean} isRTLselection - True if the selection was made
   *        rigth-to-left, such that the focus point is mosty likely at the
   *        top-left edge of targetRect.
   * @return {Target}
   */
  _calculateTarget(selectionRect, isRTLselection) {
    // Set the initial arrow direction based on whether the selection was made
    // forwards/upwards or downwards/backwards.
    /** @type {ArrowDirection} */ let arrowDirection;
    if (isRTLselection && !isTouchDevice()) {
      arrowDirection = ARROW_POINTING_DOWN;
    } else {
      // Render the adder below the selection for touch devices due to competing
      // space with the native copy/paste bar that typical (not always) renders above
      // the selection.
      arrowDirection = ARROW_POINTING_UP;
    }
    let top;
    let left;

    // Position the adder such that the arrow it is above or below the selection
    // and close to the end.
    const hMargin = Math.min(ARROW_H_MARGIN, selectionRect.width);
    const adderWidth = this._width();
    // Render the adder a little lower on touch devices to provide room for the native
    // selection handles so that the interactions with selection don't compete with the adder.
    const touchScreenOffset = isTouchDevice() ? 10 : 0;
    const adderHeight = this._height();
    if (isRTLselection) {
      left = selectionRect.left - adderWidth / 2 + hMargin;
    } else {
      left =
        selectionRect.left + selectionRect.width - adderWidth / 2 - hMargin;
    }

    // Flip arrow direction if adder would appear above the top or below the
    // bottom of the viewport.
    if (
      selectionRect.top - adderHeight < 0 &&
      arrowDirection === ARROW_POINTING_DOWN
    ) {
      arrowDirection = ARROW_POINTING_UP;
    } else if (selectionRect.top + adderHeight > this._view.innerHeight) {
      arrowDirection = ARROW_POINTING_DOWN;
    }

    if (arrowDirection === ARROW_POINTING_UP) {
      top =
        selectionRect.top +
        selectionRect.height +
        ARROW_HEIGHT +
        touchScreenOffset;
    } else {
      top = selectionRect.top - adderHeight - ARROW_HEIGHT;
    }

    // Constrain the adder to the viewport.
    left = Math.max(left, 0);
    left = Math.min(left, this._view.innerWidth - adderWidth);

    top = Math.max(top, 0);
    top = Math.min(top, this._view.innerHeight - adderHeight);

    return { top, left, arrowDirection };
  }

  /**
   * Find a Z index value that will cause the adder to appear on top of any
   * content in the document when the adder is shown at (left, top).
   *
   * @param {number} left - Horizontal offset from left edge of viewport.
   * @param {number} top - Vertical offset from top edge of viewport.
   * @return {number} - greatest zIndex (default value of 1)
   */
  _findZindex(left, top) {
    // TODO: uncomment this and make it work
    // if (document.elementsFromPoint === undefined) {
    //   // In case of not being able to use document.elementsFromPoint,
    //   // default to the large arbitrary number (2^15)
    //   return 32768;
    // }

    // const adderWidth = this._width();
    // const adderHeight = this._height();

    // // Find the Z index of all the elements in the screen for five positions
    // // around the adder (left-top, left-bottom, middle-center, right-top,
    // // right-bottom) and use the greatest.

    // // Unique elements so getComputedStyle is called the minimum amount of times.
    // const elements = new Set([
    //   ...document.elementsFromPoint(left, top),
    //   ...document.elementsFromPoint(left, top + adderHeight),
    //   ...document.elementsFromPoint(
    //     left + adderWidth / 2,
    //     top + adderHeight / 2
    //   ),
    //   ...document.elementsFromPoint(left + adderWidth, top),
    //   ...document.elementsFromPoint(left + adderWidth, top + adderHeight),
    // ]);

    // const zIndexes = [...elements]
    //   .map((element) => +getComputedStyle(element).zIndex)
    //   .filter(Number.isInteger);

    // // Make sure the array contains at least one element,
    // // otherwise Math.max(...[]) results in +Infinity
    // zIndexes.push(0);

    // return Math.max(...zIndexes) + 1;

    return 10000;
  }

  /**
   * Show the adder at the given position and with the arrow pointing in
   * arrowDirection.
   *
   * @param {number} left - Horizontal offset from left edge of viewport.
   * @param {number} top - Vertical offset from top edge of viewport.
   */
  _showAt(left, top, isModal = false) {
    // Translate the (left, top) viewport coordinates into positions relative to
    // the adder's nearest positioned ancestor (NPA).
    //
    // Typically the adder is a child of the <body> and the NPA is the root
    // <html> element. However page styling may make the <body> positioned.
    // See https://github.com/hypothesis/client/issues/487.
    const positionedAncestor = nearestPositionedAncestor(this._outerContainer);
    const parentRect = positionedAncestor.getBoundingClientRect();

    const zIndex = this._findZindex(left, top);

    if (isModal){
      overlay.on();
      Object.assign(this._outerContainer.style, {
        // modal props
        left: '50%',
        top: '50%',
        position: 'fixed',
        transform: 'translate(-400px, -400px)',

        zIndex,
      });
    } else {
      Object.assign(this._outerContainer.style, {
        left: toPx(left - parentRect.left),
        top: toPx(top - parentRect.top),
        position: 'absolute',
        transform: 'none',
        zIndex,
      });
    }
  
    // console.log("style: ", this._outerContainer.style);
  }

  _render(selectionRange) {
    // console.log("rendering adder");
    const handleCommand = (command) => {
      // switch (command) {
      //   case 'annotate':
      //     this._onAnnotate();
      //     this.hide();
      //     break;
      //   case 'highlight':
      //     this._onHighlight();
      //     this.hide();
      //     break;
      //   case 'show':
      //     this._onShowAnnotations(this.annotationsForSelection);
      //     break;
      //   case 'hide':
      //     this.hide();
      //     break;
      //   default:
      //     break;
      return false;
      // }
    };

    // console.log("SR before render: ", this._shadowRoot.children);
    ReactDOM.render(
      <IntlProvider locale="cs-CZ" defaultLocale="en" messages={cs}>
        <AdderToolbar
          isVisible={this._isVisible}
          arrowDirection={this._arrowDirection}
          onCommand={handleCommand}
          annotationCount={20}
          showAt={this._showAt.bind(this)}
          hide={this.hide.bind(this)}
          selectionRange={selectionRange}
        />
      </IntlProvider>,
      this._shadowRoot,
      () => {
        if (!calledRender) {
          // console.log("back call called!");
          loadStyles(this._shadowRoot, "annotator");
          loadStyles(this._shadowRoot, "styles");
          loadStyles(this._shadowRoot, "bootstrap-termit");
          calledRender = true;
        }
      }
    );
  }
}

let calledRender = false;
