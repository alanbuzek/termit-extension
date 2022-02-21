import React from 'react';

// TODO: move this to @masterlingo/common package to be able to reuse in web + extension, not copy
// I'm not doing string interpolation so tailwind can purge the css
const sizes = {
  '2': 'h-2 w-2',
  '4': 'h-4 w-4',
  '5': 'h-5 w-6',
  '6': 'h-6 w-6',
  '8': 'h-8 w-8',
};

const Spinner: React.FC<{ size?: keyof typeof sizes; className?: string }> = ({
  size = '4',
  className,
}) => (
  <svg
    className={`animate-spin text-button ${sizes[size]} ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default Spinner;
