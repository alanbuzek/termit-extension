import { occurrenceTypes } from '../../content/components/Sidebar/FiltersPanel';
import { unmarkTerm } from "../../content/marker";
import Term from "../model/Term";
import TermOccurrence from "../model/TermOccurrence";
import VocabularyUtils from "./VocabularyUtils";

export const AnnotationTypeClass = {
  INVALID: "invalid-term-occurrence",
  ASSIGNED_OCCURRENCE: "assigned-term-occurrence",
  SUGGESTED_OCCURRENCE: "suggested-term-occurrence",
  LOADING: "loading-term-occurrence",
  PENDING_DEFINITION: "pending-term-definition",
  DEFINITION: "term-definition",
};

export const AnnotationOriginClass = {
  PROPOSED: "proposed-occurrence",
  SELECTED: "selected-occurrence",
};

export const AnnotationType = {
  OCCURRENCE: VocabularyUtils.TERM_OCCURRENCE,
  DEFINITION: VocabularyUtils.DEFINITIONAL_OCCURRENCE,
};

export enum AnnotationStatus {
  SUCCESS,
  FAILURE,
  PENDING,
}

// TODO: remove when no longer needed as a reference
// export type TermOccurrence = {
//   about: string;
//   content: string;
//   originalTerm: string;
//   property: string;
//   resource: string;
//   score?: number;
//   // TODO: change startOffset to a number
//   startOffset: string;
//   typeof: string;
//   cssSelector: string;
// };

// TODO: we'll have to make sure that the mapping works ok here (e.g. ddo:definice vs full url)
export function isDefinitionAnnotation(types: string[]) {
  return types.includes(AnnotationType.DEFINITION);
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
      return isDefinitionAnnotation(this.termOccurrence.types)
        ? AnnotationTypeClass.PENDING_DEFINITION
        : AnnotationTypeClass.SUGGESTED_OCCURRENCE;
    }
    if (this.termOccurrence) {
      return isDefinitionAnnotation(this.termOccurrence.types)
        ? AnnotationTypeClass.DEFINITION
        : AnnotationTypeClass.ASSIGNED_OCCURRENCE;
    }
    return AnnotationTypeClass.INVALID;
  }

  public getTermCreatorState() {
    // TODO: this check may later not work with existing terms
    if (this.termOccurrence.isSuggested()) {
      return AnnotationOriginClass.PROPOSED;
    }
    return AnnotationOriginClass.SELECTED;
  }

  public getClassName() {
    const termClassName = this.getTermState();
    const termCreatorClassName = this.getTermCreatorState();

    return `${termClassName} ${termCreatorClassName}`;
  }

  public getTypeName() {
    const className = this.getClassName();
    return occurrenceTypes.find(type => type.value == className)?.name || 'Uknown annotation type';
  }

  public focusAnnotation() {
    this.element?.scrollIntoView({ block: "center", inline: "nearest" });
    this.element?.classList.add("annotation-focused");
    // this.element?.click();
    setTimeout(() => {
      this.element?.classList.remove("annotation-focused");
    }, 4000);
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

  public assignTerm(term: Term, annotationType: string) {
    this.term = term;
    this.termOccurrence.term = term;
    if (annotationType === AnnotationType.DEFINITION){
      this.termOccurrence.types.push(VocabularyUtils.DEFINITIONAL_OCCURRENCE);
    }
    // delete this.termOccurrence.score;

    this.termOccurrence.types = this.termOccurrence.types.filter(type => type !== VocabularyUtils.SUGGESTED_TERM_OCCURRENCE);
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
