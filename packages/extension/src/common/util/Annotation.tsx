import VocabularyUtils from './VocabularyUtils';

export const AnnotationClass = {
  INVALID: "invalid-term-occurrence",
  ASSIGNED_OCCURRENCE: "assigned-term-occurrence",
  SUGGESTED_OCCURRENCE: "suggested-term-occurrence",
  LOADING: "loading-term-occurrence",
  PENDING_DEFINITION: "pending-term-definition",
  DEFINITION: "term-definition",
};

export const AnnotationOrigin = {
  PROPOSED: "proposed-occurrence",
  SELECTED: "selected-occurrence",
};

export const AnnotationType = {
  OCCURRENCE: VocabularyUtils.TERM_OCCURRENCE,
  DEFINITION: VocabularyUtils.DEFINITION,
};

export function isDefinitionAnnotation(type: string) {
  return type === AnnotationType.DEFINITION;
}
