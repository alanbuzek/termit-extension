import classnames from "classnames";
import React from "react";
import { CreateTermFromAnnotation } from "../../common/component/annotator/CreateTermFromAnnotation";
import TermDefinitionAnnotation from "../../common/component/annotator/TermDefinitionAnnotation";
import TermOccurrenceAnnotation from "../../common/component/annotator/TermOccurrenceAnnotation";
import HighlightedTextAdder from "./HighlightedTextAdder";
import { useState } from "react";
import { createTermOccurrence, markTerms } from "../marker";
import {
  Annotation,
  AnnotationClass,
  AnnotationOrigin,
  AnnotationType,
} from "../../common/util/Annotation";
import { overlay } from "../helper/overlay";
import { ContentState, globalActions } from "..";
import Term from "../../common/model/Term";
import VocabularyUtils, { IRI } from "../../common/util/VocabularyUtils";

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
}: ContentPopupProps) {
  const [currPopup, setCurrPopup] = useState(initialPopupType);
  const closePopup = () => {
    hide();
  };
  const vocabularyIri = VocabularyUtils.create(contentState.vocabulary!.iri);

  const renderContentPopup = () => {
    console.log("currPopup2: ", currPopup);
    switch (currPopup) {
      case PopupType.CreateTermModal:
        // 4. create term annotation
        return (
          <CreateTermFromAnnotation
            // TODO: do we need 'show' and other props?
            show
            onClose={() => {
              closePopup();
              overlay.off();
            }}
            onSave={() => {
              const newAnnotation = createTermOccurrence(
                selectionRange,
                AnnotationType.OCCURRENCE
              );
              if (newAnnotation) {
                markTerms(newAnnotation);
              }
              closePopup();
              overlay.off();
            }}
            // TODO: all this should either be deleted if not needed or use real, not hard-coded values
            onMinimize={() => 0}
            onTermCreated={() => 0}
            // TODO: handle fallback when no vocabulary is selected
            vocabularyIri={vocabularyIri}
            createTerm={(term: Term) => {
              return globalActions.createTerm(term, vocabularyIri, annotation);
            }}
            i18n={() => ""}
            formatMessag={() => Promise.resolve()}
            formatDate={() => ""}
            formatTime={() => ""}
            locale="cs-CZ"
            language={"cs"}
            contentState={contentState}
          />
        );
      case PopupType.PurposeSelection:
        return (
          <HighlightedTextAdder
            onMarkOccurrence={() => {
              globalActions.createNewUnknownOccurrence(selectionRange);
              setCurrPopup(PopupType.TermOccurrence);
            }}
            onMarkDefinition={() => {
              setCurrPopup(PopupType.TermDefinition);
            }}
          />
        );
      case PopupType.TermOccurrence:
        return (
          <TermOccurrenceAnnotation
            term={annotation?.term}
            score={`${annotation?.termOccurrence.score}`}
            text={
              annotation?.termOccurrence.content || selectionRange?.toString()
            }
            // TODO: tweak these defaults
            annotationClass={
              annotation?.getTermState() || AnnotationClass.SUGGESTED_OCCURRENCE
            }
            annotationOrigin={
              annotation?.getTermCreatorState() || AnnotationOrigin.PROPOSED
            }
            // TODO: do we need is open? or will that be fully managed by the above layer (more likely)
            isOpen={true}
            onRemove={() => {
              globalActions.removeTermOccurrence(annotation);
              hide();
            }}
            onSelectTerm={(term: Term) =>
              globalActions.assignTermToSuggestedOccurrence(term, annotation)
            }
            onCreateTerm={() => {
              showAt(0, 0, true);
              setCurrPopup(PopupType.CreateTermModal);
            }}
            onToggleDetailOpen={() => 0}
            onClose={closePopup}
            contentState={contentState}
          />
        );
      case PopupType.TermDefinition:
        return (
          <TermDefinitionAnnotation
            term={annotation?.term}
            text={
              annotation?.termOccurrence.content || selectionRange.toString()
            }
            isOpen={true}
            onRemove={closePopup}
            onSelectTerm={() => 0}
            onToggleDetailOpen={() => 0}
            onClose={closePopup}
            contentState={contentState}
          />
        );
      default:
        return null;
    }
  };

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
      style={
        currPopup === PopupType.CreateTermModal
          ? { width: 800, height: 800, overflowY: "scroll" }
          : null
      }
      // style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <div
        className="hyp-u-layout-row AdderToolbar__actions p-2"
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
