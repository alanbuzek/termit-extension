import React from "react";
import { useState } from "react";
import { TrashIcon } from "../../../common/component/annotator/TermOccurrenceAnnotation";
import { useI18n } from "../../../common/component/hook/useI18n";
import TermLink from "../../../common/component/term/TermLink";
import { Annotation } from "../../../common/util/Annotation";
import Spinner from "../Spinner";
import { List } from "react-virtualized";

export const ExternalLinkIcon = ({ className = "h-3 w-3 ml-2" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      color="#29ab87"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
};

const TermOccurrencesList = ({ annotations, onDeleteAnnotation }) => {
  const [deletingAnnotation, setDeletingAnnotation] = useState<Annotation>();
  const { i18n } = useI18n();

  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) {
    const annotation = annotations[index];
    return (
      <div
        key={key}
        style={style}
        className="rounded-md p-3 border border-gray-400 cursor-pointer transition-all duration-300 hover:bg-gray-100 relative bg-white term-occurrence-card"
        onClick={() => annotation.focusAnnotation()}
      >
        <div className="flex justify-between items-end">
          <div>
            <div className="mb-0 text-lg font-semibold">
              {annotation.termOccurrence.getTextContent()}
            </div>
            {annotation.term && (
              <div className="flex items-center mt-1.5">
                <span className="font-semibold mr-2">{i18n("type.term")}:</span>
                <TermLink term={annotation.term} />
              </div>
            )}
          </div>
          <div>
            <div
              className="hover:bg-red-200 bg-gray-100 border border-gray-300 rounded-md cursor-pointer transition-all duration-200 text-gray-500 hover:text-gray-600 px-2 py-1 ml-3 mt-2"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (deletingAnnotation) {
                  return;
                }
                setDeletingAnnotation(annotation);
                await onDeleteAnnotation(annotation);
                setDeletingAnnotation(undefined);
              }}
            >
              {deletingAnnotation === annotation ? <Spinner /> : <TrashIcon />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2.5">
      <List
        width={348}
        height={482}
        rowCount={annotations.length}
        rowHeight={72}
        rowRenderer={rowRenderer}
      />
    </div>
  );
};

export default TermOccurrencesList;
