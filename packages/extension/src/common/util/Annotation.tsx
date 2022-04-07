import { markTerms, unmarkTerm } from "../../content/marker";
import Term from "../model/Term";
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

export enum AnnotationStatus {
  SUCCESS,
  FAILURE,
  PENDING,
}

export type TermOccurrence = {
  about: string;
  content: string;
  originalTerm: string;
  property: string;
  resource: string;
  score?: number;
  // TODO: change startOffset to a number
  startOffset: string;
  typeof: string;
  cssSelector: string;
};

// TODO: we'll have to make sure that the mapping works ok here (e.g. ddo:definice vs full url)
export function isDefinitionAnnotation(type: string) {
  console.log("type: ", type, ", definintion: ", AnnotationType.DEFINITION);
  return type === AnnotationType.DEFINITION;
}
export class Annotation {
  public termOccurrence: TermOccurrence;
  public term: Term | null = null;
  private annotatationStatus: AnnotationStatus = AnnotationStatus.PENDING;
  private element?: HTMLElement;
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

  constructor(termOccurrence, term = null) {
    this.termOccurrence = termOccurrence;
    this.term = term;
  }

  public getTermState() {
    // TODO: check if we need the loading state, probably not?
    // if (!this.state.termFetchFinished) {
    //   return AnnotationClass.LOADING;
    // }

    if (this.term === null) {
      // this.termOccurrence.typeof maybe be subject to change
      return isDefinitionAnnotation(this.termOccurrence.typeof)
        ? AnnotationClass.PENDING_DEFINITION
        : AnnotationClass.SUGGESTED_OCCURRENCE;
    }
    if (this.termOccurrence) {
      return isDefinitionAnnotation(this.termOccurrence.typeof)
        ? AnnotationClass.DEFINITION
        : AnnotationClass.ASSIGNED_OCCURRENCE;
    }
    return AnnotationClass.INVALID;
  }

  public getTermCreatorState() {
    // TODO: this check may later not work with existing terms
    if (this.termOccurrence.score) {
      return AnnotationOrigin.PROPOSED;
    }
    return AnnotationOrigin.SELECTED;
  }

  public getClassName() {
    const termClassName = this.getTermState();
    const termCreatorClassName = this.getTermCreatorState();

    return `${termClassName} ${termCreatorClassName}`;
  }

  public focusAnnotation() {
    this.element?.scrollIntoView({block: "center", inline: "nearest"});
    this.element?.classList.add("annotation-focused");
    this.element?.click();
    setTimeout(() => {
      this.element?.classList.remove("annotation-focused");
    }, 4000);
  }

  public markAnnotation() {
    // TODO: if needed?
    throw new Error("To be implemented");
  }

  public set status(newStaus) {
    this.annotatationStatus = newStaus;
  }

  public get status() {
    return this.annotatationStatus;
  }

  public setElement(newElement) {
    this.element = newElement;
  }

  public getElement() {
    return this.element;
  }

  public assignTerm(term: Term, isTermOccurrence: boolean) {
    this.term = term;
    this.termOccurrence.typeof = isTermOccurrence
      ? AnnotationType.OCCURRENCE
      : AnnotationType.DEFINITION;
    delete this.termOccurrence.score;
    this.updateAppearance();
  }

  public async removeOccurrence() {
    return unmarkTerm(this.element!);
  }

  private updateAppearance() {
    this.element!.className = this.getClassName();

    console.log("updated now: ", this);
  }
}
