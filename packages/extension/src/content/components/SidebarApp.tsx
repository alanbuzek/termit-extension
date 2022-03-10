import React from "react";

const SidebarApp = ({ state }) => {
  console.log("passed down state: ", state);
  const flatTermOccs = state.annotations.flatMap(
    ({ termOccurrences, cssSelectors }) =>
      termOccurrences.map((termOcc) => ({ ...termOcc, cssSelectors }))
  );
  return (
    <div className="h-full w-full p-4" style={{ background: "#dddddd" }}>
      <h3 className="mb-4 mt-2">Hi over there</h3>
      {flatTermOccs.map((termOcc) => {
        return (
          <div className="shadow-md rounded-md p-4 border border-gray-400 bg-white mb-4">
            <h3>{termOcc.originalTerm}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarApp;
