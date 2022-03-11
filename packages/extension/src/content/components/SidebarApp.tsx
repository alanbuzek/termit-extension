import React from "react";
import PageSummary from "./PageSummery";

const SidebarApp = ({ state, annotatePage }) => {
  console.log("passed down state: ", state);
  const flatTermOccs = (state.annotations || []).flatMap(
    ({ termOccurrences, cssSelectors }) =>
      termOccurrences.map((termOcc) => ({ ...termOcc, cssSelectors }))
  );
  return (
    <div className="h-full w-full p-3 overflow-x-auto" style={{ background: "#dddddd" }}>
      <PageSummary
        annotations={state.annotations}
        flatTermOccs={flatTermOccs}
        annotatePage={annotatePage}
      />
      {flatTermOccs.map((termOcc) => {
        return (
          <div className="shadow-md rounded-md p-3 border border-gray-400 mb-3 cursor-pointer bg-white hover:bg-gray-300">
            <div className="mb-0 text-lg font-semibold">{termOcc.originalTerm}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarApp;
