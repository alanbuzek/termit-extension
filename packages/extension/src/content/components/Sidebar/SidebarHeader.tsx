import React from "react";
import { useI18n } from "../../../common/component/hook/useI18n";
import Button from "../Button";
import ExtensionActiveSwitch from "./ExtensionActiveSwitch";

const SidebarHeader = ({
  extensionActive,
  setExtensionActive,
  globalLoading,
  user,
  isVocabPrompt,
  instance,
}) => {
  const { i18n } = useI18n();

  return (
    <div className="flex justify-between items-center mt-2 px-3.5 pb-3 border-b border-gray-200">
      <span
        // href={`${instance.termitUi}/#/`}
        // target="_blank"
        className="ml-sm-3 ml-md-0 brand ml-2 p-0 navbar-brand text-base    "
      >
        TermIt Annotate
      </span>
      {user && !isVocabPrompt && (
        <ExtensionActiveSwitch
          isActive={extensionActive}
          setActive={setExtensionActive}
          loading={globalLoading}
        />
      )}
      {!user && (
        <div>
          <a
            href={`${instance.termitUi}/#/login`}
            target="_blank"
            className="mx-auto my-1"
          >
            <Button size="standard" color="secondary">
              {i18n("login.title")}
            </Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
