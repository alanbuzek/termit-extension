import Mark from 'mark.js';
import { AnnotatorActions } from '../AnnotatorController';
import TermOccurrence from '../../termit-ui-common/model/TermOccurrence';
import Annotation from '../Annotation';
import { nodeFromXPath } from './hypothesis/xpath';

// hanldes marked element click -> call global annotation action
const handleElementClick = (annotation) => (event) => {
  event.stopPropagation();
  event.preventDefault();
  AnnotatorActions.showPopup(annotation);
};

/**
 * Attempts to resolve our selectors
 */
const selectAnnotationContainer = (termOccurrence: TermOccurrence) => {
  const cssSelector = termOccurrence.getCssSelector().value;
  const xPathSelector = termOccurrence.getXPathSelector()?.value;

  const cachedResult =
    markJsInstancesCache[cssSelector] || markJsInstancesCache[xPathSelector];

  if (cachedResult && cachedResult.element.isConnected) {
    return cachedResult.element;
  }

  // not found in cache
  const cssSelectors = termOccurrence.getCssSelector().value.split('|');

  // eslint-disable-next-line no-restricted-syntax
  for (const selector of cssSelectors) {
    const selectedElements = Array.from(document.querySelectorAll(selector));
    if (selectedElements.length === 1) {
      console.log('found element with selector: ', selector);
      return selectedElements[0];
    }
    console.log('NOT found element with selector: ', selector);
  }

  if (xPathSelector) {
    return nodeFromXPath(xPathSelector);
  }
};

// we're caching markjs instances asociated with elements, so there don't need to be extra querySelector calls
const markJsInstancesCache = {};

/**
 * Object wrapping calls to the adjusted mark.js library at https://github.com/alanbuzek/mark.js
 */
const Marker = {
  unmarkAnnotation(element: HTMLElement) {
    return new Promise((resolve) =>
      new Mark(element).unmark({
        done: resolve,
        attribute: {
          key: 'data-term-occurrence-iri',
          // only resolve a very specific element, not all elements
          value: element.dataset.termOccurrenceIri,
        },
      })
    );
  },
  markAnnotation(
    termOccurrence: TermOccurrence,
    termsMap
  ): Promise<Annotation> {
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
        // NOTE: 'partially' is safer, as we may not have an exhaustive list of limiters, and since we know the exact position
        // of the word, there's no reason not to use it (even though it might not be used very often)
        accuracy: 'partially',
        filter(node, _term, offestInCurrentNode) {
          let calculatedOffset = node.textContent.slice(0, offestInCurrentNode);
          let currNode = node;
          while (currNode.previousSibling) {
            currNode = currNode.previousSibling;
            if (currNode.textContent) {
              calculatedOffset = currNode.textContent + calculatedOffset;
            }
          }

          const commonAncestor = selectedElement;
          let currentElement = node.parentElement;

          while (currentElement !== commonAncestor) {
            let currentPreviousSibling = currentElement.previousSibling;
            while (currentPreviousSibling) {
              calculatedOffset =
                (currentPreviousSibling.textContent || '') + calculatedOffset;
              currentPreviousSibling = currentPreviousSibling.previousSibling;
            }
            currentElement = currentElement.parentNode!;
          }

          const pureLeft = calculatedOffset.replace(/\s/g, '').length;
          const pureRight = textPositionSelector.start;

          return pureLeft === pureRight;
        },
        element: 'termit-h', // termit-highlight element
        diacritcs: false,
        exclude: ['style', 'script', 'iframe', 'title'],
        caseSensitive: true,
        separateWordSearch: false,
        acrossElements: true,
        className: annotation.getClassName(),
        each(element) {
          element.addEventListener('click', handleElementClick(annotation));
          // eslint-disable-next-line no-param-reassign
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
  },
};

export default Marker;
