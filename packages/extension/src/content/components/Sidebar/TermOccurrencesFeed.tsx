import FiltersPanel from "./FiltersPanel";
import React from "react";
import TermOccurrencesList from './TermOccurrencesList';

const TermOccurrencesFeed = ({
    annotations
}) => {
  return (
    <div>
      <FiltersPanel />
      <TermOccurrencesList annotations={annotations} />
    </div>
  );
};

export default TermOccurrencesFeed;
