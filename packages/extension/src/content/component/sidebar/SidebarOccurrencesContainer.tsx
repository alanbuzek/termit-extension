import React from 'react';
import SidebarControlPanel from './SidebarControlPanel';
import TermOccurrencesFeed from './TermOccurrencesFeed';

const SidebarOccurrencesContainer = ({
  state,
  handleAnnotatePage,
  handleDeletePage,
  onDeleteAnnotation,
  handleDeleteSuggestions,
}) => (
  <>
    <SidebarControlPanel
      isAnonymous={!state.user}
      annotations={state.annotations}
      handleAnnotatePage={handleAnnotatePage}
      vocabulary={state.vocabulary}
      vocabularies={state.vocabularies}
      handlePageDelete={handleDeletePage}
      handleDeleteSuggestions={handleDeleteSuggestions}
      isVocabPrompt={state.isVocabPrompt}
      instance={state.instance}
    />
    {state.annotations && !state.isVocabPrompt && (
      <TermOccurrencesFeed
        failedAnnotations={state.failedAnnotations}
        annotations={state.annotations}
        onDeleteAnnotation={onDeleteAnnotation}
        isAnonymous={!state.user}
      />
    )}
  </>
);

export default SidebarOccurrencesContainer;
