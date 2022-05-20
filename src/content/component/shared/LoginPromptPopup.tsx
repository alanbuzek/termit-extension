import React, { useState } from 'react';

import { AnnotatorActions } from '../../AnnotatorController';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';
import Constants from '../../../termit-ui-common/util/Constants';
import BrowserApi from '../../../shared/BrowserApi';
import Button from './Button';
import InstanceSelection from './InstanceSelection';

export const openNewTabLink = (link) => {
  window.open(link, '_blank')?.focus();
};

export default function LoginPromptPopup({
  initialStep = 0,
  initialAction = 'login',
  initialInstance = null,
  onInstanceSelectedHandler,
}: {
  initialStep?: number;
  initialAction?: string;
  initialInstance?: any;
  onInstanceSelectedHandler?: (link: string, instanceSelected: any) => void;
}) {
  const { i18n } = useI18n();
  const [step, setStep] = useState(initialStep);
  const [instanceSelected, setInstanceSelected] =
    useState<any>(initialInstance);
  const [selectedAction, setSelectedAction] = useState(initialAction);

  const handleInstanceSelect = () => {
    const link = `${instanceSelected.termitUi}/#/${selectedAction}`;
    if (onInstanceSelectedHandler) {
      onInstanceSelectedHandler(link, instanceSelected);
    } else {
      // default handler
      openNewTabLink(link);
      AnnotatorActions.handleInstanceSelected(instanceSelected);
      setStep(2);
    }
  };

  const handleActionClicked = async (action) => {
    const currentInstance = await BrowserApi.storage.get(
      Constants.STORAGE.TERMIT_INSTANCE
    );
    setSelectedAction(action);

    // we already have an instance -> no need to prompt
    if (currentInstance) {
      setInstanceSelected(currentInstance);
      const link = `${currentInstance.termitUi}/#/${selectedAction}`;
      if (onInstanceSelectedHandler) {
        onInstanceSelectedHandler(link, currentInstance);
      } else {
        // default handler
        openNewTabLink(link);
        AnnotatorActions.handleInstanceSelected(currentInstance);
        setStep(2);
      }
      return;
    }

    setStep(1);
  };

  if (step === 0) {
    return (
      <div style={{ width: 300 }} className="p-2">
        <h3 className="text-base text-gray-700 text-center">
          {i18n('extension.login.required')}
        </h3>
        <p className="font-normal mb-2 text-sm text-gray-700 text-center">
          {i18n('extension.login.prompt.long')}
        </p>
        <div className="flex justify-center">
          <Button onClick={() => handleActionClicked('login')}>
            {i18n('login.title')}
          </Button>
          <Button
            onClick={() => handleActionClicked('register')}
            color="secondary"
            className="ml-3"
          >
            {i18n('login.register')}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div style={{ width: 300 }} className="p-2 flex flex-col items-start">
        <h3 className="text-base text-gray-700 text-left">
          {i18n('extension.instance.prompt')}
        </h3>
        <div className="my-3 w-full">
          <InstanceSelection
            instanceSelected={instanceSelected}
            setInstanceSelected={setInstanceSelected}
          />
        </div>
        <Button
          className="mt-2"
          disabled={!instanceSelected || initialInstance === instanceSelected}
          onClick={handleInstanceSelect}
          size="standard"
        >
          {i18n('extension.instance.confirm')}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ width: 300 }} className="p-2">
      <h3 className="text-base text-gray-700 text-center">
        {i18n('extension.login.after')}
      </h3>
      <p className="font-normal text-sm text-gray-800" />
      <p className="font-normal mt-2 text-sm text-gray-600">
        {i18n('extension.login.notab')}{' '}
        <a
          href={`${instanceSelected.termitUi}/#/${selectedAction}`}
          target="_blank"
          rel="noreferrer"
        >
          {i18n('extension.login.notab.link')}
        </a>
      </p>
    </div>
  );
}
