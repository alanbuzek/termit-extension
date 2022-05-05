import { occurrenceTypes } from "../../content/components/Sidebar/FiltersPanel";
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
  DEFINITION: VocabularyUtils.TERM_DEFINITION_SOURCE,
};

export const AnnotationFocusTime = {
  SHORT: 4000,
  MEDIUM: 8000,
  LONG: 12000,
  INFINITE: -1,
};

// TODO: we'll have to make sure that the mapping works ok here (e.g. ddo:definice vs full url)
export function isDefinitionAnnotation(types: string[]) {
  return types.includes(AnnotationType.DEFINITION);
}
export class Annotation {
  public termOccurrence: TermOccurrence;
  public term: Term | null = null;
  private elements: HTMLElement[] = [];
  private hoveredElements = new Set<HTMLElement>();
  private containerElement: HTMLElement;
  private focusTimeout;

  constructor(termOccurrence, containerElement, term = null) {
    this.termOccurrence = termOccurrence;
    this.term = term;
    this.containerElement = containerElement;
  }

  public getTermState() {
    if (this.term === null) {
      return this.isDefinition()
        ? AnnotationTypeClass.PENDING_DEFINITION
        : AnnotationTypeClass.SUGGESTED_OCCURRENCE;
    }
    if (this.termOccurrence) {
      return this.isDefinition()
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
    return (
      occurrenceTypes.find((type) => type.value == className)?.name ||
      "Uknown annotation type"
    );
  }

  public focusAnnotation(focusTime = AnnotationFocusTime.SHORT) {
    if (!this.elements.length) {
      return;
    }
    this.elements.forEach((element) => {
      element.scrollIntoView({ block: "center", inline: "nearest" });
      element.classList.add("annotation-focused");
    });
    clearTimeout(this.focusTimeout);
    if (focusTime !== AnnotationFocusTime.INFINITE) {
      this.focusTimeout = setTimeout(this.unfocus.bind(this), focusTime);
    }
  }

  public unfocus() {
    clearTimeout(this.focusTimeout);
    this.elements.forEach((element) => {
      element.classList.remove("annotation-focused");
    });
  }

  public addElement(newElement: HTMLElement) {
    newElement.addEventListener("mouseover", (e) => {
      e.stopPropagation();
      this.hoveredElements.add(newElement);
      this.updateAppearance();
    });
    newElement.addEventListener("mouseout", (e) => {
      e.stopPropagation();
      this.hoveredElements.delete(newElement);
      this.updateAppearance();
    });
    this.elements.push(newElement);
  }

  public getElements() {
    return this.elements;
  }

  public assignTerm(term: Term) {
    this.term = term;
    this.termOccurrence.term = term;

    this.termOccurrence.types = this.termOccurrence.types.filter(
      (type) => type !== VocabularyUtils.SUGGESTED_TERM_OCCURRENCE
    );
    this.updateAppearance();
  }

  public async removeOccurrence() {
    await Promise.all(this.elements.map((element) => unmarkTerm(element)));
    this.updateRelatedAnnotationElements();
  }

  public updateAppearance() {
    const standardClassName = this.getClassName();
    const hoveredClassName = this.isHovered() ? " termit-h-hovered" : "";
    this.elements.forEach((element) => {
      const focusedClassName = element.classList.contains("annotation-focused")
        ? " annotation-focused"
        : "";
      element!.className =
        standardClassName + hoveredClassName + focusedClassName;
      Annotation.updateElementDepthPadding(element);
    });
  }

  public static updateElementDepthPadding(element) {
    const depth = Annotation.getElementDepth(element);
    element.style.padding = `${8 * depth}px`;
  }

  private isHovered() {
    return this.hoveredElements.size > 0;
  }

  public static getElementDepth(element: HTMLElement) {
    let depth = 0;
    let curreElement = element;
    while (curreElement.children.length) {
      depth += 1;
      curreElement = curreElement.children[0] as HTMLElement;
    }

    return depth;
  }

  public updateRelatedAnnotationElements() {
    Array.from(this.containerElement.querySelectorAll("termit-h")).forEach(
      (element) => {
        Annotation.updateElementDepthPadding(element);
      }
    );
  }

  public isDefinition() {
    return this.termOccurrence.types.includes(AnnotationType.DEFINITION);
  }
}
