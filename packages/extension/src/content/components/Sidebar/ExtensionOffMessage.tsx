import { Button } from "reactstrap";
import React from "react";

const ExtensionOffMessage = () => {
  return (
    <div className="mt-2 p-3 mb-4 flex flex-col items-center">
      {/* {allowPanel} */}
      <img
        src={chrome.runtime.getURL("/static/img/deactivated-small.png")}
        className="w-full p-4"
      />
      <p className="font-semibold text-lg mt-2">TermIt Extension is turned off.</p>
      <p className='text-base font-normal text-gray-600 mt-1 text-center'>Annotations won't work on any pages until you turn it on again.</p>
    </div>
  );
};

export default ExtensionOffMessage;
