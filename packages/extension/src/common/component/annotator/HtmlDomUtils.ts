function calculatePathLength(node: Node, ancestor: Node): number {
  let parent = node.parentNode;
  let length = 0;
  while (parent && parent !== ancestor) {
    length++;
    parent = parent.parentNode;
  }
  return length;
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
};

export default HtmlDomUtils;
