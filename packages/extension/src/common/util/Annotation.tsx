import { markTerm } from "../../content/marker";
import VocabularyUtils from "./VocabularyUtils";

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

// NOTE: this was taken from Annotation.jsx in termit-ui repo
const getTermState = (typeOf, term) => {
  // TODO: check if we need the loading state, probably not?
  // if (!this.state.termFetchFinished) {
  //   return AnnotationClass.LOADING;
  // }
  if (term === null) {
    return isDefinitionAnnotation(typeOf)
      ? AnnotationClass.PENDING_DEFINITION
      : AnnotationClass.SUGGESTED_OCCURRENCE;
  }
  if (term) {
    return isDefinitionAnnotation(typeOf)
      ? AnnotationClass.DEFINITION
      : AnnotationClass.ASSIGNED_OCCURRENCE;
  }
  return AnnotationClass.INVALID;
};

const getTermCreatorState = (termScore) => {
  if (termScore) {
    return AnnotationOrigin.PROPOSED;
  }
  return AnnotationOrigin.SELECTED;
};

export class Annotation {
  term = null;
  typeOf = null;

  // methods:
  // markAnnotation(); (called by contructor)
  // remove(); (will hide the annotation)
  // getStatus() - successful/unsuccessful, get some sort of summary
  // getState();
  // updateState();
  // focusAnnotation() - brings focus to the current annotation

  // state:
  // - create + term state
  // - status success/unsuccess
  // - reference to the node where it has been rendered
  // - term itself (if application)

  constructor(term, typeOf) {
    this.term = term;
    this.typeOf = typeOf;
  }

  public getTermState() {
    // TODO: check if we need the loading state, probably not?
    // if (!this.state.termFetchFinished) {
    //   return AnnotationClass.LOADING;
    // }
    if (this.term === null) {
      return isDefinitionAnnotation(this.typeOf)
        ? AnnotationClass.PENDING_DEFINITION
        : AnnotationClass.SUGGESTED_OCCURRENCE;
    }
    if (this.term) {
      return isDefinitionAnnotation(this.typeOf)
        ? AnnotationClass.DEFINITION
        : AnnotationClass.ASSIGNED_OCCURRENCE;
    }
    return AnnotationClass.INVALID;
  }

  public getTermCreatorState() {
    if (this.termScore) {
      return AnnotationOrigin.PROPOSED;
    }
    return AnnotationOrigin.SELECTED;
  }

  public markAnnotation() {
    const termClassName = this.getTermState();
    const termCreatorClassName = this.getTermCreatorState();

    const termFullClassName = `${termClassName} ${termCreatorClassName}`;

    // TODO:
    const termSelector = {};
    //
    markTerm(termSelector, termFullClassName);
  }

  public focusAnnotation() {
    // TODO:
    throw new Error("To be implemented");
  }

  public getStatus() {
    // TODO
    throw new Error("To be implemented");
  }
}
