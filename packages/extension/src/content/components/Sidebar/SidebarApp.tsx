import { userInfo } from "os";
import React from "react";
import { useState } from "react";
import { ContentActions, ContentState } from "../..";
import { useI18n } from "../../../common/component/hook/useI18n";
import Vocabulary from "../../../common/model/Vocabulary";
import { Annotation } from "../../../common/util/Annotation";
import Spinner from "../Spinner";
import AllAnnotatedPagesSection from "./AllAnnotatedPages";
import ExtensionOffMessage from "./ExtensionOffMessage";
import SettingsSection from "./SettingsSection";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import SidebarOccurrencesContainer from "./SidebarOccurrencesContainer";
import UserPanel from "./UserPanel";

const SidebarApp = ({
  state,
  handleAnnotatePage,
  handleDeletePage,
  handleDeleteAnnotation,
  handleDeleteSuggestions,
}: {
  state: ContentState;
  handleAnnotatePage: (vocabulary: Vocabulary) => void;
  handleDeletePage: () => void;
  handleDeleteAnnotation: (annotation: Annotation) => void;
  handleDeleteSuggestions: () => void;
}) => {
  const [extensionActive, setExtensionActive] = useState(state.extensionActive);
  const [activeSection, setActiveSection] = useState(0);

  const handleExtensionActiveChange = async (newValue) => {
    setExtensionActive(newValue);
    await ContentActions.toggleExtensionActive();
  };

  const { i18n } = useI18n();

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 0:
        return (
          <SidebarOccurrencesContainer
            state={state}
            handleAnnotatePage={handleAnnotatePage}
            handleDeletePage={handleDeletePage}
            onDeleteAnnotation={handleDeleteAnnotation}
            handleDeleteSuggestions={handleDeleteSuggestions}
          />
        );

      case 1:
        return <AllAnnotatedPagesSection vocabularies={state.vocabularies} />;
      case 2:
        return <SettingsSection state={state} />;
    }
    return null;
  };

  return (
    <div
      style={{ height: "100%" }}
      className="border-l-2 border-gray-200 relative"
    >
      <div className="h-full w-full pt-2.5 flex flex-column bg-gray-100">
        <SidebarHeader
          hasAnnotations={!!state.annotations}
          user={state.user}
          extensionActive={extensionActive}
          setExtensionActive={handleExtensionActiveChange}
          globalLoading={state.globalLoading}
          isVocabPrompt={state.isVocabPrompt}
          instance={state.instance}
          handleLogin={() => {
            setActiveSection(2);
          }}
        />
        <UserPanel user={state.user} instance={state.instance} />
        <div
          className={`h-full bg-gray-50 ${
            activeSection !== 0 ? "overflow-y-auto mb-16 pb-4" : ""
          }`}
        >
          {state.globalLoading ? (
            <div className="flex flex-col mx-auto mt-6 justify-center items-center">
              <Spinner className="text-green-500" size="12" />
              <div className="mt-4 font-medium text-xl">
                {i18n("extension.loading")}
              </div>
              <div className="text-gray-500 mt-3 text-base text-center px-3">
                {i18n("extension.loading.message")}
              </div>
            </div>
          ) : (
            <>
              {!extensionActive && <ExtensionOffMessage />}
              {extensionActive ? renderCurrentSection() : null}
            </>
          )}
        </div>
        {extensionActive && !state.globalLoading && (
          <SidebarFooter
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isAnonymous={!state.user}
          />
        )}
      </div>
    </div>
  );
};

export default SidebarApp;
