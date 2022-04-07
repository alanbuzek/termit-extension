import { getCssSelector } from "css-selector-generator";
import { globalActions } from "..";
import { getPropertyForAnnotationType } from "../../common/component/annotator/AnnotationDomHelper";
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

const handleElementClick = (annotation) => () => {
  globalActions.showPopup(annotation);
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

export const markTerms = ({
  cssSelectors,
  termOccurrences,
}, termsMap): Promise<Annotation[]> => {
  return new Promise((resolve, reject) => {
    const selectedElements = Array.from(
      document.querySelectorAll(cssSelectors[0])
    );

    if (selectedElements.length === 1) {
      results.selectors.successes += 1;
    } else if (selectedElements.length === 0) {
      console.log("[Selector] Failure: ", cssSelectors, ", ", selectedElements);
      results.selectors.failures += 1;
    } else {
      results.selectors.overselectedFailures += 1;
      console.log(
        "[Selector] Overseledcted Failure: ",
        cssSelectors,
        ", ",
        selectedElements
      );
    }

    if (selectedElements.length !== 1) {
      reject("Selector didn't select exactly one element");
      return;
    }

    let annotations: Annotation[] = [];
    const markInstance = new Mark(selectedElements[0]);
    termOccurrences.forEach((termOccurrence) => {
      termOccurrence.cssSelector = cssSelectors[0];
      const annotation = new Annotation(termOccurrence, termsMap[termOccurrence.term]);

      markInstance.mark(termOccurrence.originalTerm, {
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

          const pureLeft = calculatedOffset.replace(/\s/g, "");
          const pureRight = termOccurrence.startOffset.replace(/\s/g, "");

          return pureLeft === pureRight;
        },
        element: "termit-h",
        diacritcs: false,
        exclude: ["termit-h"],
        caseSensitive: true,
        separateWordSearch: false,
        // TODO: determine term types and corresponding classes dynamically
        className: annotation.getClassName(),
        each(element) {
          console.log("registering listener");
          element.addEventListener("click", handleElementClick(annotation));
          annotation.setElement(element);
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
          if (annotations.length === termOccurrences.length) {
            resolve(annotations);
          }
        },
      });
    });
  });
};

// TODO: move this to some sort of a Utils file?
export const occurrenceFromRange = (
  range,
  annotationType
) => {
  let parentElement = range.startContainer;
  if (!parentElement) {
    throw new Error("No parent element to create annotation!");
  }
  const isTextNode = parentElement.nodeType === Node.TEXT_NODE;
  const selectedString = range.toString();
  let startOffsetIdx;
  if (isTextNode) {
    const nodeText = parentElement.wholeText;
    parentElement = parentElement.parentNode;
    startOffsetIdx =
      parentElement.textContent.indexOf(nodeText) + range.startOffset;
  } else {
    startOffsetIdx = range.startOffset;
  }
  const generatedCssSelector = getCssSelector(parentElement);
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
    content: selectedString,
    originalTerm: selectedString,
    // property: "ddo:je-výskytem-termu",
    property: getPropertyForAnnotationType(annotationType),
    startOffset: parentElement.textContent.slice(0, startOffsetIdx),
    // typeof: "ddo:výskyt-termu",
    typeof: annotationType,
  };
  newTerm.cssSelectors.push(generatedCssSelector);
  newTerm.termOccurrences.push(termOccurrence);
  return newTerm;
};
