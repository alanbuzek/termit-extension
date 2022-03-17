import classnames from "classnames";
import React from "react";
import { CreateTermFromAnnotation } from "../../common/component/annotator/CreateTermFromAnnotation";
import SelectionPurposeDialog from "../../common/component/annotator/SelectionPurposeDialog";
import TermDefinitionAnnotation from "../../common/component/annotator/TermDefinitionAnnotation";
import TermOccurrenceAnnotation from "../../common/component/annotator/TermOccurrenceAnnotation";
import HighlightedTextAdder from "./HighlightedTextAdder";
import { useState } from "react";
import { overlay } from "..";
import { getCssSelector } from "css-selector-generator";
import { useEffect } from "react";
import { markTerm } from "../marker";

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
export default function AdderToolbar({
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

  // Since the selection toolbar is only shown when there is a selection
  // of static text, we can use a plain key without any modifier as
  // the shortcut. This avoids conflicts with browser/OS shortcuts.
  const annotateShortcut = isVisible ? "a" : null;
  const highlightShortcut = isVisible ? "h" : null;
  const showShortcut = isVisible ? "s" : null;
  const hideShortcut = isVisible ? "Escape" : null;

  // Add a shortcut to close the adder. Note, there is no button associated with this
  // shortcut because any outside click will also hide the adder.
  // useShortcut(hideShortcut, () => onCommand('hide'));

  // nb. The adder is hidden using the `visibility` property rather than `display`
  // so that we can compute its size in order to position it before display.

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
      // markTerm()(newTerm);
      let parentElement = selectionRange.startContainer;
      if (parentElement) {
        const isTextNode = parentElement.nodeType === Node.TEXT_NODE;
        const selectedString = selectionRange.toString();
        let startOffsetIdx;
        if (isTextNode) {
          const nodeText = parentElement.wholeText;
          parentElement = parentElement.parentNode;
          startOffsetIdx = parentElement.textContent.indexOf(nodeText) + selectionRange.startOffset;
        } else {
          startOffsetIdx = selectionRange.startOffset;
        }
        const generatedCssSelector = getCssSelector(parentElement);
        const newTerm = { cssSelectors: [], termOccurrences: [] };
        const termOccurrence = {
          about: "_:bbc3-0",
          content: selectedString,
          originalTerm: selectedString,
          property: "ddo:je-výskytem-termu",
          resource: "",
          score: 1,
          startOffset: parentElement.textContent.slice(0, startOffsetIdx),
          typeof: "ddo:výskyt-termu",
        };
        newTerm.cssSelectors.push(generatedCssSelector);
        newTerm.termOccurrences.push(termOccurrence);
        console.log("new term: ", newTerm);
        markTerm(newTerm);
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
