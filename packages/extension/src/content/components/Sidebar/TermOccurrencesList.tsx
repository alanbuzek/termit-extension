import React from "react";
import TermLink from "../../../common/component/term/TermLink";
import { Annotation } from "../../../common/util/Annotation";

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

const TermOccurrencesList = ({ annotations }) => {
  return (
    <div className='px-2.5'>
      {(annotations as Annotation[]).map((annotation) => {
        return (
          <div
            className="rounded-md p-3 border border-gray-400 mb-2.5 cursor-pointer bg-white hover:bg-gray-300 relative"
            onClick={() => annotation.focusAnnotation()}
          >
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
