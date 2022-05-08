import React from "react";
import ExtensionActiveSwitch from "./ExtensionActiveSwitch";

const SidebarHeader = ({
  extensionActive,
  setExtensionActive,
  globalLoading,
  user,
  isVocabPrompt
}) => {
  return (
    <div className="flex justify-between items-center mt-2 px-3.5 pb-3 border-b border-gray-200">
      <a
        href={`http://localhost:3000/#/`}
        target="_blank"
        className="ml-sm-3 ml-md-0 brand ml-2 p-0 navbar-brand text-base    "
      >
        TermIt Annotate
      </a>
      {user && !isVocabPrompt && (
        <ExtensionActiveSwitch
          isActive={extensionActive}
          setActive={setExtensionActive}
          loading={globalLoading}
        />
      )}
    </div>
  );
};

export default SidebarHeader;
