import React from "react";
import { ContentState } from "../..";
import Vocabulary from "../../../common/model/Vocabulary";
import SidebarControlPanel from "./SidebarControlPanel";
import TermOccurrencesFeed from "./TermOccurrencesFeed";

const SidebarApp = ({
  state,
  handleAnnotatePage,
  handleDeletePage,
}: {
  state: ContentState;
  handleAnnotatePage: (vocabulary: Vocabulary) => void;
  handleDeletePage: () => void;
}) => {
  if (!state.vocabularies) {
    return;
  }
  return (
    <div>
      <div
        className="h-full w-full p-3 overflow-x-auto"
        style={{ background: "#dddddd" }}
      >
        {state.user && (
          <div className="flex px-2 pb-2">
            <a
              className="flex ml-auto items-center text-gray-800"
              href={`http://localhost:3000/#/profile`}
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>{" "}
              <span className="ml-2 text-base">
                {state.user.abbreviatedName}
              </span>
            </a>
          </div>
        )}
        <SidebarControlPanel
          annotations={state.annotations}
          handleAnnotatePage={handleAnnotatePage}
          vocabulary={state.vocabulary}
          vocabularies={state.vocabularies}
          handlePageDelete={handleDeletePage}
        />
        <hr className="my-2"></hr>
        {state.annotations && (
          <TermOccurrencesFeed annotations={state.annotations} />
        )}
      </div>
    </div>
  );
};

export default SidebarApp;
