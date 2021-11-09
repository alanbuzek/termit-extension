/* global chrome */
/* src/content.js */
// import Mark from 'mark.js';
import Mark from '../markjs';
import { MessageType } from '../types';

const init = () => {
  chrome.runtime.sendMessage(
    {
      type: MessageType.GetAnnotations,
      payload: {
        // pageLang: document.documentElement.lang,
        pageHtml: document.body.outerHTML,
      },
    },
    (response) => {
      const { data, error } = response;
      if (error || !data) {
        console.error('There was an error annotationg this page: ', error);
        return;
      }

      console.log('data: ', data);

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
      data.forEach(({ cssSelectors, termOccurrences }) => {
        const selectedElements = Array.from(
          document.querySelectorAll(cssSelectors[0])
        );
        if (selectedElements.length === 1) {
          results.selectors.successes += 1;
        } else if (selectedElements.length === 0) {
          console.log(
            '[Selector] Failure: ',
            cssSelectors,
            ', ',
            selectedElements
          );
          results.selectors.failures += 1;
        } else {
          results.selectors.overselectedFailures += 1;
          console.log(
            '[Selector] Overseledcted Failure: ',
            cssSelectors,
            ', ',
            selectedElements
          );
        }
        if (selectedElements.length === 1) {
          const markInstance = new Mark(selectedElements[0]);
          termOccurrences.forEach((termOccurance) => {
            markInstance.mark(termOccurance.originalTerm, {
              accuracy: {
                value: 'exactly',
                limiters: [
                  ',',
                  '.',
                  ':',
                  ';',
                  "'",
                  '"',
                  '?',
                  '!',
                  ')',
                  '(',
                  '-',
                ],
              },
              filter(node, term, offestInCurrentNode) {
                let calculatedOffset = node.textContent.slice(
                  0,
                  offestInCurrentNode
                );
                let currNode = node;
                while (currNode.previousSibling) {
                  currNode = currNode.previousSibling;
                  if (currNode.textContent) {
                    calculatedOffset = currNode.textContent + calculatedOffset;
                  }
                }

                const pureLeft = calculatedOffset.replace(/\s/g, '');
                const pureRight = termOccurance.startOffset.replace(/\s/g, '');

                return pureLeft === pureRight;
              },
              element: 'termit-h',
              diacritcs: false,
              exclude: ['termit-h'],
              caseSensitive: true,
              separateWordSearch: false,
              className: `termit-highlighted-word`,
              done(numberOfMatches) {
                if (numberOfMatches === 1) {
                  results.highlights.successes += 1;
                } else if (numberOfMatches === 0) {
                  console.log(
                    'Failure: ',
                    termOccurance,
                    ', ',
                    selectedElements[0]
                  );
                  results.highlights.failures += 1;
                } else {
                  results.highlights.overselectedFailures += 1;
                  console.log(
                    'Overseledcted Failure: ',
                    termOccurance,
                    ', ',
                    selectedElements[0]
                  );
                }
              },
            });
          });
        }
      });
      console.log(
        '[Highlight] failures (underselect-overselected): ',
        results.highlights.failures,
        '-',
        results.highlights.overselectedFailures,
        ', successes: ',
        results.highlights.successes
      );
      console.log(
        '[Selector] failures (underselect-overselected): ',
        results.selectors.failures,
        '-',
        results.selectors.overselectedFailures,
        ', successes: ',
        results.selectors.successes
      );
    }
  );
};

let hasBeenLoaded = false;

setTimeout(() => {
  if (hasBeenLoaded) {
    return;
  }
  if (
    document.readyState === 'complete' ||
    document.readyState === 'loaded' ||
    document.readyState === 'interactive'
  ) {
    // document has at least been parsed
    console.log('[TermIt] forcing load');
    hasBeenLoaded = true;
    init(() => {
      //   TODO - done callback
    });
  } else {
    console.log('document not parsed!!');
  }
}, 7 * 1000);

window.addEventListener('load', () => {
  if (hasBeenLoaded) {
    return;
  }
  console.log('[TermIt] loaded traditionally');
  hasBeenLoaded = true;
  init();
});
