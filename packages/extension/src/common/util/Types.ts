/**
 * Mapper of values to JSX elements.
 */
export type ValueMapper<T> = (data: T) => JSX.Element | null;

/**
 * Represents parameters passed to the fetchOptions handler of the tree select component.
 */
export interface TreeSelectFetchOptionsParams<T> {
  searchString?: string;
  optionID?: string;
  limit?: number;
  offset?: number;
  option?: T;
}

/**
 * Type representing literal values.
 */
export type Literal = number | string | boolean;

