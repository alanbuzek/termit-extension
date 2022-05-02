import scrollIntoView from "scroll-into-view";

import { HTMLMetadata } from "./html-metadata";

/**
 * @typedef {import('../../types/annotator').Anchor} Anchor
 * @typedef {import('../../types/annotator').Integration} Integration
 */

/**
 * Document type integration for ordinary web pages.
 *
 * This integration is used for web pages and applications that are not handled
 * by a more specific integration (eg. for PDFs).
 *
 * @implements {Integration}
 */
export class HTMLIntegration {
  private container: HTMLElement;

  constructor(container = document.body) {
    this.container = container;

  }


  contentContainer() {
    return this.container;
  }

  /**
   * @param {Anchor} anchor
   */
  scrollToAnchor(anchor) {
    const highlights = /** @type {Element[]} */ anchor.highlights;
    return new Promise((resolve) => {
      scrollIntoView(highlights[0], resolve);
    });
  }
}
