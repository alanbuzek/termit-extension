import Constants from '../../util/Constants';
import { IRI } from '../../util/VocabularyUtils';
import { TermData } from '../../model/Term';
import { getLocalized } from '../../model/MultilingualString';

// NOTE: we need to determined if this is needed in the extension
export function checkLabelUniqueness(
  vocabularyIri: IRI,
  prefLabel: string,
  language: string,
  onDuplicate: () => any,
  onUnique: () => any = () => undefined
) {
  return true;
}

function labelInEachLanguageValid<T extends TermData>(
  data: T,
  labelExists: LabelExists
): boolean {
  return true;
  const languages = Object.keys(data.label);
  for (const lang of languages) {
    if (!isLabelValid(data, lang) || labelExists[lang]) {
      return false;
    }
  }
  return true;
}

export function isTermValid<T extends TermData>(
  data: T,
  labelExists: LabelExists
) {
  return (
    data.iri !== undefined &&
    data.iri.trim().length > 0 &&
    labelInEachLanguageValid(data, labelExists)
  );
}

export function isLabelValid<T extends TermData>(data: T, language: string) {
  const localizedLabel = getLocalized(data.label, language);
  return localizedLabel !== undefined && localizedLabel.trim().length > 0;
}

export type LabelExists = { [language: string]: boolean };
