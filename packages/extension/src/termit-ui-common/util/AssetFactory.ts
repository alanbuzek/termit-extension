import { TermData } from '../model/Term';
import Utils from './Utils';
import VocabularyUtils from './VocabularyUtils';
import TermAssignment, { TermAssignmentData } from '../model/TermAssignment';
import TermOccurrence, { TermOccurrenceData } from '../model/TermOccurrence';
import { langString } from '../model/MultilingualString';

const AssetFactory = {
  /**
   * Creates an instance of TermAssignment or TermOccurrence based on the specified data.
   * @param data Data instantiation
   */
  createTermAssignment(data: TermAssignmentData): TermAssignment {
    const types = Utils.sanitizeArray(data.types);
    if (types.indexOf(VocabularyUtils.TERM_OCCURRENCE) !== -1) {
      return new TermOccurrence(data as TermOccurrenceData);
    }
    if (types.indexOf(VocabularyUtils.TERM_ASSIGNMENT) !== -1) {
      return new TermAssignment(data);
    }
    throw new TypeError(
      `Unsupported type of assignment data ${JSON.stringify(data)}`
    );
  },

  /**
   * Creates an object with empty values for TermData attributes.
   *
   * That is, string-based attributes (iri, label etc.) will be empty strings, array-valued attributes (types,
   * sources, parentTerms) will be empty arrays.
   *
   * @param lang Language to use for multilingual attribute default values (optional)
   */
  createEmptyTermData(lang?: string): TermData {
    return {
      iri: '',
      label: langString('', lang),
      definition: langString('', lang),
      scopeNote: langString('', lang),
      types: [],
      sources: [],
      parentTerms: [],
      altLabels: undefined,
      hiddenLabels: undefined,
      definitionSource: undefined,
      draft: true,
    };
  },
};

export default AssetFactory;
