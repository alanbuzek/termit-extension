import TermAssignment, {
  BASE_CONTEXT as BASE_ASSIGNMENT_CONTEXT,
  CONTEXT as ASSIGNMENT_CONTEXT,
  Target,
  TermAssignmentData,
} from "./TermAssignment";
import Utils from "../util/Utils";
import VocabularyUtils from "../util/VocabularyUtils";
import { TermsMap } from "../../content";
import { AnnotationType } from "../util/Annotation";
import { calculateRangeOffset } from "../../content/marker";
import JsonLdUtils from "../util/JsonLdUtils";
import { generateNewCssSelector } from "../../content/helper/selectors";
import { xpathFromNode } from "../../content/helper/xpath";

// TODO: move to there when possible
// import { isAnnotationWithMinimumScore } from "../component/annotator/AnnotationDomHelper";
export function isAnnotationWithMinimumScore(
  score: number,
  threshold: number
): boolean {
  return typeof score !== "number" || threshold <= score;
}

export const ANNOTATION_MINIMUM_SCORE_THRESHOLD = 0.65;

const ctx = {
  selectors: VocabularyUtils.NS_TERMIT + "má-selektor",
  suggestedLemma: VocabularyUtils.HAS_SUGGESTED_LEMMA,
};

const textQuoteSelectorCtx = {
  exactMatch: VocabularyUtils.NS_TERMIT + "má-přesný-text-quote",
  prefix: VocabularyUtils.NS_TERMIT + "má-prefix-text-quote",
  suffix: VocabularyUtils.NS_TERMIT + "má-suffix-text-quote",
};

