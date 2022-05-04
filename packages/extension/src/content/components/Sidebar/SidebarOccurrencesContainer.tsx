import React from "react";
import { useState } from "react";
import SidebarControlPanel from "./SidebarControlPanel";
import TermOccurrencesFeed from "./TermOccurrencesFeed";

const SidebarOccurrencesContainer = ({
  state,
  handleAnnotatePage,
  handleDeletePage,
}) => {
  return (
    <>
      <SidebarControlPanel
        annotations={state.annotations}
        handleAnnotatePage={handleAnnotatePage}
        vocabulary={state.vocabulary}
        vocabularies={state.vocabularies}
        handlePageDelete={handleDeletePage}
      />
      {state.annotations && (
        <TermOccurrencesFeed annotations={state.annotations} />
      )}
      {state.annotations && <hr className="my-2"></hr>}
    </>
  );
};

export default SidebarOccurrencesContainer;
