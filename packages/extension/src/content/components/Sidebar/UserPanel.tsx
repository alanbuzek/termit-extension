import React from "react";
import { FaUserAltSlash } from "react-icons/fa";
import { Button } from "reactstrap";
import { useI18n } from "../../../common/component/hook/useI18n";
import UserDropdown from "../dropdown/UserDropdown";

const UserIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
        clipRule="evenodd"
      />
    </svg>
  );
};

const LoginPrompt = () => {
  const { i18n } = useI18n();
  return (
    <div>
      <p className="font-normal">{i18n("extension.login.prompt")}</p>
      <a
        href={`http://localhost:3000/#/login`}
        target="_blank"
        className="mx-auto my-1"
      >
        <Button size="small">{i18n("login.title")}</Button>
      </a>
      <p>
        {i18n("extension.login.noaccount")}{" "}
        <a href={`http://localhost:3000/#/register`}>
          {i18n("extension.login.registerhere")}
        </a>
        .
      </p>
    </div>
  );
};

export const MenuIcon = () => {
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
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
};

export const UserInfo = ({ user }) => {
  const { i18n } = useI18n();

  return (
    <div className={`w-full text-base flex items-center justify-between`}>
      {user ? (
        <a
          className="flex items-center text-gray-800 text-sm"
          href={`http://localhost:3000/#/profile`}
          target="_blank"
        >
          <UserIcon />{" "}
          <span className="ml-2 text-base">{user.abbreviatedName}</span>
        </a>
      ) : (
        <div className="flex items-center text-gray-800 text-sm">
          <FaUserAltSlash />
          <span className="ml-2 text-base">
            {i18n("extension.user.anonymous")}
          </span>
        </div>
      )}
      <div className="relative">
        <UserDropdown />
      </div>
    </div>
  );
};

const UserPanel = ({ user, isVocabPrompt }) => {
  return (
    <div className="flex px-3 pt-2 pb-3 items-center mt-2 border-b border-gray-200">
      <UserInfo user={user} />
      {!user && !isVocabPrompt && <LoginPrompt />}
    </div>
  );
};

export default UserPanel;
