import { getCssSelector } from "css-selector-generator";
import { ContentActions, TermsMap } from "..";
import { getPropertyForAnnotationType } from "../../common/component/annotator/AnnotationDomHelper";
import TermOccurrence, {
  createTermOccurrences,
} from "../../common/model/TermOccurrence";
import {
  Annotation,
  AnnotationStatus,
  AnnotationType,
} from "../../common/util/Annotation";
import JsonLdUtils from "../../common/util/JsonLdUtils";
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

const handleElementClick = (annotation) => () => {
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
  return new Promise((resolve) => new Mark(element).unmark({ done: resolve }));
};

export const markTerms = (
  termOccurrencesGroup: TermOccurrence[],
  termsMap
): Promise<Annotation[]> => {
  const cssSelector = termOccurrencesGroup[0].getCssSelector();

  return new Promise((resolve, reject) => {
    const selectedElements = Array.from(
      document.querySelectorAll(cssSelector.value)
    );

    if (selectedElements.length === 1) {
      results.selectors.successes += 1;
    } else if (selectedElements.length === 0) {
      console.log("[Selector] Failure: ", cssSelector, ", ", selectedElements);
      results.selectors.failures += 1;
    } else {
      results.selectors.overselectedFailures += 1;
      console.log(
        "[Selector] Overseledcted Failure: ",
        cssSelector,
        ", ",
        selectedElements
      );
    }

    if (selectedElements.length !== 1) {
      console.warn("Selector didn't select exactly one element");
      resolve([]);
      return;
    }

    let annotations: Annotation[] = [];
    const markInstance = new Mark(selectedElements[0]);
    termOccurrencesGroup.forEach((termOccurrence) => {
      const annotation = new Annotation(
        termOccurrence,
        termOccurrence.term?.iri && termsMap[termOccurrence.term.iri]
      );
      const textPositionSelector = termOccurrence.getTextPositionSelector();
      const textQuoteSelector = termOccurrence.getTextQuoteSelector();

      markInstance.mark(textQuoteSelector.exactMatch, {
        // NOTE: partially is safer, as we may not have an exhaustive list of limiters, and since we know the exact position
        // of the word, there's no reason not to use it (even though it might not be used very often)
        accuracy: "partially",
        filter(node, term, offestInCurrentNode, totalOffset) {
          // console.log("node, offestInCurrentNode: ", node, offestInCurrentNode);
          // // return false;
          // calculate offset within initial element
          let calculatedOffset = node.textContent.slice(0, offestInCurrentNode);
          let currNode = node;
          while (currNode.previousSibling) {
            currNode = currNode.previousSibling;
            if (currNode.textContent) {
              calculatedOffset = currNode.textContent + calculatedOffset;
            }
          }

          let commonAncestor = selectedElements[0];
          let currentElement = node.parentElement;

          while (currentElement !== commonAncestor) {
            let currentPreviousSibling = currentElement.previousSibling;
            while (currentPreviousSibling) {
              calculatedOffset = (currentPreviousSibling.textContent || "") + calculatedOffset;
              currentPreviousSibling = currentPreviousSibling.previousSibling;
            }
            currentElement = currentElement.parentNode!;
          }

          const pureLeft = calculatedOffset.replace(/\s/g, "").length;
          const pureRight = textPositionSelector.start;

          // console.log(
          //   "calculatedOffset: ",
          //   calculatedOffset,
          //   ", pureLeft: ",
          //   pureLeft,
          //   ", pureRight: ",
          //   pureRight
          // );

          console.log("got to filter: ", pureLeft, pureRight);

          return pureLeft === pureRight;
        },
        element: "termit-h", // termit-highlight element
        diacritcs: false,
        exclude: ["termit-h"], // don't allow matches within matches
        caseSensitive: true,
        separateWordSearch: false,
        acrossElements: true,
        // TODO: determine term types and corresponding classes dynamically
        className: annotation.getClassName(),
        each(element) {
          // console.log("registering listener: ", element);
          element.addEventListener("click", handleElementClick(annotation));
          annotation.addElement(element);
        },
        done(numberOfMatches) {
          if (numberOfMatches === 1) {
            results.highlights.successes += 1;
            annotation.status = AnnotationStatus.SUCCESS;
          } else if (numberOfMatches === 0) {
            console.log("Failure: ", termOccurrence, ", ", selectedElements[0]);
            results.highlights.failures += 1;
            annotation.status = AnnotationStatus.FAILURE;
          } else {
            results.highlights.overselectedFailures += 1;
            console.log(
              "Overseledcted Failure: ",
              termOccurrence,
              ", ",
              selectedElements[0]
            );
            annotation.status = AnnotationStatus.FAILURE;
          }

          annotations.push(annotation);
          if (annotations.length === termOccurrencesGroup.length) {
            resolve(annotations);
          }
        },
      });
    });
  });
};

const calculateRangeOffset = (range: Range) => {
  // TODO: isSelectionBackwards?

  // ------ NEW ------

  let parentElement = range.startContainer;

  const isTextNode = parentElement.nodeType === Node.TEXT_NODE;
  const selectedString = range.toString();

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
  // -------------

  console.log("returned object: ", {
    offset: offsetString.replace(/\s/g, "").length,
    parentElement: isAcrossMultipleElements ? commonAncestor : parentElement,
    isAcrossMultipleElements,
  });

  return {
    offset: offsetString.replace(/\s/g, "").length,
    parentElement: isAcrossMultipleElements ? commonAncestor : parentElement,
    isAcrossMultipleElements,
  };
};

// TODO: move this to some sort of a Utils file?
export const occurrenceFromRange = (
  range: Range,
  annotationType: string,
  websiteIri: string | undefined,
  termsMap: TermsMap | null
) => {
  const { offset, parentElement } = calculateRangeOffset(range);
  const generatedCssSelector = getCssSelector(parentElement);
  const selectionContent = range.toString();
  // TODO: change this ugly object schema
  const newTerm: {
    cssSelectors: string[];
    termOccurrences: {
      about: string;
      originalTerm: string;
      property: string;
      startOffset: number;
      typeof: string;
      content: string;
    }[];
  } = { cssSelectors: [], termOccurrences: [] };

  // TODO: annotation type should not be hard-coded
  const termOccurrence = {
    about: JsonLdUtils.generateBlankNodeId(),
    content: selectionContent,
    originalTerm: selectionContent,
    // property: "ddo:je-výskytem-termu",
    property: getPropertyForAnnotationType(annotationType),
    startOffset: offset,
    // startOffset: offset,
    // typeof: "ddo:výskyt-termu",
    typeof: annotationType,
    score: 1,
  };
  newTerm.cssSelectors.push(generatedCssSelector);
  newTerm.termOccurrences.push(termOccurrence);
  const [termOccurrenceResult] = createTermOccurrences(
    [newTerm],
    websiteIri,
    termsMap,
    [annotationType]
  );

  console.log(
    "startOffset: ",
    termOccurrence.startOffset,
    ", parentElement: ",
    parentElement
  );

  return termOccurrenceResult[0];
};
