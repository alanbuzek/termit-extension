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
  // TODO: replace these any s with real types
  arrowDirection: any;
  contentState: ContentState;
  isVisible: any;
  onCommand: any;
  initialPopupType: PopupType;
  showAt: any;
  hide: any;
  selectionRange: any;
  isMinimized: boolean;
  onSelectDefinition: any;
};

/**
 * @typedef AdderToolbarProps
 * @prop {'up'|'down'} arrowDirection -
 *   Whether the arrow pointing out of the toolbar towards the selected text
 *   should appear above the toolbar pointing Up or below the toolbar pointing
 *   Down.
 * @prop {boolean} isVisible - Whether to show the toolbar or not.
 * @prop {(c: Command) => any} onCommand - Called when a toolbar button is clicked.
 * @prop {number} [annotationCount] -
 *   Number of annotations associated with the selected text.
 *   If non-zero, a "Show" button is displayed to allow the user to see the
 *   annotations that correspond to the selection.
 */

/**
 * The toolbar that is displayed above selected text in the document providing
 * options to create annotations or highlights.
 *
 * @param {AdderToolbarProps} props
 */
function ContentPopup({
  arrowDirection,
  isVisible,
  onCommand,
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

  const renderContentPopup = () => {
    switch (currPopup) {
      case PopupType.CreateTermModal:
        // 4. create term annotation
        return (
          <CreateTermFromAnnotation
            onClose={() => {
              closePopup();
              overlay.off();
            }}
            onMinimize={() => {
              setIsMinimized(true);
              overlay.off();
              onSelectDefinition((definitionAnnotation: Annotation) => {
                overlay.on();
                console.log(
                  "in callback definitionAnnotation: ",
                  definitionAnnotation
                );
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
            // i18n={() => ""}
            // locale="cs-CZ"
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
          "AdderToolbar--down": arrowDirection === "up",
          "AdderToolbar--up": arrowDirection === "down",
          "is-active": isVisible,
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
