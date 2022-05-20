import React, { MutableRefObject } from 'react';

interface Props {
  children: React.ReactNode;
  dropdownRef: MutableRefObject<any>;
  limitMaxHeight?: boolean;
}

const DropdownContainer = ({
  children,
  dropdownRef,
  limitMaxHeight = false,
}: Props) => (
  <div
    className={`origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white z-50 border-2 border-gray-300  ${
      limitMaxHeight
        ? 'max-h-96 overflow-y-auto overflow-x-hidden'
        : 'overflow-hidden'
    }`}
    role="menu"
    aria-orientation="vertical"
    aria-labelledby="user-menu"
    ref={dropdownRef}
  >
    {children}
  </div>
);

export default DropdownContainer;
