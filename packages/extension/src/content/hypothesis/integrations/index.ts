import { HTMLIntegration } from './html';

/**
 * @typedef {import('../../types/annotator').Annotator} Annotator
 * @typedef {import('../../types/annotator').Integration} Integration
 */

/**
 * Create the integration that handles document-type specific aspects of
 * guest functionality.
 *
 * @param {Annotator} annotator
 * @return {Integration}
 */
export function createIntegration(annotator) {
  // TODO: add PDF and possibly other integrations later
  // if (isPDF()) {
  //   return new PDFIntegration(annotator);
  // }

  // const vsFrameRole = vitalSourceFrameRole();
  // if (vsFrameRole === 'content') {
  //   return new VitalSourceContentIntegration();
  // }

  return new HTMLIntegration();
}