const textPositionSelectorCtx = {
  start: VocabularyUtils.NS_TERMIT + "má-startovní-pozici",
  end: VocabularyUtils.NS_TERMIT + "má-koncovou-pozici",
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
export const BASE_CONTEXT = Object.assign(
  {},
  BASE_ASSIGNMENT_CONTEXT,
  ctx,
  textQuoteSelectorCtx
);

export const CONTEXT = Object.assign(
  {},
  ASSIGNMENT_CONTEXT,
  ctx,
  textQuoteSelectorCtx,
  textPositionSelectorCtx,
  cssSelectorCtx
);

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

export const TermOccurrenceFactory = {
  createFromTextAnalysisResults(
    results: any[],
    websiteIri?: string,
    termsMap?: TermsMap | null
  ): TermOccurrence[] {
    return (
      results
        .map(({ cssSelectors, termOccurrences: termOccurrencesRecords }) => {
          let foundElement: Element | null = null;

          const elements = Array.from(
            document.querySelectorAll(cssSelectors[0])
          );
          if (elements.length === 1) {
            foundElement = elements[0];
          }

          return { cssSelectors, termOccurrencesRecords, foundElement };
        })
        // just drop all occurrences that have not been initially found on page
        .filter((res) => {
          if (!res.foundElement) {
            console.warn(
              `Lost ${res.termOccurrencesRecords.length} annotations in initial selection`
            );
          }

          return !!res.foundElement;
        })
        .map(({ termOccurrencesRecords, cssSelectors, foundElement }) => {
          // selector from back-end was successful -> add more to make really robust

          const genereratedCssSelectors = generateNewCssSelector(foundElement!);
          const xPathSelector = xpathFromNode(foundElement, document.body);

          return {
            termOccurrencesRecords,
            selectors: {
              xPathSelector,
              cssSelector: [cssSelectors[0], genereratedCssSelectors].join("|"), // join into 1 string to later parse
            },
          };
        })
        .map(({ selectors, termOccurrencesRecords }) => {
          return termOccurrencesRecords
            .filter((textAnalysisRecord) =>
              isAnnotationWithMinimumScore(
                textAnalysisRecord.score,
                ANNOTATION_MINIMUM_SCORE_THRESHOLD
              )
            )
            .map((textAnalysisRecord) =>
              this.mapTextAnalysisRecord(
                textAnalysisRecord,
                selectors,
                websiteIri,
                [VocabularyUtils.SUGGESTED_TERM_OCCURRENCE]
              )
            )
            .map((data) => this.create(data, termsMap));
        })
        .flat()
    );
  },
  mapTextAnalysisRecord(
    textAnalysisRecord,
    selectors,
    websiteIri,
    extraTypes: string[] = []
  ) {
    const { about, resource, startOffset, originalTerm, content } =
      textAnalysisRecord as any;

    return {
      id: about,
      // TODO: remove this
      termIri: content.startsWith("rus")
        ? "http://onto.fel.cvut.cz/ontologies/slovnik/novy-lokalni-slovnik/pojem/ruský"
        : "",
      suggestedLemma: content,
      originalText: originalTerm,
      selectors: {
        startOffset,
        cssSelector: selectors.cssSelector,
        xPathSelector: selectors.xPathSelector,
      },
      annotationType: AnnotationType.OCCURRENCE,
      sourceIri: websiteIri || "",
      extraTypes,
    };
  },
  createFromRange(
    range: Range,
    annotationType: string,
    websiteIri: string | undefined,
    termsMap: TermsMap | null
  ) {
    const { offset, parentElement } = calculateRangeOffset(range);
    const cssSelector = generateNewCssSelector(parentElement as Element);
    const xPathSelector = xpathFromNode(parentElement, document.body);
    const selectionContent = range.toString();
    const termOccurrence = TermOccurrenceFactory.create(
      {
        annotationType,
        selectors: {
          cssSelector,
          startOffset: offset,
          xPathSelector,
        },
        id: JsonLdUtils.generateBlankNodeId(),
        originalText: selectionContent,
        sourceIri: websiteIri || '',
      },
      termsMap!
    );

    return termOccurrence;
  },
  create(
    data: {
      id: string;
      termIri?: string;
      suggestedLemma?: string;
      originalText: string;
      selectors: {
        startOffset: number;
        cssSelector: string;
        xPathSelector: string;
      };
      annotationType: string;
      sourceIri?: string;
      extraTypes?: string[];
    },
    termsMap?: TermsMap | null
  ): TermOccurrence {
    const {
      id,
      termIri,
      suggestedLemma,
      originalText,
      selectors: { startOffset, cssSelector, xPathSelector },
      annotationType,
      sourceIri,
      extraTypes,
    } = data;

    const termOccurrenceData: any = {
      id,
      types:
        annotationType === AnnotationType.DEFINITION
          ? [VocabularyUtils.TERM_DEFINITION_SOURCE]
          : [VocabularyUtils.WEBSITE_TERM_OCCURRENCE],
      term:
        termIri && termsMap && termsMap[termIri]
          ? termsMap[termIri]
          : undefined,
      target: {
        types: [VocabularyUtils.WEBSITE_OCCURRENCE_TARGET],
        selectors: [
          {
            types: [VocabularyUtils.TEXT_QUOTE_SELECTOR],
            exactMatch: originalText,
          },
          {
            types: [VocabularyUtils.TEXT_POSITION_SELECTOR],
            end: -1,
            start: startOffset,
          },
          {
            types: [VocabularyUtils.CSS_SELECTOR],
            value: cssSelector,
          },
          {
            types: [VocabularyUtils.XPATH_SELECTOR],
            value: xPathSelector,
          },
        ],
        source: {
          iri: sourceIri,
        },
      },
    };

    if (extraTypes) {
      termOccurrenceData.types.push(...extraTypes);
    }

    if (
      termOccurrenceData.types.includes(
        VocabularyUtils.SUGGESTED_TERM_OCCURRENCE
      ) &&
      suggestedLemma
    ) {
      termOccurrenceData.suggestedLemma = suggestedLemma;
    }

    return new TermOccurrence(termOccurrenceData);
  },
};

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
    if (typeof data.score === "number") {
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
    const result = Object.assign({}, this, { "@context": CONTEXT });
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
      " "
    );
  }
}
