import { AnnotationPopupContainer } from './react-tree-container/AnnotationPopupContainer';
import * as rangeUtil from './util/hypothesis/rangeUtils';
import SelectionObserver from './util/hypothesis/SelectionObserver';
import Annotation, { AnnotationType } from './Annotation';
import { ContentActions, ContentState } from './ContentController';
import TermOccurrence from '../termit-ui-common/model/TermOccurrence';
import HtmlDomUtils from '../termit-ui-common/component/annotator/HtmlDomUtils';
import Constants from '../termit-ui-common/util/Constants';
import Marker from './util/Marker';
import ContentMessage from './util/ContentMessage';

// TODO: remove "hypothesis-adder" and all other hypothesis-adder elements
const termitElements = ['hypothesis-adder', 'hypothesis-sidebar', 'termit-h'];

const isDescendantOfTermItElements = (element?: Element) =>
  !!element && termitElements.some((ancestor) => element.closest(ancestor));

const isSelectionAllowed = (range: Range, selection: Selection) => {
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

  const allHighlights = (container as HTMLElement).querySelectorAll('termit-h');

  return Array.from(allHighlights).every(
    (highlight) =>
      !selection.containsNode(highlight, true) ||
      Annotation.getElementDepth(highlight as HTMLElement) <
        Constants.MAX_HIGHLIGHT_DEPTH
  );
};

export default class Annotator {
  private rootElement: any;

  private contentPopup: AnnotationPopupContainer;

  private selectionObserver: SelectionObserver;

  private annotations: Annotation[] = [];

  private failedAnnotations: Annotation[] = [];

  private currentAnnotation?: Annotation;

  private contentState: ContentState;

  private isSelectingDefinition = false;

  private onDefinitionSelected;

  public constructor(rootElement: HTMLElement, contentState: ContentState) {
    this.contentState = contentState;
    this.rootElement = rootElement;
    this.contentPopup = new AnnotationPopupContainer(
      this.rootElement,
      this.contentState,
      (onDefinitionSelected) => {
        this.isSelectingDefinition = true;
        this.onDefinitionSelected = onDefinitionSelected;
      }
    );

    let ignoreNextSelectionTimeout: any = null;
    this.selectionObserver = new SelectionObserver((range, event?: Event) => {
      let shouldIgnore = false;
      if (ignoreNextSelectionTimeout) {
        return;
      }

      if (this.contentPopup.isOpen() && event) {
        if (event.type === 'selectionchange') {
          // @ts-ignore
          const activeElement = event?.target?.activeElement as
            | Element
            | undefined;
          shouldIgnore = isDescendantOfTermItElements(activeElement);
        } else if (event.type === 'click') {
          const targetElement = event?.target as Element | undefined;
          shouldIgnore = isDescendantOfTermItElements(targetElement);
        }

        if (shouldIgnore) {
          console.log('should ignore');
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
        this.onSelection();
      }
    });
  }

  public destroy() {
    this.annotations.forEach((annotation) => annotation.removeOccurrence());
    this.selectionObserver.disconnect();
    this.contentPopup?.destroy();
  }

  /**
   * Show or hide the adder toolbar when the selection changes.
   */
  private onSelection() {
    const selection: Selection = document.getSelection()!;
    const isBackwards = rangeUtil.isSelectionBackwards(selection);
    const focusRect = rangeUtil.selectionFocusRect(selection);
    if (!focusRect) {
      // The selected range does not contain any text
      this.onClearSelection();
      return;
    }
    HtmlDomUtils.extendSelectionToWords();

    const updatedSelection = window.getSelection()!;
    const updatedRange = updatedSelection!.getRangeAt(0);

    if (!isSelectionAllowed(updatedRange, updatedSelection)) {
      ContentMessage.showMessage(
        `Annototation not allowed: there can be a maximum of ${
          Constants.MAX_HIGHLIGHT_DEPTH + 1
        } layers of annotations on top of each other`,
        'error'
      );
      this.onClearSelection();
      return;
    }

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

  public showPopup(annotation: Annotation) {
    if (this.isSelectingDefinition) {
      return;
    }

    this.currentAnnotation = annotation;
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

  public hidePopup(isClearingSelection = false) {
    const { currentAnnotation } = this;
    this.currentAnnotation = undefined;
    console.log(
      'Hiding popup - isClearingSelection: ',
      isClearingSelection,
      ', this.currentAnnotation: ',
      !!this.currentAnnotation
    );
    this.contentPopup.hide();

    if (
      isClearingSelection &&
      currentAnnotation &&
      !currentAnnotation.termOccurrence.iri
    ) {
      console.log('saving previously ephemeral annotation');
      ContentActions.saveUnassignedOccurrence(currentAnnotation);
    }
  }

  public async annotatePage(
    termOccurrences: TermOccurrence[],
    isNewPage = false
  ) {
    const annotationsData = await Promise.all(
      termOccurrences.map((termOccurrence) =>
        Marker.markAnnotation(termOccurrence, this.contentState.terms)
      )
    );

    // add all annotatations to the set for later reference
    annotationsData.forEach((annotation) => {
      if (!annotation.isFailed()) {
        this.annotations.push(annotation);
      } else if (!isNewPage) {
        // just ignore any not found term occurrences on the first automatic annotation

        this.failedAnnotations.push(annotation);
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

    this.hidePopup(true);
  }

  public getContentPoup() {
    return this.contentPopup;
  }

  public async annotateTermOccurrence(termOccurrence: TermOccurrence) {
    const result = await Marker.markAnnotation(
      termOccurrence,
      this.contentState.terms
    );
    if (result.isFailed()) {
      this.failedAnnotations!.push(result);
      return null;
    }
    this.annotations!.push(result);
    result.updateRelatedAnnotationElements();
    ContentActions.showPopup(result);
    return result;
  }

  public getFailedAnnotations() {
    return this.failedAnnotations;
  }

  public getFoundTermOccurrences() {
    return this.annotations.map((annotation) => annotation.termOccurrence);
  }

  public removeSuggestedOccurrences() {
    [this.annotations, this.failedAnnotations].forEach((annotationsArr) => {
      const annotationsToRemove = annotationsArr.filter((annotation) =>
        annotation.termOccurrence.isSuggested()
      );

      annotationsToRemove.forEach((annotation) => {
        const annotationIdx = annotationsArr.indexOf(annotation);
        annotationsArr.splice(annotationIdx, 1);
        annotation.removeOccurrence();
      });
    });
  }
}
