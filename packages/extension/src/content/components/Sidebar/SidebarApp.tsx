import { userInfo } from "os";
import React from "react";
import { useState } from "react";
import { ContentActions, ContentState } from "../..";
import Vocabulary from "../../../common/model/Vocabulary";
import { Annotation } from "../../../common/util/Annotation";
import Spinner from "../Spinner";
import ExtensionOffMessage from "./ExtensionOffMessage";
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

  const handleExtensionActiveChange = async (newValue) => {
    setExtensionActive(newValue);
    await ContentActions.toggleExtensionActive();
  };

  return (
    <div style={{ height: "100%" }} className="border-l-2 border-gray-200">
      <div className="h-full w-full py-2.5 overflow-x-auto flex flex-column bg-gray-50">
        <SidebarHeader
          user={state.user}
          extensionActive={extensionActive}
          setExtensionActive={handleExtensionActiveChange}
          globalLoading={state.globalLoading}
        />
        <UserPanel user={state.user} />
        {state.globalLoading ? (
          <div className="flex flex-col mx-auto mt-6 justify-center items-center">
            <Spinner className="text-green-500" size="12" />
            <div className="mt-4 font-medium text-xl">Loading...</div>
            <div className="text-gray-500 mt-3 text-base text-center px-3">
              This operation may take a moment, depending on how many
              annotations there are on the page.
            </div>
          </div>
        ) : (
          <>
            {!extensionActive && <ExtensionOffMessage />}
            {extensionActive && state.vocabularies?.length ? (
              <SidebarOccurrencesContainer
                state={state}
                handleAnnotatePage={handleAnnotatePage}
                handleDeletePage={handleDeletePage}
                onDeleteAnnotation={handleDeleteAnnotation}
                handleDeleteSuggestions={handleDeleteSuggestions}
              />
            ) : null}
          </>
        )}

        <SidebarFooter />
      </div>
    </div>
  );
};

export default SidebarApp;
