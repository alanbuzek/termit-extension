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
import getCssSelector from "css-selector-generator";
import { calculateRangeOffset } from "../../content/marker";
import JsonLdUtils from "../util/JsonLdUtils";
import { finder } from "@medv/finder";

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

console.log('CONTEXT: ', CONTEXT);

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
    websiteIri: string,
    termsMap: TermsMap
  ): TermOccurrence[] {
    return results
      .map(({ cssSelectors, termOccurrences: termOccurrencesRecords }) => {
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
              cssSelectors,
              websiteIri,
              [VocabularyUtils.SUGGESTED_TERM_OCCURRENCE]
            )
          )
          .map((data) => this.create(data, termsMap));
      })
      .flat();
  },
  mapTextAnalysisRecord(
    textAnalysisRecord,
    cssSelectors,
    websiteIri,
    extraTypes: string[] = []
  ) {
    const { about, resource, startOffset, originalTerm, content } =
      textAnalysisRecord as any;

    return {
      id: about,
      termIri: 'http://onto.fel.cvut.cz/ontologies/slovnik/my-new-slovnik/pojem/dfasfasdfasf',
      suggestedLemma: content,
      originalText: originalTerm,
      cssSelector: { startOffset, cssSelector: cssSelectors[0] },
      annotationType: AnnotationType.OCCURRENCE,
      sourceIri: websiteIri,
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
    const generatedCssSelector = getCssSelector(parentElement);
    const secondCssSelector = finder(parentElement as Element);

    console.log(
      "generatedCssSelector: ",
      generatedCssSelector,
      ", second: ",
      secondCssSelector
    );
    const selectionContent = range.toString();

    const termOccurrence = TermOccurrenceFactory.create(
      {
        annotationType,
        cssSelector: {
          cssSelector: secondCssSelector,
          startOffset: offset,
        },
        id: JsonLdUtils.generateBlankNodeId(),
        originalText: selectionContent,
        sourceIri: websiteIri!,
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
      cssSelector: {
        startOffset: number;
        cssSelector: string;
      };
      annotationType: string;
      sourceIri: string;
      extraTypes?: string[];
    },
    termsMap: TermsMap
  ): TermOccurrence {
    const {
      id,
      termIri,
      suggestedLemma,
      originalText,
      cssSelector: { startOffset, cssSelector },
      annotationType,
      sourceIri,
      extraTypes,
    } = data;

    console.log(
      "calling create with data: ",
      data,
      ", extraTypes: ",
      extraTypes
    );
    const termOccurrenceData: any = {
      id,
      types:
        annotationType === AnnotationType.DEFINITION
          ? [VocabularyUtils.TERM_DEFINITION_SOURCE]
          : [VocabularyUtils.WEBSITE_TERM_OCCURRENCE],
      term: termIri ? termsMap[termIri] : undefined,
      target: {
        types: [VocabularyUtils.HAS_WEBSITE_OCCURRENCE_TARGET],
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
    console.log('data: ', data);
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
