import { userInfo } from "os";
import React from "react";
import { useState } from "react";
import { ContentState } from "../..";
import Vocabulary from "../../../common/model/Vocabulary";
import Button from "../Button";
import ExtensionOffMessage from './ExtensionOffMessage';
import LoginPrompt from "./LoginPrompt";
import SidebarControlPanel from "./SidebarControlPanel";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import TermOccurrencesFeed from "./TermOccurrencesFeed";
import UserPanel from "./UserPanel";

const SidebarApp = ({
  state,
  handleAnnotatePage,
  handleDeletePage,
}: {
  state: ContentState;
  handleAnnotatePage: (vocabulary: Vocabulary) => void;
  handleDeletePage: () => void;
}) => {
  const [extensionActive, setExtensionActive] = useState(true);

  const handleExtensionActiveChange = (newValue) => {
    console.log("new Value: ", newValue);
    setExtensionActive(newValue);
    if (newValue) {
      // TODO: activate
    } else {
      // TODO: deactivate
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <div
        className="h-full w-full py-2.5 overflow-x-auto flex flex-column bg-gray-50"
      >
        <SidebarHeader
          user={state.user}
          extensionActive={extensionActive}
          setExtensionActive={handleExtensionActiveChange}
        />
        <UserPanel user={state.user} />
        {!extensionActive && <ExtensionOffMessage />}
        {extensionActive && state.vocabularies.length ? (
          <>
            <SidebarControlPanel
              annotations={state.annotations}
              handleAnnotatePage={handleAnnotatePage}
              vocabulary={state.vocabulary}
              vocabularies={state.vocabularies}
              handlePageDelete={handleDeletePage}
            />
            {state.annotations && (
              <TermOccurrencesFeed annotations={state.annotations} />
            )}
            {state.annotations && <hr className="my-2"></hr>}
          </>
        ) : null}
        <SidebarFooter />
      </div>
    </div>
  );
};

export default SidebarApp;
