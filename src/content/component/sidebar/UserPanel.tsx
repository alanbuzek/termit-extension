import React from 'react';
import { FaUserAltSlash } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';
import UserDropdown from '../shared/dropdown/UserDropdown';

export const MenuIcon = () => (
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
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

export const UserInfo = ({ user, instance }) => {
  const { i18n } = useI18n();

  return (
    <div className="w-full text-base flex items-center justify-between">
      {user ? (
        <a
          className="flex items-center text-gray-800 text-sm"
          href={`${instance.termitUi}/#/profile`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-base">
            <HiUserCircle className="text-3xl" />
          </span>
          <span className="ml-2 text-base">{user.abbreviatedName}</span>
        </a>
      ) : (
        <div className="flex items-center text-gray-800 text-sm">
          <span className="text-base">
            <FaUserAltSlash className="text-3xl" />
          </span>
          <span className="ml-2 text-base">
            {i18n('extension.user.anonymous')}
          </span>
        </div>
      )}
      <div className="relative">
        <UserDropdown isAnonymous={!user} instance={instance} />
      </div>
    </div>
  );
};

const UserPanel = ({ user, instance }) => (
  <div className="flex px-3 pt-0 pb-1 items-center mt-1 border-b !border-gray-300">
    <UserInfo user={user} instance={instance} />
  </div>
);

export default UserPanel;
