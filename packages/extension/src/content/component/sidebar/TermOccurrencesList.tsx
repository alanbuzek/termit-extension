import React, { useState } from 'react';

import { List, AutoSizer } from 'react-virtualized';
import { TrashIcon } from '../../../termit-ui-common/component/annotator/TermOccurrenceAnnotation';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';
import TermLink from '../../../termit-ui-common/component/term/TermLink';
import Annotation from '../../Annotation';
import Spinner from '../shared/Spinner';

export const ExternalLinkIcon = ({ className = 'h-3 w-3 ml-2' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
);

const lengthBasedTextStyle = (textLength) => {
  if (textLength <= 15) {
    return 'text-lg font-semibold';
  }

  if (textLength <= 25) {
    return 'text-base font-semibold';
  }

  if (textLength <= 35) {
    return 'text-sm font-semibold';
  }

  if (textLength <= 45) {
    return 'text-sm font-normal';
  }

  if (textLength <= 55) {
    return 'text-sm font-normal';
  }

  return 'text-xs font-normal';
};

const lengthBasedContainerStyles = (textLength) => {
  if (textLength <= 25) {
    return 'px-3 pb-2.5 pt-2';
  }

  return 'px-2 pb-1.5 pt-1.5';
};

const TermOccurrencesList = ({
  annotations,
  onDeleteAnnotation,
  isAnonymous,
}) => {
  const [deletingAnnotation, setDeletingAnnotation] = useState<Annotation>();
  const { i18n } = useI18n();

  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    style, // Style object to be applied to row (to position it)
  }) {
    const annotation = annotations[index];
    const textContent = annotation.termOccurrence.getTextContent();

    return (
      <div className="pb-0.5 pt-3 px-3" key={key} style={style}>
        <div
          className={`rounded-md h-full border border-gray-400 cursor-pointer transition-all duration-300 hover:bg-gray-100 relative bg-white term-occurrence-card ${lengthBasedContainerStyles(
            textContent.length
          )}`}
          onClick={() => annotation.focusAnnotation()}
        >
          <div className="flex justify-between items-center h-full">
            <div>
              <div
                className={`mb-0 ${lengthBasedTextStyle(textContent.length)}`}
              >
                {`${textContent.slice(0, 110)}${
                  textContent.length > 110 ? '...' : ''
                }`}
              </div>
              {annotation.term && (
                <div className="flex items-center mt-1.5">
                  <span className="font-semibold mr-2">
                    {i18n('type.term')}:
                  </span>
                  <TermLink term={annotation.term} />
                </div>
              )}
            </div>
            <div>
              <div
                className="hover:bg-red-200 bg-gray-100 border border-gray-300 rounded-md cursor-pointer transition-all duration-200 text-gray-500 hover:text-gray-600 px-2 py-1 ml-1 mt-2"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (deletingAnnotation) {
                    return;
                  }
                  setDeletingAnnotation(annotation);
                  await onDeleteAnnotation(annotation);
                  setDeletingAnnotation(undefined);
                }}
              >
                {deletingAnnotation === annotation ? (
                  <Spinner />
                ) : (
                  <TrashIcon />
                )}
              </div>
            </div>
          </div>
          <span
            className={`absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 md:px-2 md:py-2 text-xs font-medium leading-none text-gray-500 transform translate-x-2 -translate-y-1/2 rounded-md ${annotation.getClassName()}`}
          >
            {i18n(annotation.getTypeName())}
          </span>
        </div>
      </div>
    );
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          width={width}
          height={height - (isAnonymous ? 155 : 255)}
          rowCount={annotations.length}
          rowHeight={100}
          rowRenderer={rowRenderer}
        />
      )}
    </AutoSizer>
  );
};

export default TermOccurrencesList;
