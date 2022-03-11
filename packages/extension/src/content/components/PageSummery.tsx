import React from "react";
import { Spinner } from "reactstrap";
import Button from "./Button";
import Toggle from "react-toggle";

export const getUrlInfo = (url) => {
  const urlObject = new URL(url);

  const checkedHostname = urlObject.hostname.replace("www.", "");
  return { checkedHostname, urlObject };
};

const PageSummary = ({ annotations, annotatePage, flatTermOccs }) => {
  const loading = false;
  const disabled = false;

  const { checkedHostname } = getUrlInfo(window.location.href);
  const allowPannel = (
    <label className="flex justify-between rounded-lg p-3 items-center mb-4 bg-white">
      <div
        className={` text-base flex items-center ${
          loading && !disabled ? "text-gray-400" : "text-gray-800"
        }`}
      >
        Allow on {checkedHostname}{" "}
        {/* {loading && !disabled && <Spinner size="5" className="ml-3" />} */}
      </div>
      <Toggle
        disabled={loading}
        checked={!disabled}
        icons={false}
        onChange={() => {
          console.log("TODO");
        }}
      />
    </label>
  );

  if (!annotations) {
    return (
      <div className="p-3 mb-4 rounded-md bg-gray-100 border-gray-600 border">
        {allowPannel}
        <p>This page hasn't be annotated yet, you can do so now.</p>
        <Button onClick={annotatePage}>Annotate page</Button>
      </div>
    );
  }

  return (
    <div className="p-3 mb-4 rounded-md bg-gray-100 border-gray-600 border">
      {allowPannel}
      <h3>
        There are <span className="text-blue-600">{flatTermOccs.length}</span>{" "}
        term occurrences on this page
      </h3>
    </div>
  );
};

export default PageSummary;
