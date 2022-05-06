import getCssSelector from "css-selector-generator";
import { finder } from "@medv/finder";
import { getSingleSelector } from "optimal-select";

export const generateNewCssSelector = (element: Element) => {
  const selector1 = getCssSelector(element);
  const selector2 = finder(element);
  const selector3 = getSingleSelector(element);

  // join selectors into a string a device by '|' to be able to later parse it
  return [...new Set([selector1, selector2, selector3])].join('|');
};
