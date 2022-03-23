import ListenerCollection from "./utils/listenerCollection";
import { ContentPopup } from "./ContentPopup";
import { createIntegration } from "./integrations";
import * as rangeUtil from "./utils/rangeUtils";
import SelectionObserver from "./utils/selectionObserver";
import { normalizeURI } from "./utils/url";

/**
 * `AnnotatorGuest` is the central class of the annotator that handles anchoring (locating)
 * annotations in the document when they are fetched by the sidebar, rendering
 * highlights for them and handling subsequent interactions with the highlights.
 *
 * It is also responsible for listening to changes in the current selection
 * and triggering the display of controls to create new annotations. When one
 * of these controls is clicked, it creates the new annotation and sends it to
 * the sidebar.
 *
 * Within a browser tab, there is typically one `AnnotatorGuest` instance per frame that
 * loads Hypothesis (not all frames will be annotation-enabled). In one frame,
 * usually the top-level one, there will also be an instance of the `Sidebar`
 * class that shows the sidebar app and surrounding UI. The `AnnotatorGuest` instance in
 * each frame connects to the sidebar and host frames as part of its
 * initialization.
 *
 * The anchoring implementation defaults to a generic one for HTML documents and
 * can be overridden to handle different document types.
 *
 * @implements {Annotator}
 * @implements {Destroyable}
 */
export default class AnnotatorGuest {
  element: any;
  _hostFrame: Window & typeof globalThis;
  _highlightsVisible: boolean;
  _isAdderVisible: boolean;
  _informHostOnNextSelectionClear: boolean;
  selectedRanges: never[];
  _adder: any;
  _selectionObserver: any;
  anchors: never[];
  _annotations: Set<unknown>;
  _frameIdentifier: any;
  _portFinder: any;
  _integration: any;
  _hostRPC: any;
  _sidebarRPC: any;
  _bucketBarClient: any;
  // _sideBySideActive: boolean;
  _listeners: any;
  _focusedAnnotations: Set<unknown>;
  /**
   * @param {HTMLElement} element -
   *   The root element in which the `AnnotatorGuest` instance should be able to anchor
   *   or create annotations. In an ordinary web page this typically `document.body`.
   * @param {Record<string, any>} [config]
   * @param {Window} [hostFrame] -
   *   Host frame which this guest is associated with. This is expected to be
   *   an ancestor of the guest frame. It may be same or cross origin.
   */
  constructor(element, config = {}, hostFrame = window) {
    this.element = element;
    this._hostFrame = hostFrame;
    this._highlightsVisible = false;
    this._isAdderVisible = false;
    this._informHostOnNextSelectionClear = true;
    /** @type {Range[]} - Ranges of the current text selection. */
    this.selectedRanges = [];

    // console.log('annotatorGuest constructor called')
    this._adder = new ContentPopup(this.element, {
      onAnnotate: () => console.log("this.createAnnotation()"),
      onHighlight: () => console.log("({ highlight: true })"),
      onShowAnnotations: (tags) => console.log("this.selectAnnotations(tags)"),
    });

    this._selectionObserver = new SelectionObserver((range) => {
      // console.log('selection observer callback called: ', range);
      if (range) {
        this._onClearSelection();
        this._onSelection(range);
      } else {
      }
    });

    /**
     * The anchors generated by resolving annotation selectors to locations in the
     * document. These are added by `anchor` and removed by `detach`.
     *
     * There is one anchor per annotation `Target`, which typically means one
     * anchor per annotation.
     *
     * @type {Anchor[]}
     */
    this.anchors = [];

    /**
     * Tags of annotations that are currently anchored or being anchored in
     * the guest.
     */
    this._annotations = /** @type {Set<string>} */ new Set();

    /**
     * Integration that handles document-type specific functionality in the
     * guest.
     */
    this._integration = createIntegration(this);

    // this._bucketBarClient = new BucketBarClient({
    //   contentContainer: this._integration.contentContainer(),
    //   hostRPC: this._hostRPC,
    // });

    // this._sideBySideActive = false;

    // Setup event handlers on the root element
    this._listeners = new ListenerCollection();
    this._setupElementEvents();

    /**
     * Tags of currently focused annotations. This is used to set the focused
     * state correctly for new highlights if the associated annotation is already
     * focused in the sidebar.
     *
     * @type {Set<string>}
     */
    this._focusedAnnotations = new Set();
  }

  _setupElementEvents() {
    this._listeners.add(window, "resize", () => this._repositionAdder());
  }

  /**
   * Retrieve metadata for the current document.
   */
  async getDocumentInfo() {
    const [uri, metadata] = await Promise.all([
      this._integration.uri(),
      this._integration.getMetadata(),
    ]);

    return {
      uri: normalizeURI(uri),
      metadata,
      frameIdentifier: this._frameIdentifier,
    };
  }

  /**
   * Shift the position of the adder on window 'resize' events
   */
  _repositionAdder() {
    if (this._isAdderVisible === false) {
      return;
    }
    const range = window.getSelection()?.getRangeAt(0);
    if (range) {
      this._onSelection(range);
    }
  }

  destroy() {
    this._listeners.removeAll();

    this._selectionObserver.disconnect();
    this._adder.destroy();
    // this._bucketBarClient.destroy();

    // removeAllHighlights(this.element);

    this._integration.destroy();
  }


  /**
   * Show or hide the adder toolbar when the selection changes.
   *
   * @param {Range} range
   */
  _onSelection(range) {
    const selection = /** @type {Selection} */ document.getSelection();
    const isBackwards = rangeUtil.isSelectionBackwards(selection);
    const focusRect = rangeUtil.selectionFocusRect(selection);
    if (!focusRect) {
      // The selected range does not contain any text
      this._onClearSelection();
      return;
    }
    const selectionRange = window.getSelection()?.getRangeAt(0);
    this._isAdderVisible = true;
    this._adder.show(focusRect, isBackwards, selectionRange);
  }

  showPopup(element) {
    this._adder.show(new DOMRect(100, 100, 100, 100), false, null);
  }

  _onClearSelection() {
    this._isAdderVisible = false;
    this._adder.hide();
    this.selectedRanges = [];
  }

  /**
   * Set whether highlights are visible in the document or not.
   *
   * @param {boolean} visible
   */
  setHighlightsVisible(visible) {
    setHighlightsVisible(this.element, visible);
    this._highlightsVisible = visible;
  }
}
