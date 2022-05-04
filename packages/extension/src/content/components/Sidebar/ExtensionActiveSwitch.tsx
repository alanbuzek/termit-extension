import Toggle from "react-toggle";
import React from "react";

const ExtensionActiveSwitch = ({ isActive, setActive }) => {
  const loading = false;
  const disabled = false;

  return (
    <label className="flex justify-center rounded-lg p-1 items-center mb-0">
      <div
        className={`text-sm font-semibold flex items-center ${
          loading && !disabled ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {isActive ? "On" : "Off"}
      </div>
      <Toggle
        // disabled={loading}
        name="burritoIsReady"
        value="yes"
        icons={false}
        onChange={(e) => {
          console.log("on change: ", e), setActive(e.target.checked);
        }}
        checked={isActive}
        className="ml-2.5"
      />
    </label>
  );
};

export default ExtensionActiveSwitch;
