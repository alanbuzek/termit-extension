import React from "react";
import { Button } from "reactstrap";

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
  return (
    <div>
      <p className="font-semibold">You need to login start using TermIt.</p>
      <a
        href={`http://localhost:3000/#/login`}
        target="_blank"
        className="mx-auto block my-2"
      >
        <Button>Login</Button>
      </a>
      <p>After you do so, refresh this page to start annotating.</p>
      <p>
        Don't have an account?{" "}
        <a href={`http://localhost:3000/#/register`}>Register here</a>.
      </p>
    </div>
  );
};

const CogIcon = () => {
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
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
};

const MenuIcon = () => {
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

export const UserInfo = ({ user, loading }) => {
  return (
    <div className={`w-full text-base flex items-center justify-between`}>
      <a
        className="flex items-center text-gray-800 text-sm"
        href={`http://localhost:3000/#/profile`}
        target="_blank"
      >
        <UserIcon />{" "}
        <span className="ml-2 text-base">{user.abbreviatedName}</span>
      </a>
      {/* <CogIcon /> */}
      <MenuIcon />
    </div>
  );
};

const UserPanel = ({ loading = false, user }) => {
  return (
    <div className="flex px-3 pt-2 pb-3 items-center mt-2 border-b border-gray-200">
      {user ? <UserInfo user={user} loading={loading} /> : <LoginPrompt />}
    </div>
  );
};

export default UserPanel;
