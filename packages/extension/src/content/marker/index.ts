import { ContentActions, TermsMap } from "..";
import TermOccurrence from "../../common/model/TermOccurrence";
import { Annotation } from "../../common/util/Annotation";
import Mark from "mark.js";
import { nodeFromXPath, xpathFromNode } from "../helper/xpath";

const handleElementClick = (annotation) => (event) => {
  event.stopPropagation();
  event.preventDefault();
  ContentActions.showPopup(annotation);
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

const selectAnnotationContainer = (termOccurrence: TermOccurrence) => {
  const cssSelector = termOccurrence.getCssSelector().value;
  const xPathSelector = termOccurrence.getXPathSelector()?.value;

  const cachedResult =
    markJsInstancesCache[cssSelector] || markJsInstancesCache[xPathSelector];

  if (cachedResult && cachedResult.element.isConnected) {
    return cachedResult.element;
  }

  // not found in cache
  const cssSelectors = termOccurrence.getCssSelector().value.split("|");

  for (let selector of cssSelectors) {
    const selectedElements = Array.from(document.querySelectorAll(selector));
    if (selectedElements.length === 1) {
      console.log("found element with selector: ", selector);
      return selectedElements[0];
    }
    console.log("NOT found element with selector: ", selector);
  }

  if (xPathSelector) {
    return nodeFromXPath(xPathSelector);
  }
};

export const markTerm = (
  termOccurrence: TermOccurrence,
  termsMap
): Promise<Annotation> => {
  const cssSelector = termOccurrence.getCssSelector();
  const term = termOccurrence.term?.iri && termsMap[termOccurrence.term.iri];

  return new Promise((resolve) => {
    const selectedElement = selectAnnotationContainer(termOccurrence);

    if (!selectedElement) {
      console.log("Couldn't select element");
      resolve(new Annotation(termOccurrence, null, term));
      return;
    }

    const markJs = new Mark(selectedElement);

    const annotation = new Annotation(termOccurrence, selectedElement, term);
    const textPositionSelector = termOccurrence.getTextPositionSelector();
    const textQuoteSelector = termOccurrence.getTextQuoteSelector();

    markJs.mark(textQuoteSelector.exactMatch, {
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
      exclude: ["style", "script", "iframe", "title"],
      caseSensitive: true,
      separateWordSearch: false,
      acrossElements: true,
      className: annotation.getClassName(),
      each(element) {
        element.addEventListener("click", handleElementClick(annotation));
        element.dataset.termOccurrenceIri = annotation.termOccurrence.id;
        annotation.addElement(element);
      },
      done(numberOfMatches) {
        if (numberOfMatches === 0) {
          console.error(
            `Failure: Selector "${cssSelector.value}" matched 0 annotations!`
          );
          annotation.setFailed(true);
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
