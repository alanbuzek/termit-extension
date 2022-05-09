import React from 'react';

export interface dropdownOption {
  name: Element;
  link?: string;
  id: string;
}

interface Props {
  option: dropdownOption;
  handleItemClick: any;
  children: React.ReactNode;
}

const DropdownItem = ({ option, handleItemClick, children }: Props) => (
  <button
    className="whitespace-nowrap block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full border-b border-gray-300"
    role="menuitem"
    onClick={(e) => handleItemClick(e, option)}
  >
    {children}
  </button>
);

export default DropdownItem;
