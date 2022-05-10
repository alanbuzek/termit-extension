import React from 'react';
import Spinner from '../shared/Spinner';

export const PencilIcon = ({ className = '', onClick = () => false }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    className={className || 'h-6 w-6'}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

export const AnnotationIcon = ({ className = '', onClick = () => false }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    className={className || 'h-6 w-6'}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
    />
  </svg>
);

const ArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={4}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={4}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

function ToolbarButton({
  buttonRef = null,
  expanded = false,
  className = 'Toolbar__button',
  label = '',
  onClick = () => false,
  selected = false,
  children,
}) {
  // eslint-disable-next-line no-return-assign
  return (
    <button
      className={className}
      aria-label={label}
      aria-expanded={expanded}
      aria-pressed={selected}
      onClick={onClick}
      // eslint-disable-next-line
      ref={(buttonRef = null)}
      title={label}
    >
      {children}
    </button>
  );
}

export default function Toolbar({
  isSidebarOpen,
  toggleSidebar,
  toggleSidebarRef,
  loading,
}) {
  return (
    <div className="Toolbar">
      <ToolbarButton
        className={`Toolbar__sidebar-toggle transition-all duration-300 ${
          !isSidebarOpen ? 'bg-green-500 text-white' : ''
        } text-lg font-semibold p-1`}
        buttonRef={toggleSidebarRef}
        label="Annotation sidebar"
        expanded={isSidebarOpen}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <ArrowRight /> : <ArrowLeft />}
      </ToolbarButton>
      {loading && !isSidebarOpen ? (
        <div className="Toolbar__buttonbar flex justify-center mt-1">
          <ToolbarButton onClick={toggleSidebar}>
            <Spinner className="text-green-500" size="6" />
          </ToolbarButton>
        </div>
      ) : null}
    </div>
  );
}
