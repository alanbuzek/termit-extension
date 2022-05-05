import React from "react";
import SidebarControlPanel from "./SidebarControlPanel";
import TermOccurrencesFeed from "./TermOccurrencesFeed";

const SidebarOccurrencesContainer = ({
  state,
  handleAnnotatePage,
  handleDeletePage,
  onDeleteAnnotation,
  handleDeleteSuggestions
}) => {
  return (
    <>
      <SidebarControlPanel
        annotations={state.annotations}
        handleAnnotatePage={handleAnnotatePage}
        vocabulary={state.vocabulary}
        vocabularies={state.vocabularies}
        handlePageDelete={handleDeletePage}
        handleDeleteSuggestions={handleDeleteSuggestions}
      />
      {state.annotations && (
        <TermOccurrencesFeed
          failedAnnotations={state.failedAnnotations}
          annotations={state.annotations}
          onDeleteAnnotation={onDeleteAnnotation}
        />
      )}
      {state.annotations && <hr className="my-2"></hr>}
    </>
  );
};

export default SidebarOccurrencesContainer;
