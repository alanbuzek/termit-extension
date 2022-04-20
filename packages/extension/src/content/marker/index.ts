import { getCssSelector } from "css-selector-generator";
import { globalActions } from "..";
import { getPropertyForAnnotationType } from "../../common/component/annotator/AnnotationDomHelper";
import TermOccurrence, { CssSelector, TextPositionSelector, TextQuoteSelector } from "../../common/model/TermOccurrence";
import {
  Annotation,
  AnnotationStatus,
  AnnotationType,
} from "../../common/util/Annotation";
import JsonLdUtils from "../../common/util/JsonLdUtils";
import VocabularyUtils from "../../common/util/VocabularyUtils";
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

export const markTerms = (
  termOccurrencesGroup: TermOccurrence[],
  termsMap
): Promise<Annotation[]> => {
  console.log('termOccurrencesGroup: ', termOccurrencesGroup);
  const cssSelector = termOccurrencesGroup[0].target.selectors.find(
    (selector) => selector.types.includes(VocabularyUtils.CSS_SELECTOR)
  ) as CssSelector;
  const textQuoteSelector = termOccurrencesGroup[0].target.selectors.find(
    (selector) => selector.types.includes(VocabularyUtils.TEXT_QUOTE_SELECTOR)
  ) as TextQuoteSelector;
  const textPositionSelector = termOccurrencesGroup[0].target.selectors.find(
    (selector) => selector.types.includes(VocabularyUtils.TEXT_POSITION_SELECTOR)
  ) as TextPositionSelector;

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

      markInstance.mark(textQuoteSelector.exactMatch, {
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

          const pureLeft = calculatedOffset.replace(/\s/g, "").length;
          const pureRight = textPositionSelector.start;

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
          if (annotations.length === termOccurrencesGroup.length) {
            resolve(annotations);
          }
        },
      });
    });
  });
};

// TODO: move this to some sort of a Utils file?
export const occurrenceFromRange = (range, annotationType) => {
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
