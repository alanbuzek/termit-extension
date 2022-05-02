import ListenerCollection from "./utils/listenerCollection";
import { ContentPopupContainer } from "./ContentPopupContainer";
import { createIntegration } from "./integrations";
import * as rangeUtil from "./utils/rangeUtils";
import SelectionObserver from "./utils/SelectionObserver";
import Vocabulary from "../../common/model/Vocabulary";
import { markTerms } from "../marker";
import { Annotation } from "../../common/util/Annotation";
import { ContentState } from "..";
import TermOccurrence from "../../common/model/TermOccurrence";
import HtmlDomUtils from "../../common/component/annotator/HtmlDomUtils";

const termitElements = ["hypothesis-adder", "hypothesis-sidebar", "termit-h"];

const isDescendantOfTermItElements = (element?: Element) => {
  return (
    !!element && termitElements.some((ancestor) => element.closest(ancestor))
  );
};

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
  private contentPopup: ContentPopupContainer;
  private selectionObserver: SelectionObserver;
  private annotations: Annotation[] = [];
  private integration: any;
  private currentAnnotation?: Annotation;
  private contentState: ContentState;

  public constructor(rootElement: HTMLElement, contentState: ContentState) {
    this.contentState = contentState;
    this.rootElement = rootElement;
    this.contentPopup = new ContentPopupContainer(
      this.rootElement,
      this.contentState
    );

    // TODO: remove hypothesis from name, add more elements (e.g, message panel if needed);

    // TODO: fix up selection observer handling

    let ignoreNextSelectionTimeout: any = null;
    this.selectionObserver = new SelectionObserver((range, event?: Event) => {
      let shouldIgnore = false;
      if (ignoreNextSelectionTimeout) {
        return;
      }

      if (this.contentPopup.isOpen() && event) {
        if (event.type === "selectionchange") {
          const activeElement = event?.target?.activeElement as
            | Element
            | undefined;
          shouldIgnore = isDescendantOfTermItElements(activeElement);
        } else if (event.type === "click") {
          const targetElement = event?.target as Element | undefined;
          shouldIgnore = isDescendantOfTermItElements(targetElement);
        }

        if (shouldIgnore) {
          console.log("should ignore");
          return;
        }
      }

      this.onClearSelection();

      if (range) {
        clearTimeout(ignoreNextSelectionTimeout);
        ignoreNextSelectionTimeout = setTimeout(() => {
          clearTimeout(ignoreNextSelectionTimeout);
          ignoreNextSelectionTimeout = null;
        }, 300);
        this.onSelection(range);
      }
    });

    /**
     * Integration that handles document-type specific functionality in the
     * guest. We currently support only HTML documents, but other integrations will be possible later, such as PDFs
     */
    this.integration = createIntegration(this);

    // Setup event handlers on the root element
  }

  private destroy() {
    this.selectionObserver.disconnect();
    this.contentPopup.destroy();
    this.integration.destroy();
  }

  /**
   * Show or hide the adder toolbar when the selection changes.
   *
   * @param {Range} range
   */
  // TODO: we get rid of this? unused now...
  private onSelection(range: Range) {
    const selection = /** @type {Selection} */ document.getSelection();
    const isBackwards = rangeUtil.isSelectionBackwards(selection);
    const focusRect = rangeUtil.selectionFocusRect(selection);
    if (!focusRect) {
      // The selected range does not contain any text
      this.onClearSelection();
      return;
    }
    HtmlDomUtils.extendSelectionToWords();
    const selectionRange = window.getSelection()?.getRangeAt(0);
    this.contentPopup.show(focusRect, isBackwards, selectionRange);
  }

  public showPopup(annotation: Annotation) {
    this.currentAnnotation = annotation;
    // TODO: maybe this should not be the first element but the last?
    const elementRect = this.currentAnnotation
      .getElements()[0]
      .getBoundingClientRect();
    this.contentPopup.show(
      new DOMRect(
        elementRect.left,
        elementRect.top,
        elementRect.width,
        elementRect.height
      ),
      false,
      null,
      annotation
    );
  }

  public hidePopup() {
    this.contentPopup.hide();
  }

  public async annotatePage(
    vocabulary: Vocabulary,
    termOccurrencesGrouped: TermOccurrence[][]
  ) {
    const annotationsData = await Promise.all(
      termOccurrencesGrouped.map((termOccurrencesGroup) =>
        markTerms(termOccurrencesGroup, this.contentState.terms)
      )
    );

    // add all annotatations to the set for later reference
    annotationsData
      .flatMap((annotationData) => annotationData)
      .forEach((annotation) => this.annotations.push(annotation));
  }

  public getAnnotations() {
    return this.annotations;
  }

  private onClearSelection() {
    this.contentPopup.hide();
  }

  public turnOffAnnotations() {
    this.annotations.forEach((annotation) => annotation.removeOccurrence());
    this.destroy();
  }
}
