import FiltersPanel from "./FiltersPanel";
import React from "react";
import TermOccurrencesList from "./TermOccurrencesList";
import { useState } from "react";

const TermOccurrencesFeed = ({ annotations }) => {
  const [occurrenceTypeFilter, setOccurrenceTypeFilter] = useState("");

  const filteredAnnotations = annotations.filter((annotation) => {
    return (
      !occurrenceTypeFilter ||
      annotation.getClassName() === occurrenceTypeFilter
    );
  });
  return (
    <div className='px-2.5'>
      <FiltersPanel
        occurrenceTypeFilter={occurrenceTypeFilter}
        setOccurrenceTypeFilter={setOccurrenceTypeFilter}
        annotationsCount={filteredAnnotations.length}
      />
      <hr className="my-2" />
      <TermOccurrencesList annotations={filteredAnnotations} />
    </div>
  );
};

export default TermOccurrencesFeed;
