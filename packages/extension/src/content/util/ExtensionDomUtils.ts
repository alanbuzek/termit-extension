// import getCssSelector from 'css-selector-generator';
import { finder } from '@medv/finder';
import { getSingleSelector } from 'optimal-select';

const ExtensionDomUtils = {
  /**
   *  Ad-hoc check for Chrome's embedded pdf viewer
   */
  isPagePDFViewer() {
    const pdfViewer = document.querySelector('embed[type="application/pdf"]');

    if (!pdfViewer) {
      return;
    }

    // if a viewer is found, we wan to make sure it takes up the whole page, not just some embedded viwer within a larger page
    const widthDiff = Math.abs(
      document.documentElement.clientWidth -
        pdfViewer.getBoundingClientRect().width
    );

    const heightDiff = Math.abs(
      document.documentElement.clientHeight -
        pdfViewer.getBoundingClientRect().height
    );

    // can be slightly off (usually by just a few decimals)
    return widthDiff + heightDiff < 100;
  },
  getPageUrl() {
    // ignore any query params
    return document.location.href
      .replace(document.location.search, '')
      .replace(document.location.hash, '');
  },

  /**
   * Generates multiple css selectors for the suplied element. We want to sure to be able to be able to subsequently
   * select the element, thus generating multiple selectors
   */
  generateNewCssSelector(element: Element) {
    // const selector1 = getCssSelector(element);
    try {
      // const selector1 = getCssSelector(element, { maxCandidates: 5 });
      const selector2 = finder(element, {
        maxNumberOfTries: 5,
      });
      const selector3 = getSingleSelector(element);
      return [...new Set([selector2, selector3])].join('|');
    } catch (err) {
      return '';
    }
  },

  calculateRangeOffset(range: Range) {
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

    const isAcrossMultipleElements =
      range.startContainer !== range.endContainer;

    const commonAncestor = range.commonAncestorContainer;

    if (!commonAncestor) {
      throw new Error('No parent element to create annotation!');
    }

    if (isAcrossMultipleElements) {
      let currentElement = parentElement;
      while (currentElement !== commonAncestor) {
        let currentPreviousSibling = currentElement.previousSibling;
        while (currentPreviousSibling) {
          offsetString += currentPreviousSibling.textContent || '';
          currentPreviousSibling = currentPreviousSibling.previousSibling;
        }
        currentElement = currentElement.parentNode!;
      }
    }

    return {
      offset: offsetString.replace(/\s/g, '').length,
      parentElement: isAcrossMultipleElements ? commonAncestor : parentElement,
      isAcrossMultipleElements,
    };
  },
};

export default ExtensionDomUtils;
