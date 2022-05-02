function calculatePathLength(node: Node, ancestor: Node): number {
  let parent = node.parentNode;
  let length = 0;
  while (parent && parent !== ancestor) {
    length++;
    parent = parent.parentNode;
  }
  return length;
}

/**
 * Detects if the specified selection is backwards.
 * @param sel Selection to check
 */
function isBackwards(sel: Selection): boolean {
  const range = document.createRange();
  range.setStart(sel.anchorNode!, sel.anchorOffset);
  range.setEnd(sel.focusNode!, sel.focusOffset);
  const backwards = range.collapsed;
  range.detach();
  return backwards;
}

const HtmlDomUtils = {
  /**
   * Returns true if the range starts in one element and ends in another (except text nodes).
   *
   * This can cause problems for annotation generation.
   * @param range Range to check
   */
  doesRangeSpanMultipleElements(range: Range): boolean {
    return (
      range.startContainer !== range.endContainer &&
      calculatePathLength(
        range.startContainer,
        range.commonAncestorContainer
      ) !==
        calculatePathLength(range.endContainer, range.commonAncestorContainer)
    );
  },

  extendSelectionToWords() {
    const sel = window.getSelection();
    if (
      sel &&
      !sel.isCollapsed &&
      sel.anchorNode &&
      sel.focusNode &&
      // @ts-ignore
      sel.modify
    ) {
      const backwards = isBackwards(sel);
      // modify() works on the focus of the selection
      const endNode = sel.focusNode;
      const endOffset = Math.max(0, sel.focusOffset - 1);
      sel.collapse(
        sel.anchorNode,
        backwards ? sel.anchorOffset : sel.anchorOffset + 1
      );
      if (backwards) {
        // Note that we are not using sel.modify by word due to issues with Firefox messing up the modification/extension
        // in certain situations (Bug #1610)
        const anchorText = sel.anchorNode.textContent || "";
        while (
          anchorText.charAt(sel.anchorOffset).trim().length !== 0 &&
          sel.anchorOffset < anchorText.length
        ) {
          // @ts-ignore
          sel.modify("move", "forward", "character");
        }
        const text = endNode.textContent || "";
        let index = endOffset;
        while (text.charAt(index).trim().length !== 0 && index >= 0) {
          index--;
        }
        sel.extend(endNode, index + 1);
      } else {
        // @ts-ignore
        sel.modify("move", "backward", "word");
        const text = endNode.textContent || "";
        let index = endOffset;
        while (text.charAt(index).trim().length !== 0 && index < text.length) {
          index++;
        }
        sel.extend(endNode, index);
      }
    }
  },

  /**
   * Gets the selected range in the current window, if present and not empty.
   *
   * @return Range | null Selected range or null if there is none
   */
  getSelectionRange(): Range | null {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      return sel.getRangeAt(0);
    }
    return null;
  },
};

export default HtmlDomUtils;
