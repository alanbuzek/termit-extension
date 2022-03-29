import classnames from "classnames";
import React from "react";
import { CreateTermFromAnnotation } from "../../common/component/annotator/CreateTermFromAnnotation";
import TermDefinitionAnnotation from "../../common/component/annotator/TermDefinitionAnnotation";
import TermOccurrenceAnnotation from "../../common/component/annotator/TermOccurrenceAnnotation";
import HighlightedTextAdder from "./HighlightedTextAdder";
import { useState } from "react";
import { useEffect } from "react";
import { createAnnotation, markTerms } from "../marker";
import { AnnotationType } from "../../common/util/Annotation";
import { overlay } from '../helper/overlay';

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
export default function ContentPopup({
  arrowDirection,
  isVisible,
  onCommand,
  annotationCount = 0,
  initialPopupType = PopupType.PurposeSelection,
  showAt,
  hide,
  selectionRange,
}) {
  const [currPopup, setCurrPopup] = useState(initialPopupType);

  const closePopup = () => {
    setCurrPopup(PopupType.PurposeSelection);
    hide();
  };

  const [newTerm, setNewTerm] = useState(null);
  useEffect(() => {
    if (!window.getSelection()?.toString() || newTerm) {
      return;
    }

    let newTermTemplate = {
      cssSelectors: [],
      termOccurrences: [],
    };
  });

  const mockCreateTermAnnotationProps = {
    show: true,
    onClose() {
      closePopup();
      overlay.off();
    },
    onSave() {
      // markTerms()(newTerm);
      const newAnnotation = createAnnotation(
        selectionRange,
        AnnotationType.OCCURRENCE
      );
      if (newAnnotation) {
        markTerms(newAnnotation);
      }
      closePopup();
      overlay.off();
    },
    onMinimize: () => 0,
    onTermCreated: () => 0,
    vocabularyIri: {
      fragment: "slovnik-document-376-2014",
      namespace: "http://onto.fel.cvut.cz/ontologies/slovnik/",
    },
    language: "cs",
    createTerm: () => 0,
    i18n: () => 0,
    formatMessage: () => 0,
    formatDate: () => 0,
    formatTime: () => 0,
    locale: "cs-CZ",
  };

  const renderContentPopup = () => {
    const mockTermOccurrenceAnnotationProps = {
      target: "id4540-5",
      term: null,
      score: "1.0",
      text: "Obec",
      annotationClass: "suggested-term-occurrence",
      annotationOrigin: "proposed-occurrence",
      isOpen: true,
      onRemove: closePopup,
      onSelectTerm: () => 0,
      onCreateTerm: () => {
        showAt(0, 0, true);
        setCurrPopup(PopupType.CreateTermModal);
      },
      onToggleDetailOpen: () => 0,
      onClose: closePopup,
    };
    const termDefinitionMockProps = {
      target: "idphu3n",
      term: null,
      text: "Drnholec",
      isOpen: true,
      onRemove: closePopup,
      onSelectTerm: () => 0,
      onToggleDetailOpen: () => 0,
      onClose: closePopup,
    };

    switch (currPopup) {
      case PopupType.CreateTermModal:
        // 4. create term annotation
        return <CreateTermFromAnnotation {...mockCreateTermAnnotationProps} />;
      case PopupType.PurposeSelection:
        // 4. create term annotation
        return (
          // <SelectionPurposeDialog
          //   show
          //   onCreateTerm={() => 0}
          //   onMarkOccurrence={() => setCurrPopup(PopupType.TermOccurrence)}
          //   onMarkDefinition={() => setCurrPopup(PopupType.TermDefinition)}
          //   onCancel={closePopup}
          // />
          <HighlightedTextAdder
            onMarkOccurrence={() => {
              setCurrPopup(PopupType.TermOccurrence);
            }}
            onMarkDefinition={() => {
              setCurrPopup(PopupType.TermDefinition);
            }}
          />
        );
      case PopupType.TermOccurrence:
        return (
          <TermOccurrenceAnnotation {...mockTermOccurrenceAnnotationProps} />
        );
      case PopupType.TermDefinition:
        return <TermDefinitionAnnotation {...termDefinitionMockProps} />;
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
