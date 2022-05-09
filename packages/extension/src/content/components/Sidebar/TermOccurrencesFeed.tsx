import FiltersPanel from "./FiltersPanel";
import React from "react";
import TermOccurrencesList from "./TermOccurrencesList";
import { useState } from "react";
import { Annotation } from "../../../common/util/Annotation";
import { useI18n } from "../../../common/component/hook/useI18n";

const CancelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ArrowBack = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );
};

const language = "cs";

const TermOccurrencesFeed = ({
  annotations,
  onDeleteAnnotation,
  failedAnnotations,
  isAnonymous,
}: {
  onDeleteAnnotation: (annotation: Annotation) => Promise<void>;
  annotations: Annotation[];
  failedAnnotations: Annotation[];
  isAnonymous: boolean;
}) => {
  const [occurrenceTypeFilter, setOccurrenceTypeFilter] = useState<any>();
  const [occurrenceTextFilter, setOccurrenceTextFilter] = useState("");
  const [showFailedAnnotations, setShowFailedAnnotations] = useState(false);
  const [failedAnnotationsDismissed, setFailedAnnotationsDismissed] =
    useState(false);

  const hasFailedAnnotations = !!failedAnnotations.length;

  const showAnnotationsNotFoundSection =
    hasFailedAnnotations && showFailedAnnotations;
  const showAnnotationsNotFoundBanner =
    hasFailedAnnotations && !failedAnnotationsDismissed;

  const { i18n } = useI18n();

  const annotationsChecked = showAnnotationsNotFoundSection
    ? failedAnnotations
    : annotations;

  const filteredAnnotations = annotationsChecked.filter((annotation) => {
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
        ?.toLowerCase()
        .includes(occurrenceTextFilter.toLowerCase());

    return typeMatch && textMatch;
  });

  return (
    <div className="h-full">
      {showAnnotationsNotFoundBanner && (
        <div
          className={`px-3 py-1.5 text-gray-50 font-semibold text-base cursor-pointer flex justify-between items-center transition-all duration-300 hover:bg-red-500 bg-red-400`}
          onClick={() => setShowFailedAnnotations(!showFailedAnnotations)}
        >
          <div>
            {failedAnnotations.length} {i18n("extension.annotated.notfound")}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              if (showFailedAnnotations) {
                setShowFailedAnnotations(false);
              } else {
                setFailedAnnotationsDismissed(true);
              }
            }}
          >
            {showFailedAnnotations ? <ArrowBack /> : <CancelIcon />}
          </div>
        </div>
      )}
      <div className="flex text-lg px-2.5 py-2 my-2.5 font-semibold text-gray-700">
        {showAnnotationsNotFoundSection ? (
          <span className="text-red-600">
            {i18n("extension.notfound.annotations")}
          </span>
        ) : (
          i18n("extension.page.annotations")
        )}
      </div>
      <>
        <FiltersPanel
          occurrenceTypeFilter={occurrenceTypeFilter}
          setOccurrenceTypeFilter={setOccurrenceTypeFilter}
          annotationsCount={filteredAnnotations.length}
          occurrenceTextFilter={occurrenceTextFilter}
          setOccurrenceTextFilter={setOccurrenceTextFilter}
        />
        <TermOccurrencesList
          annotations={filteredAnnotations}
          onDeleteAnnotation={onDeleteAnnotation}
          isAnonymous={isAnonymous}
        />
      </>
    </div>
  );
};

export default TermOccurrencesFeed;
