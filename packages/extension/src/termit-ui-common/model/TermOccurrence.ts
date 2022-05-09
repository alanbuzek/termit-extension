import TermAssignment, {
  BASE_CONTEXT as BASE_ASSIGNMENT_CONTEXT,
  CONTEXT as ASSIGNMENT_CONTEXT,
  Target,
  TermAssignmentData,
} from './TermAssignment';
import Utils from '../util/Utils';
import VocabularyUtils from '../util/VocabularyUtils';
// TODO: move to there when possible
// import { isAnnotationWithMinimumScore } from "../component/annotator/AnnotationDomHelper";
export function isAnnotationWithMinimumScore(
  score: number,
  threshold: number
): boolean {
  return typeof score !== 'number' || threshold <= score;
}

export const ANNOTATION_MINIMUM_SCORE_THRESHOLD = 0.65;

const ctx = {
  selectors: `${VocabularyUtils.NS_TERMIT}má-selektor`,
  suggestedLemma: VocabularyUtils.HAS_SUGGESTED_LEMMA,
};

const textQuoteSelectorCtx = {
  exactMatch: `${VocabularyUtils.NS_TERMIT}má-přesný-text-quote`,
  prefix: `${VocabularyUtils.NS_TERMIT}má-prefix-text-quote`,
  suffix: `${VocabularyUtils.NS_TERMIT}má-suffix-text-quote`,
};

const textPositionSelectorCtx = {
  start: `${VocabularyUtils.NS_TERMIT}má-startovní-pozici`,
  end: `${VocabularyUtils.NS_TERMIT}má-koncovou-pozici`,
};

const cssSelectorCtx = {
  value: VocabularyUtils.RDF_VALUE,
};

const xpathSelectorCtx = {
  value: VocabularyUtils.RDF_VALUE,
};

/**
 * Context of the assignment itself, without term or resource context.
 */
export const BASE_CONTEXT = {
  ...BASE_ASSIGNMENT_CONTEXT,
  ...ctx,
  ...textQuoteSelectorCtx,
};

export const CONTEXT = {
  ...ASSIGNMENT_CONTEXT,
  ...ctx,
  ...textQuoteSelectorCtx,
  ...textPositionSelectorCtx,
  ...cssSelectorCtx,
};

export interface Selector {
  iri?: string;
  types: string[];
}

export interface TextQuoteSelector extends Selector {
  exactMatch: string;
  prefix?: string;
  suffix?: string;
}

export interface TextPositionSelector extends Selector {
  start: number;
  end: number;
}

export interface CssSelector extends Selector {
  value: string;
}

export interface XPathSelector extends Selector {
  value: string;
}

export interface OccurrenceTarget extends Target {
  selectors: Selector[];
  iri?: string;
}

export interface TermOccurrenceData extends TermAssignmentData {
  target: OccurrenceTarget;
  score?: number;
  id?: string;
  suggestedLemma?: string;
}

export default class TermOccurrence extends TermAssignment {
  public target: OccurrenceTarget;

  public id: string;

  public score?: number;

  public suggestedLemma?: string;

  constructor(data: TermOccurrenceData) {
    super(data);
    this.target = data.target;
    this.target.selectors = Utils.sanitizeArray(this.target.selectors);
    if (data.id) {
      this.id = data.id;
    } else if (data.iri) {
      this.id = VocabularyUtils.create(data.iri).fragment;
    } else {
      throw new Error(`This term occurrence doesn't have an identifier!`);
    }
    if (typeof data.score === 'number') {
      this.score = data.score;
    }
    if (data.suggestedLemma) {
      this.suggestedLemma = data.suggestedLemma;
    }
  }

  public isSuggested(): boolean {
    return (
      Utils.sanitizeArray(this.types).indexOf(
        VocabularyUtils.SUGGESTED_TERM_OCCURRENCE
      ) !== -1
    );
  }

  public toJsonLd(): TermOccurrenceData {
    const result = { ...this, '@context': CONTEXT };
    // Prevent possible circular JSON reference issue
    (result as any).term = { iri: this.term?.iri };
    return result;
  }

  public getTextQuoteSelector() {
    return this.target.selectors.find((selector) =>
      selector.types.includes(VocabularyUtils.TEXT_QUOTE_SELECTOR)
    ) as TextQuoteSelector;
  }

  public getCssSelector() {
    return this.target.selectors.find((selector) =>
      selector.types.includes(VocabularyUtils.CSS_SELECTOR)
    ) as CssSelector;
  }

  public getTextPositionSelector() {
    return this.target.selectors.find((selector) =>
      selector.types.includes(VocabularyUtils.TEXT_POSITION_SELECTOR)
    ) as TextPositionSelector;
  }

  public getXPathSelector() {
    return this.target.selectors.find((selector) =>
      selector.types.includes(VocabularyUtils.XPATH_SELECTOR)
    ) as XPathSelector;
  }

  public getTextContent() {
    return this.getTextQuoteSelector().exactMatch;
  }

  public getSanitizedExactMatch() {
    // remove new line characters
    return this.getTextQuoteSelector().exactMatch.replace(
      /(\r\n|\n|\r)/gm,
      ' '
    );
  }
}
