import TermAssignment, {
  BASE_CONTEXT as BASE_ASSIGNMENT_CONTEXT,
  CONTEXT as ASSIGNMENT_CONTEXT,
  Target,
  TermAssignmentData,
} from "./TermAssignment";
import Utils from "../util/Utils";
import VocabularyUtils from "../util/VocabularyUtils";
import { TermsMap } from "../../content";

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
  selectors: VocabularyUtils.NS_TERMIT + "má-selektor",
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
}

export interface TermOccurrenceData extends TermAssignmentData {
  target: OccurrenceTarget;
  score?: number;
  id?: string;
}

export const createTermOccurrences = (
  results: any[],
  websiteIri: string,
  terms: TermsMap,
  extraTypes?: string[]
): TermOccurrence[][] => {
  return results.map(({ cssSelectors, termOccurrences }) => {
    return termOccurrences
      .filter((termOccurrence) =>
        isAnnotationWithMinimumScore(
          termOccurrence.score,
          ANNOTATION_MINIMUM_SCORE_THRESHOLD
        )
      )
      .map((termOccurrence) => {
        const {
          about,
          property,
          resource,
          content,
          typeof: typeOf,
          score,
          startOffset,
          originalTerm,
        } = termOccurrence;

        const termOccurrenceData = {
          id: about,
          // iri: VocabularyUtils.WEBSITE_TERM_OCCURRENCE + `/${about}`,
          types: [
            VocabularyUtils.TERM_OCCURRENCE,
            VocabularyUtils.WEBSITE_TERM_OCCURRENCE
          ],
          score,
          term: resource ? terms[resource] : undefined,
          target: {
            // iri: VocabularyUtils.WEBSITE_OCCURRENCE_TARGET + "/instance1749321978",
            types: [
              VocabularyUtils.TERM_OCCURRENCE_TARGET,
              VocabularyUtils.WEBSITE_OCCURRENCE_TARGET,
            ],
            selectors: [
              {
                // iri: VocabularyUtils.TEXT_QUOTE_SELECTOR + "/instance-1673666643",
                types: [
                  VocabularyUtils.TEXT_QUOTE_SELECTOR,
                  VocabularyUtils.SELECTOR,
                ],
                exactMatch: originalTerm,
              },
              {
                // iri: VocabularyUtils.TEXT_POSITION_SELECTOR + "/instance1202492151",
                types: [
                  VocabularyUtils.SELECTOR,
                  VocabularyUtils.TEXT_POSITION_SELECTOR,
                ],
                // TODO; maybe remove this?
                end: -1,
                // TODO: adjust for just storing length, in annotace service
                start: startOffset,
              },
              {
                // iri: VocabularyUtils.CSS_SELECTOR + "/instance455547086",
                types: [VocabularyUtils.SELECTOR, VocabularyUtils.CSS_SELECTOR],
                // TODO: this should be changed to an array later?
                value: cssSelectors[0],
              },
            ],
            source: {
              iri: websiteIri,
            },
          },
        };

        if (extraTypes){
          termOccurrenceData.types.push(...extraTypes);
        }

        return new TermOccurrence(termOccurrenceData);
      });
  });
};

// TODO: remove example
// const example = {
//   iri: VocabularyUtils.WEBSITE_TERM_OCCURRENCE + "/instance-205549560",
//   target: {
//     iri: VocabularyUtils.WEBSITE_OCCURRENCE_TARGET + "/instance1749321978",
//     types: [
//       VocabularyUtils.TERM_OCCURRENCE_TARGET,
//       VocabularyUtils.WEBSITE_OCCURRENCE_TARGET,
//       VocabularyUtils.SUGGESTED_TERM_OCCURRENCE,
//     ],
//     selectors: [
//       {
//         iri: VocabularyUtils.TEXT_QUOTE_SELECTOR + "/instance-1673666643",
//         types: [VocabularyUtils.TEXT_QUOTE_SELECTOR, VocabularyUtils.SELECTOR],
//         exactMatch: "example match",
//       },
//       {
//         iri: VocabularyUtils.TEXT_POSITION_SELECTOR + "/instance1202492151",
//         types: [
//           VocabularyUtils.SELECTOR,
//           VocabularyUtils.TEXT_POSITION_SELECTOR,
//         ],
//         end: 10,
//         start: 5,
//       },
//       {
//         iri: VocabularyUtils.CSS_SELECTOR + "/instance455547086",
//         types: [VocabularyUtils.SELECTOR, VocabularyUtils.CSS_SELECTOR],
//         value: "div > .example",
//       },
//     ],
//     source: {
//       iri: "http://onto.fel.cvut.cz/ontologies/slovnik/http:--skauti.lubina.cz-subdom-skauti-2022-01-27-jarni-prazdniny-3-",
//     },
//   },
//   types: [
//     VocabularyUtils.TERM_OCCURRENCE,
//     VocabularyUtils.WEBSITE_TERM_OCCURRENCE,
//   ],
// };

export default class TermOccurrence extends TermAssignment {
  public target: OccurrenceTarget;
  public id?: string;
  public score?: number;

  constructor(data: TermOccurrenceData) {
    super(data);
    this.target = data.target;
    this.target.selectors = Utils.sanitizeArray(this.target.selectors);
    if (data.id){
      this.id = data.id;
    }
    if (typeof data.score === 'number'){
      this.score = data.score
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
  
  public getTextQuoteSelector(){
    return this.target.selectors.find(
      (selector) => selector.types.includes(VocabularyUtils.TEXT_QUOTE_SELECTOR)
    ) as TextQuoteSelector;
  }

  public getCssSelector(){
    return this.target.selectors.find(
      (selector) => selector.types.includes(VocabularyUtils.CSS_SELECTOR)
    ) as CssSelector;
  }

  public getTextPositionSelector(){
    return this.target.selectors.find(
      (selector) => selector.types.includes(VocabularyUtils.TEXT_POSITION_SELECTOR)
    ) as TextPositionSelector;
  }

  public getTextContent(){
    return this.getTextQuoteSelector().exactMatch;
  }
}
