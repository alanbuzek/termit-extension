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
    <div
      className="h-full w-full p-3 overflow-x-auto"
      style={{ background: "#dddddd" }}
    >
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
  );
};

export default SidebarApp;
