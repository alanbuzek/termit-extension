import { AnnotationType } from "../../util/Annotation";
import VocabularyUtils from "../../util/VocabularyUtils";

export function getPropertyForAnnotationType(annotationType: string) {
  if (annotationType === AnnotationType.DEFINITION) {
    return VocabularyUtils.IS_DEFINITION_OF_TERM;
  }
  return VocabularyUtils.IS_OCCURRENCE_OF_TERM;
}
