import classnames from "classnames";
import React from "react";
import { CreateTermFromAnnotation } from "../../common/component/annotator/CreateTermFromAnnotation";
import TermDefinitionAnnotation from "../../common/component/annotator/TermDefinitionAnnotation";
import TermOccurrenceAnnotation from "../../common/component/annotator/TermOccurrenceAnnotation";
import HighlightedTextAdder from "./HighlightedTextAdder";
import { useState } from "react";
import {
  Annotation,
  AnnotationTypeClass,
  AnnotationOriginClass,
  AnnotationType,
} from "../../common/util/Annotation";
import { overlay } from "../helper/overlay";
import { ContentState, ContentActions } from "..";
import Term from "../../common/model/Term";
import VocabularyUtils from "../../common/util/VocabularyUtils";
import { useI18n } from "../../common/component/hook/useI18n";

/**
 * Union of possible toolbar commands.
 *
 * @typedef {'annotate'|'highlight'|'show'|'hide'} Command
 */

export enum PopupType {
  CreateTermModal,
  TermDefinition,
  TermOccurrence,
  PurposeSelection,
}

type ContentPopupProps = {
  annotation: Annotation;
  contentState: ContentState;
  isVisible: boolean;
  initialPopupType: PopupType;
  showAt: (x: number, y: number, isModal: boolean) => void;
  hide: any;
  selectionRange: any;
  isMinimized: boolean;
  onSelectDefinition: any;
  repositionWithAnnotation: (Annotation) => void;
};

function ContentPopup({
  initialPopupType,
  showAt,
  hide,
  selectionRange,
  annotation,
  contentState,
  onSelectDefinition,
  repositionWithAnnotation,
}: ContentPopupProps) {
  const [currPopup, setCurrPopup] = useState(initialPopupType);
  const [isMinimized, setIsMinimized] = useState(false);
  const [definitionAnnotation, setDefinitionAnnotation] =
    useState<Annotation>();
  const closePopup = () => {
    hide();
  };
  const vocabularyIri = VocabularyUtils.create(contentState.vocabulary!.iri);
  const { i18n, intl } = useI18n();

  const renderContentPopup = () => {
    switch (currPopup) {
      case PopupType.CreateTermModal:
        // 4. create term annotation
        return (
          <CreateTermFromAnnotation
            intl={intl}
            i18n={i18n}
            onClose={() => {
              closePopup();
              overlay.off();
            }}
            onMinimize={() => {
              setIsMinimized(true);
              overlay.off();
              onSelectDefinition((definitionAnnotation: Annotation) => {
                overlay.on();
                setIsMinimized(false);
                setDefinitionAnnotation(definitionAnnotation);
              });
            }}
            // TODO: handle fallback when no vocabulary is selected
            vocabularyIri={vocabularyIri}
            createTerm={(term: Term) => {
              overlay.off();
              return ContentActions.createTerm(
                term,
                vocabularyIri,
                annotation,
                definitionAnnotation
              );
            }}
            language={"cs"}
            contentState={contentState}
            definitionAnnotation={definitionAnnotation}
            termOccurrence={annotation.termOccurrence}
          />
        );
      case PopupType.PurposeSelection:
        return (
          <HighlightedTextAdder
            onMarkOccurrence={async () => {
              const annotation =
                await ContentActions.createUnknownOccurrenceFromRange(
                  selectionRange,
                  AnnotationType.OCCURRENCE
                );
              repositionWithAnnotation(annotation);
              setCurrPopup(PopupType.TermOccurrence);
            }}
            onMarkDefinition={async () => {
              const annotation =
                await ContentActions.createUnknownOccurrenceFromRange(
                  selectionRange,
                  AnnotationType.DEFINITION
                );

              repositionWithAnnotation(annotation);

              setCurrPopup(PopupType.TermDefinition);
            }}
          />
        );
      case PopupType.TermOccurrence:
        return (
          <TermOccurrenceAnnotation
            term={annotation?.term}
            annotationClass={
              annotation?.getTermState() ||
              AnnotationTypeClass.SUGGESTED_OCCURRENCE
            }
            annotationOrigin={
              annotation?.getTermCreatorState() ||
              AnnotationOriginClass.PROPOSED
            }
            onRemove={() => {
              closePopup();
              return ContentActions.removeOccurrence(annotation);
            }}
            onSelectTerm={(term: Term) =>
              ContentActions.assignTermToOccurrence(
                term,
                annotation,
                AnnotationType.OCCURRENCE
              )
            }
            onCreateTerm={() => {
              showAt(0, 0, true);
              setCurrPopup(PopupType.CreateTermModal);
            }}
            onClose={closePopup}
            contentState={contentState}
          />
        );
      case PopupType.TermDefinition:
        return (
          <TermDefinitionAnnotation
            term={annotation?.term}
            text={
              annotation?.termOccurrence?.getTextContent() ||
              selectionRange.toString()
            }
            onRemove={() => {
              closePopup();
              return ContentActions.removeOccurrence(annotation);
            }}
            onSelectTerm={(term: Term) => {
              return ContentActions.assignTermToOccurrence(
                term,
                annotation,
                AnnotationType.DEFINITION
              );
            }}
            onClose={closePopup}
            contentState={contentState}
          />
        );
      default:
        return null;
    }
  };

  let style: any = {
    visibility: isMinimized ? "hidden" : "visible",
  };

  if (currPopup === PopupType.CreateTermModal) {
    style = { ...style, width: 700, height: 500, overflowY: "scroll" };
  }

  return (
    <div
      className={classnames(
        "hyp-u-border hyp-u-bg-color--white",
        "AdderToolbar",
        {
          "AdderToolbar--up": true,
          "is-active": true,
        }
      )}
      style={style}
    >
      <div
        className="hyp-u-layout-row AdderToolbar__actions"
        style={{ width: "100%" }}
      >
        {renderContentPopup()}
      </div>
    </div>
  );
}

// this ensures the wrapped component is mounted anew and no previous state is preserved, when calling hide() and show() in ContentPopupContainer
function isVisibleWrapper(WrappedComponent) {
  return ({ isVisible, ...props }) => {
    if (!isVisible) {
      return null;
    }

    return <WrappedComponent isVisible={true} {...props} />;
  };
}

export default isVisibleWrapper(ContentPopup);
