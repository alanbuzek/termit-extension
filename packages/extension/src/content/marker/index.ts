import Mark from "../../markjs";

export const markTerm = ({ cssSelectors, termOccurrences }, results) => {
    const selectedElements = Array.from(
      document.querySelectorAll(cssSelectors[0])
    );
  
    if (results) {
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
    }
  
    if (selectedElements.length === 1) {
      const markInstance = new Mark(selectedElements[0]);
      termOccurrences.forEach((termOccurance) => {
        markInstance.mark(termOccurance.originalTerm, {
          // accuracy: {
          //   value: "exactly",
          //   limiters: [",", ".", ":", ";", "'", '"', "?", "!", ")", "(", "-"],
          // },
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
            const pureRight = termOccurance.startOffset.replace(/\s/g, "");
  
            console.log("pureLeft: ", pureLeft, ", pureRight: ", pureRight);
            return pureLeft === pureRight;
          },
          element: "termit-h",
          diacritcs: false,
          exclude: ["termit-h"],
          caseSensitive: true,
          separateWordSearch: false,
          className: `termit-highlighted-word`,
          done(numberOfMatches) {
            console.log("done once: ", numberOfMatches);
            if (!results) {
              return;
            }
            if (numberOfMatches === 1) {
              results.highlights.successes += 1;
            } else if (numberOfMatches === 0) {
              console.log("Failure: ", termOccurance, ", ", selectedElements[0]);
              results.highlights.failures += 1;
            } else {
              results.highlights.overselectedFailures += 1;
              console.log(
                "Overseledcted Failure: ",
                termOccurance,
                ", ",
                selectedElements[0]
              );
            }
          },
        });
      });
    }
  };
  