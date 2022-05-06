import React from "react";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { TrashIcon } from "../../../common/component/annotator/TermOccurrenceAnnotation";
import BadgeButton from "../../../common/component/misc/BadgeButton";
import TermLink from "../../../common/component/term/TermLink";
import { Annotation } from "../../../common/util/Annotation";
import Spinner from "../Spinner";

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

  return (
    <div className="px-2.5">
      {(annotations as Annotation[]).map((annotation) => {
        return (
          <div
            className="rounded-md p-3 border border-gray-400 mb-2.5 cursor-pointer transition-all duration-300 hover:bg-gray-100 relative bg-white term-occurrence-card"
            onClick={() => annotation.focusAnnotation()}
          >
            <div className="flex justify-between items-end">
              <div>
                <div className="mb-0 text-lg font-semibold">
                  {annotation.termOccurrence.getTextContent()}
                </div>
                {annotation.term && (
                  <div className="flex items-center mt-1.5">
                    <span className="font-semibold mr-2">Term:</span>
                    <TermLink term={annotation.term} />
                    {/* <ExternalLinkIcon /> */}
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
                  {deletingAnnotation === annotation ? (
                    <Spinner />
                  ) : (
                    <TrashIcon />
                  )}
                </div>
              </div>
            </div>

            <span
              className={`absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 md:px-2 md:py-2 text-xs font-medium leading-none text-gray-500 transform translate-x-2 -translate-y-1/2 rounded-md ${annotation.getClassName()}`}
            >
              {annotation.getTypeName()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TermOccurrencesList;
