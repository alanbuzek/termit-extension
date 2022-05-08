import React from "react";
import { useState } from "react";
import { ContentActions } from "..";
import { useI18n } from "../../common/component/hook/useI18n";
import Constants from "../../common/util/Constants";
import BrowserApi from "../../shared/BrowserApi";
import Button from "./Button";
import InstanceSelection from "./InstanceSelection";

export const openNewTabLink = (link) => {
  window.open(link, "_blank")?.focus();
};

export default function LoginPromptPopup() {
  const { i18n } = useI18n();
  const [step, setStep] = useState(0);
  const [instanceSelected, setInstanceSelected] = useState<any>();
  const [selectedAction, setSelectedAction] = useState("");

  const handleInstanceSelect = () => {
    openNewTabLink(`${instanceSelected.termitUi}/${selectedAction}`);
    ContentActions.handleInstanceSelected(instanceSelected);
    setStep(2);
  };

  const handleActionClicked = async (action) => {
    const currentInstance = await BrowserApi.storage.get(
      Constants.STORAGE.TERMIT_INSTANCE
    );
    setSelectedAction(action);

    // TODO: put back here
    // if (currentInstance) {
    //   setInstanceSelected(currentInstance);
    //   handleInstanceSelect();
    //   return;
    // }

    setStep(1);
  };

  if (step === 0) {
    return (
      <div style={{ width: 300 }} className="p-2">
        <h3 className="text-base text-gray-700 text-center">Login required</h3>
        <p className="font-normal mb-2 text-sm text-gray-700 text-center">
          {i18n("extension.login.prompt.long")}
        </p>
        {/* {i18n("extension.login.noaccount")}{" "}
        {i18n("extension.login.registerhere")} */}
        <div className="flex justify-center">
          <Button onClick={() => handleActionClicked("login")}>
            {i18n("login.title")}
          </Button>
          <Button
            onClick={() => handleActionClicked("register")}
            color="secondary"
            className="ml-3"
          >
            {i18n("login.register")}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div style={{ width: 300 }} className="p-2 flex flex-col items-center">
        <h3 className="text-base text-gray-700 text-center">
          Please select a TermIt instance to connect to
        </h3>
        <div className="m-3">
          <InstanceSelection
            instanceSelected={instanceSelected}
            setInstanceSelected={setInstanceSelected}
          />
        </div>
        <Button
          className="mt-2"
          disabled={!instanceSelected}
          onClick={handleInstanceSelect}
        >
          Confirm
        </Button>
      </div>
    );
  }

  return (
    <div style={{ width: 300 }} className="p-2">
      <h3 className="text-base text-gray-700 text-center">
        Come back after logging in!
      </h3>
      <p className="font-normal text-sm text-gray-800">
        A new tab with TermIt should automatically open to login or register.
        Once you do so, come back to this page, your account will be
        automatically synced!
      </p>
      <p className="font-normal mt-2 text-sm text-gray-600">
        No new tab open? Please{" "}
        <a
          href={`${instanceSelected.termitUi}/${selectedAction}`}
          target="_blank"
        >
          follow here.
        </a>
      </p>
    </div>
  );
}
