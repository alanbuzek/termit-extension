import ListenerCollection from "./utils/listenerCollection";
import { ContentPopupContainer } from "./ContentPopupContainer";
import * as rangeUtil from "./utils/rangeUtils";
import SelectionObserver from "./utils/SelectionObserver";
import Vocabulary from "../../common/model/Vocabulary";
import { markTerm } from "../marker";
import { Annotation, AnnotationType } from "../../common/util/Annotation";
import { ContentActions, ContentState } from "..";
import TermOccurrence from "../../common/model/TermOccurrence";
import HtmlDomUtils from "../../common/component/annotator/HtmlDomUtils";
import Constants from "../../common/util/Constants";

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
  private notFoundTermOccurrences: TermOccurrence[] = [];
  private currentAnnotation?: Annotation;
  private contentState: ContentState;
  private isSelectingDefinition: boolean = false;
  private onDefinitionSelected;

  public constructor(rootElement: HTMLElement, contentState: ContentState) {
    this.contentState = contentState;
    this.rootElement = rootElement;
    this.contentPopup = new ContentPopupContainer(
      this.rootElement,
      this.contentState,
      (onDefinitionSelected) => {
        this.isSelectingDefinition = true;
        this.onDefinitionSelected = onDefinitionSelected;
      }
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
          // @ts-ignore
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

  }

  public destroy() {
    this.annotations.forEach((annotation) => annotation.removeOccurrence());
    this.selectionObserver.disconnect();
    this.contentPopup.destroy();
  }

  /**
   * Show or hide the adder toolbar when the selection changes.
   *
   * @param {Range} range
   */
  // TODO: we get rid of this? unused now...
  private onSelection(range: Range) {
    const selection: Selection = document.getSelection()!;
    const isBackwards = rangeUtil.isSelectionBackwards(selection);
    const focusRect = rangeUtil.selectionFocusRect(selection);
    if (!focusRect) {
      // The selected range does not contain any text
      this.onClearSelection();
      return;
    }
    HtmlDomUtils.extendSelectionToWords();

    let updatedSelection = window.getSelection()!;
    let updatedRange = updatedSelection!.getRangeAt(0);

    if (!this.isSelectionAllowed(updatedRange, updatedSelection)) {
      this.onClearSelection();
      console.log("is not allowed");
      return;
    }

    console.log("this.isSelectingDefinition: ", this.isSelectingDefinition);
    if (this.isSelectingDefinition) {
      ContentActions.createUnknownOccurrenceFromRange(
        updatedRange,
        AnnotationType.DEFINITION
      ).then((annotation) => {
        this.onDefinitionSelected(annotation);
        this.isSelectingDefinition = false;
      });
      return;
    }

    this.contentPopup.show(focusRect, isBackwards, updatedRange);
  }

  private isSelectionAllowed(range: Range, selection: Selection) {
    let container = range.commonAncestorContainer;

    if (!container || !range || !selection) {
      return false;
    }
    if (container.nodeType === Node.TEXT_NODE) {
      if (!container.parentElement) {
        return false;
      }
      container = container.parentElement;
    }

    const allHighlights = (container as HTMLElement).querySelectorAll(
      "termit-h"
    );

    return Array.from(allHighlights).every(
      (highlight) =>
        !selection.containsNode(highlight, true) ||
        Annotation.getElementDepth(highlight as HTMLElement) <
          Constants.MAX_HIGHLIGHT_DEPTH
    );
  }

  public showPopup(annotation: Annotation) {
    if (this.isSelectingDefinition) {
      return;
    }

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

  public async annotatePage(termOccurrences: TermOccurrence[], isNewPage = false) {
    const annotationsData = await Promise.all(
      termOccurrences.map((termOccurrence) =>
        markTerm(termOccurrence, this.contentState.terms)
      )
    );

    // add all annotatations to the set for later reference
    annotationsData.forEach((annotation) => {
      if (annotation instanceof Annotation) {
        this.annotations.push(annotation);
      } else if (!isNewPage) {
        // just ignore any not found term occurrences on the first automatic annotation

        this.notFoundTermOccurrences.push(annotation);
      }
    });

    this.updateAnnotations();
  }

  public updateAnnotations() {
    this.annotations.forEach((annotation) => annotation.updateAppearance());
  }

  public getAnnotations() {
    return this.annotations;
  }

  private onClearSelection() {
    if (this.isSelectingDefinition) {
      return;
    }

    this.contentPopup.hide();
  }

  public getContentPoup() {
    return this.contentPopup;
  }

  public async annotateTermOccurrence(termOccurrence: TermOccurrence) {
    const result = await markTerm(termOccurrence, this.contentState.terms);
    console.log('result: ', result);
    if (result instanceof TermOccurrence) {
      this.notFoundTermOccurrences!.push(result);
      return null;
    } else {
      this.annotations!.push(result);
      result.updateRelatedAnnotationElements();
      ContentActions.showPopup(result);
      return result;
    }
  }

  public getNotFoundTermOccurrences() {
    return this.notFoundTermOccurrences;
  }

  public getFoundTermOccurrences() {
    return this.annotations.map((annotation) => annotation.termOccurrence);
  }
}
