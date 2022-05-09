import _ from 'lodash';
import { HasLabel } from '../model/Asset';

/**
 * General utility functions.
 */
const Utils = {
  /**
   * Ensures that the specified argument is returned as an array at all conditions.
   *
   * If the argument is a single element, it is returned as a single-element array.
   * @param arr Input to sanitize
   */
  sanitizeArray<T>(arr: T[] | T | undefined | null): T[] {
    return arr ? (Array.isArray(arr) ? arr : [arr]) : [];
  },

  /**
   * Calculates the height of the asset tree selector.
   */
  calculateAssetListHeight() {
    return window.innerHeight >= 950
      ? window.innerHeight * 0.66
      : window.innerHeight / 2;
  },

  /**
   * Compares the specified asset data by their label.
   *
   * Internally uses String.localeCompare
   * @param a Reference asset
   * @param b Asset to compare it to
   */
  labelComparator<T extends HasLabel>(a: T, b: T) {
    return a.getLabel().localeCompare(b.getLabel());
  },

  /**
   * Calculates a hash of the specified string.
   * @param str String to get hash for
   */
  hashCode(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return h;
  },
};

export default Utils;
