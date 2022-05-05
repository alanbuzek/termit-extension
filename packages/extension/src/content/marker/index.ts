import { getCssSelector } from "css-selector-generator";
import { ContentActions, TermsMap } from "..";
import { getPropertyForAnnotationType } from "../../common/component/annotator/AnnotationDomHelper";
import TermOccurrence from "../../common/model/TermOccurrence";
import { Annotation } from "../../common/util/Annotation";
import Mark from "../../markjs";

// TODO: this most likely will be able to be removed
const classesMap = {
  unknownTermOcc: "suggested-term-occurrence selected-occurrence",
  knownTermOcc: "suggested-term-occurrence selected-occurrence",
  termDefinition: "term-definition",
  newTermProposal: "proposed-occurrence suggested-term-occurrence",
  existingTermProposal: "proposed-occurrence assigned-term-occurrence",
};

/**
 * Returns true if the start point of a selection occurs after the end point,
 * in document order.
 *
 * @param {Selection} selection
 */
export function isSelectionBackwards(selection) {
  if (selection.focusNode === selection.anchorNode) {
    return selection.focusOffset < selection.anchorOffset;
  }

  const range = selection.getRangeAt(0);

  return range.startContainer === selection.focusNode;
}

const handleElementClick = (annotation) => (event) => {
  event.stopPropagation();
  event.preventDefault();
  ContentActions.showPopup(annotation);
};

const results = {
  highlights: {
    failures: 0,
    successes: 0,
    overselectedFailures: 0,
  },
  selectors: {
    successes: 0,
    failures: 0,
    overselectedFailures: 0,
  },
};

export const unmarkTerm = (element: HTMLElement) => {
  return new Promise((resolve) =>
    new Mark(element).unmark({
      done: resolve,
      attribute: {
        key: "data-term-occurrence-iri",
        value: element.dataset.termOccurrenceIri,
      },
    })
  );
};

const markJsInstancesCache = {};

export const markTerm = (
  termOccurrence: TermOccurrence,
  termsMap
): Promise<Annotation | TermOccurrence> => {
  const cssSelector = termOccurrence.getCssSelector();

  return new Promise((resolve) => {
    let markInstance = markJsInstancesCache[cssSelector.value]?.markInstance;
    let selectedElement =
      markJsInstancesCache[cssSelector.value]?.selectedElement;

    if (!markInstance) {
      const selectedElements = Array.from(
        document.querySelectorAll(cssSelector.value)
      );

      if (selectedElements.length === 1) {
        results.selectors.successes += 1;
      } else {
        console.error(
          `Failure: Selector "${cssSelector.value}" selected ${selectedElements.length} elements instead of 1!`
        );
        resolve(termOccurrence);
        return;
      }
      selectedElement = selectedElements[0];
      markInstance = new Mark(selectedElement);
      markJsInstancesCache[cssSelector.value] = {
        markInstance,
        selectedElement,
      };
    } else {
      console.log("using cache: ", markInstance, selectedElement);
    }

    const term = termOccurrence.term?.iri && termsMap[termOccurrence.term.iri];
    const annotation = new Annotation(termOccurrence, selectedElement, term);
    const textPositionSelector = termOccurrence.getTextPositionSelector();
    const textQuoteSelector = termOccurrence.getTextQuoteSelector();
    markInstance.mark(textQuoteSelector.exactMatch, {
      // NOTE: partially is safer, as we may not have an exhaustive list of limiters, and since we know the exact position
      // of the word, there's no reason not to use it (even though it might not be used very often)
      accuracy: "partially",
      filter(node, term, offestInCurrentNode) {
        let calculatedOffset = node.textContent.slice(0, offestInCurrentNode);
        let currNode = node;
        while (currNode.previousSibling) {
          currNode = currNode.previousSibling;
          if (currNode.textContent) {
            calculatedOffset = currNode.textContent + calculatedOffset;
          }
        }

        let commonAncestor = selectedElement;
        let currentElement = node.parentElement;

        while (currentElement !== commonAncestor) {
          let currentPreviousSibling = currentElement.previousSibling;
          while (currentPreviousSibling) {
            calculatedOffset =
              (currentPreviousSibling.textContent || "") + calculatedOffset;
            currentPreviousSibling = currentPreviousSibling.previousSibling;
          }
          currentElement = currentElement.parentNode!;
        }

        const pureLeft = calculatedOffset.replace(/\s/g, "").length;
        const pureRight = textPositionSelector.start;

        return pureLeft === pureRight;
      },
      element: "termit-h", // termit-highlight element
      diacritcs: false,
      exclude: [],
      caseSensitive: true,
      separateWordSearch: false,
      acrossElements: true,
      className: annotation.getClassName(),
      each(element) {
        console.log('adding listener: ', element);
        element.addEventListener("click", handleElementClick(annotation));
        element.dataset.termOccurrenceIri = annotation.termOccurrence.id;
        annotation.addElement(element);
      },
      done(numberOfMatches) {
        console.log('number of matches: ', 1);
        if (numberOfMatches === 0) {
          console.error(
            `Failure: Selector "${cssSelector.value}" matched 0 annotations!`
          );
          resolve(termOccurrence);
          return;
        }

        resolve(annotation);
      },
    });
  });
};

export const calculateRangeOffset = (range: Range) => {
  let parentElement = range.startContainer;

  const isTextNode = parentElement.nodeType === Node.TEXT_NODE;

  let startOffsetIdx;
  if (isTextNode) {
    const nodeText = (parentElement as Text).wholeText;
    // map parent element to one level above if it's a text node
    parentElement = parentElement.parentNode as Node;
    startOffsetIdx =
      parentElement.textContent!.indexOf(nodeText) + range.startOffset;
  } else {
    startOffsetIdx = range.startOffset;
  }

  let offsetString = parentElement.textContent!.slice(0, startOffsetIdx);

  const isAcrossMultipleElements = range.startContainer !== range.endContainer;

  let commonAncestor = range.commonAncestorContainer;

  if (!commonAncestor) {
    // TODO: handle better? this should probably never happen?
    throw new Error("No parent element to create annotation!");
  }

  if (isAcrossMultipleElements) {
    let currentElement = parentElement;
    while (currentElement !== commonAncestor) {
      let currentPreviousSibling = currentElement.previousSibling;
      while (currentPreviousSibling) {
        offsetString += currentPreviousSibling.textContent || "";
        currentPreviousSibling = currentPreviousSibling.previousSibling;
      }
      currentElement = currentElement.parentNode!;
    }
  }

  return {
    offset: offsetString.replace(/\s/g, "").length,
    parentElement: isAcrossMultipleElements ? commonAncestor : parentElement,
    isAcrossMultipleElements,
  };
};
