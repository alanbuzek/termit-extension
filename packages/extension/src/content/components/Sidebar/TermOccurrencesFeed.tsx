import FiltersPanel from "./FiltersPanel";
import React from "react";
import TermOccurrencesList from "./TermOccurrencesList";
import { useState } from "react";
import { Annotation } from "../../../common/util/Annotation";

// TODO
const language = "cs";

const TermOccurrencesFeed = ({
  annotations,
  onDeleteAnnotation,
}: {
  onDeleteAnnotation: (annotation: Annotation) => Promise<void>;
  annotations: Annotation[];
}) => {
  const [occurrenceTypeFilter, setOccurrenceTypeFilter] = useState<any>();
  const [occurrenceTextFilter, setOccurrenceTextFilter] = useState("");

  const filteredAnnotations = annotations.filter((annotation) => {
    const typeMatch =
      !occurrenceTypeFilter ||
      annotation.getClassName() === occurrenceTypeFilter.value;
    const textMatch =
      !occurrenceTextFilter ||
      annotation.termOccurrence
        .getSanitizedExactMatch()
        .toLowerCase()
        .includes(occurrenceTextFilter.toLowerCase()) ||
      annotation.term?.label[language]
        .toLowerCase()
        .includes(occurrenceTextFilter.toLowerCase());

    return typeMatch && textMatch;
  });

  return (
    <div className="">
      <div className="flex text-base px-2.5 py-2 mt-2 mb-1 font-semibold text-gray-700">
        Page annotations:
        {/* <div style={{ flex: 1}} className="">

        </div> */}
      </div>
      <FiltersPanel
        occurrenceTypeFilter={occurrenceTypeFilter}
        setOccurrenceTypeFilter={setOccurrenceTypeFilter}
        annotationsCount={filteredAnnotations.length}
        occurrenceTextFilter={occurrenceTextFilter}
        setOccurrenceTextFilter={setOccurrenceTextFilter}
      />
      <hr className="my-2" />
      <TermOccurrencesList
        annotations={filteredAnnotations}
        onDeleteAnnotation={onDeleteAnnotation}
      />
    </div>
  );
};

export default TermOccurrencesFeed;
