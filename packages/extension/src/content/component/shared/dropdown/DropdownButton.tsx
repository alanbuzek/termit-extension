/* eslint-disable react/require-default-props */
import React from 'react';
import { MenuIcon } from '../../sidebar/UserPanel';

const DropdownButton = ({
  handleMenuClick,
  icon,
}: {
  handleMenuClick: () => void;
  icon?: any;
}) => (
  <div>
    <button
      type="button"
      className="flex text-sm rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-500 p-1.5"
      id="user-menu"
      aria-expanded="false"
      aria-haspopup="true"
      onClick={handleMenuClick}
    >
      <span className="sr-only">Open dropdown</span>
      {icon || <MenuIcon />}
    </button>
  </div>
);

export default DropdownButton;
