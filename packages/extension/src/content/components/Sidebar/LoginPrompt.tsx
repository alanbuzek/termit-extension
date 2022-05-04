import { Button } from "reactstrap";
import React from 'react';

const LoginPrompt = () => {
  return (
    <div className="mt-2 p-3 mb-4 rounded-md bg-gray-100 border-gray-600 border flex flex-col items-center">
      {/* {allowPanel} */}
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

export default LoginPrompt
