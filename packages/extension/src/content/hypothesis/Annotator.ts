import ListenerCollection from "./utils/listenerCollection";
import { ContentPopup } from "./ContentPopup";
import { createIntegration } from "./integrations";
import * as rangeUtil from "./utils/rangeUtils";
import SelectionObserver from "./utils/selectionObserver";
import Vocabulary from "../../common/model/Vocabulary";
import { markTerms } from "../marker";
import backgroundApi from "../../shared/backgroundApi";
import { Annotation } from "../../common/util/Annotation";

/**
 * `Annotator` is the central class of the annotator that handles anchoring (locating)
 * annotations in the document when they are fetched by the sidebar, rendering
 * highlights for them and handling subsequent interactions with the highlights.
 *
 * It is also responsible for listening to changes in the current selection
 * and triggering the display of controls to create new annotations. When one
 * of these controls is clicked, it creates the new annotation and sends it to
 * the sidebar.
 *
 * Within a browser tab, there is typically one `Annotator` instance per frame that
 * loads Hypothesis (not all frames will be annotation-enabled). In one frame,
 * usually the top-level one, there will also be an instance of the `Sidebar`
 * class that shows the sidebar app and surrounding UI. The `Annotator` instance in
 * each frame connects to the sidebar and host frames as part of its
 * initialization.
 *
 * The anchoring implementation defaults to a generic one for HTML documents and
 * can be overridden to handle different document types.
 *
 * @implements {Annotator}
 * @implements {Destroyable}
 */
export default class Annotator {
  private rootElement: any;
  private annotationsVisible: boolean;
  private isPopupVisible: boolean;
  private contentPopup: any;
  private selectionObserver: any;
  // TODO: add annotation type
  private annotations: Annotation[] = [];
  private integration: any;
  private bucketBarClient: any;
  private listeners: any;

  public constructor(rootElement) {
    this.rootElement = rootElement;
    this.annotationsVisible = false;
    this.isPopupVisible = false;
    this.contentPopup = new ContentPopup(this.rootElement, {
      // TODO: are these handlers needed?
      onAnnotate: () => console.log("this.createAnnotation()"),
      onHighlight: () => console.log("({ highlight: true })"),
      onShowAnnotations: (tags) => console.log("this.selectAnnotations(tags)"),
    });

    // TODO: fix up selection observer handling
    this.selectionObserver = new SelectionObserver((range) => {
      if (range) {
        this.onClearSelection();
        this.onSelection(range);
      } else {
      }
    });

    /**
     * Integration that handles document-type specific functionality in the
     * guest. We currently support only HTML documents, but other integrations will be possible later, such as PDFs
     */
    this.integration = createIntegration(this);

    // TODO: to be implemented soon
    // this.bucketBarClient = new BucketBarClient({
    //   contentContainer: this.integration.contentContainer(),
    //   hostRPC: this._hostRPC,
    // });

    // Setup event handlers on the root element
    this.listeners = new ListenerCollection();
    this.setupElementEvents();
  }

  private setupElementEvents() {
    this.listeners.add(window, "resize", () => this.repositionAdder());
  }

  public destroy() {
    this.listeners.removeAll();

    this.selectionObserver.disconnect();
    this.contentPopup.destroy();
    this.integration.destroy();
  }

  /**
   * Show or hide the adder toolbar when the selection changes.
   *
   * @param {Range} range
   */
  private onSelection(range: Range) {
    const selection = /** @type {Selection} */ document.getSelection();
    const isBackwards = rangeUtil.isSelectionBackwards(selection);
    const focusRect = rangeUtil.selectionFocusRect(selection);
    if (!focusRect) {
      // The selected range does not contain any text
      this.onClearSelection();
      return;
    }
    const selectionRange = window.getSelection()?.getRangeAt(0);
    this.isPopupVisible = true;
    this.contentPopup.show(focusRect, isBackwards, selectionRange);
  }

  public showPopup(element, termOccurrence) {
    this.termOccurrence = termOccurrence;
    const elementRect = element.getBoundingClientRect();
    this.contentPopup.show(
      new DOMRect(
        elementRect.left,
        elementRect.top,
        elementRect.width,
        elementRect.height
      ),
      false,
      null
    );
  }

  public async annotatePage(vocabulary: Vocabulary) {
    const termOccSelectors = await backgroundApi.getPageAnnotations(
      vocabulary.iri,
      document.body.outerHTML
    );

    const annotationsData = await Promise.all(
      termOccSelectors.map((termOccSelector) => markTerms(termOccSelector))
    );

    // add all annotatations to the set for later reference
    annotationsData
      .flatMap((annotationData) => annotationData)
      .forEach((annotation) => this.annotations.push(annotation));
  }

  public getAnnotations(){
    return this.annotations;
  }

  private onClearSelection() {
    this.isPopupVisible = false;
    this.contentPopup.hide();
  }

  // TODO: anything past this is TODO
  /**
   * Set whether highlights are visible in the document or not.
   *
   * @param {boolean} visible
   */
  setHighlightsVisible(visible) {
    // TODO:
    // setHighlightsVisible(this.rootElement, visible);
    this.annotationsVisible = visible;
  }

  // TODO: implement this later
  /**
   * Shift the position of the adder on window 'resize' events
   */
  private repositionAdder() {
    // if (this.isPopupVisible === false) {
    //   return;
    // }
    // const range = window.getSelection()?.getRangeAt(0);
    // if (range) {
    //   this.onSelection(range);
    // }
  }

  /**
   * Retrieve metadata for the current document.
   */
  // async getDocumentInfo() {
  //   const [uri, metadata] = await Promise.all([
  //     this.integration.uri(),
  //     this.integration.getMetadata(),
  //   ]);

  //   return {
  //     uri: normalizeURI(uri),
  //     metadata,
  //   };
  // }
}
