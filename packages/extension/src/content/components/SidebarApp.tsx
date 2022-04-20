import React from "react";
import { ContentState } from "..";
import TermLink from "../../common/component/term/TermLink";
import { TextQuoteSelector } from "../../common/model/TermOccurrence";
import Vocabulary from "../../common/model/Vocabulary";
import VocabularyUtils from "../../common/util/VocabularyUtils";
import PageSummary from "./PageSummery";

const SidebarApp = ({
  state,
  handleAnnotatePage,
}: {
  state: ContentState;
  handleAnnotatePage: (vocabulary: Vocabulary) => void;
}) => {
  if (!state.vocabularies) {
    return;
  }
  return (
    <div
      className="h-full w-full p-3 overflow-x-auto"
      style={{ background: "#dddddd" }}
    >
      <PageSummary
        annotations={state.annotations}
        handleAnnotatePage={handleAnnotatePage}
        vocabulary={state.vocabulary}
        vocabularies={state.vocabularies}
      />
      <hr className="my-2"></hr>
      {state.annotations?.map((annotation) => {
        return (
          <div
            className="shadow-md rounded-md p-3 border border-gray-400 mb-3 cursor-pointer bg-white hover:bg-gray-300 relative hover:shadow-none"
            onClick={() => annotation.focusAnnotation()}
          >
            <div className="mb-0 text-lg font-semibold">
              {
                (
                  annotation.termOccurrence?.target.selectors.find((selector) =>
                    selector.types.includes(VocabularyUtils.TEXT_QUOTE_SELECTOR)
                  ) as TextQuoteSelector
                ).exactMatch
              }
            </div>
            {annotation.term && (
              <div className="flex items-center mt-1.5">
                <span className="font-semibold mr-2">Term:</span>
                <TermLink term={annotation.term} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 ml-2"
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
              </div>
            )}
            <span
              className={`absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 md:px-2.5 md:py-2.5 text-xs font-medium leading-none text-gray-500 transform translate-x-2 -translate-y-1/2 rounded-md ${annotation.getClassName()}`}
            >
              {"Suggested Term"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarApp;
