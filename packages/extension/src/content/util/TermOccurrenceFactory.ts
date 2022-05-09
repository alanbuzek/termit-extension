import TermOccurrence, {
  ANNOTATION_MINIMUM_SCORE_THRESHOLD,
  isAnnotationWithMinimumScore,
} from '../../termit-ui-common/model/TermOccurrence';
import JsonLdUtils from '../../termit-ui-common/util/JsonLdUtils';
import VocabularyUtils from '../../termit-ui-common/util/VocabularyUtils';
import { AnnotationType } from '../Annotation';
import { TermsMap } from '../ContentController';
import ExtensionDomUtils from './ExtensionDomUtils';
import DomUtils from './ExtensionDomUtils';
import { xpathFromNode } from './hypothesis/xpath';

const TermOccurrenceFactory = {
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
            [foundElement] = elements;
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

          const genereratedCssSelectors =
            ExtensionDomUtils.generateNewCssSelector(foundElement!);
          // const xPathSelector = xpathFromNode(foundElement, document.body);

          return {
            termOccurrencesRecords,
            selectors: {
              xPathSelector: '',
              cssSelector: [cssSelectors[0], genereratedCssSelectors].join('|'), // join into 1 string to later parse
            },
          };
        })
        .map(({ selectors, termOccurrencesRecords }) =>
          termOccurrencesRecords
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
            .map((data) => this.create(data, termsMap))
        )
        .flat()
    );
  },
  mapTextAnalysisRecord(
    textAnalysisRecord,
    selectors,
    websiteIri,
    extraTypes: string[] = []
  ) {
    // TODO: use 'resource'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { about, resource, startOffset, originalTerm, content } =
      textAnalysisRecord as any;

    return {
      id: about,
      // TODO: remove this
      termIri: content.startsWith('rus')
        ? 'http://onto.fel.cvut.cz/ontologies/slovnik/novy-lokalni-slovnik/pojem/ruský'
        : '',
      suggestedLemma: content,
      originalText: originalTerm,
      selectors: {
        startOffset,
        cssSelector: selectors.cssSelector,
        xPathSelector: selectors.xPathSelector,
      },
      annotationType: AnnotationType.OCCURRENCE,
      sourceIri: websiteIri || '',
      extraTypes,
    };
  },
  createFromRange(
    range: Range,
    annotationType: string,
    websiteIri: string | undefined,
    termsMap: TermsMap | null
  ) {
    const { offset, parentElement } =
      ExtensionDomUtils.calculateRangeOffset(range);
    const cssSelector = DomUtils.generateNewCssSelector(
      parentElement as Element
    );
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

export default TermOccurrenceFactory;
