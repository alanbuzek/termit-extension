import React from 'react';
import constants from '../../../termit-ui-common/util/Constants';
import BrowserApi from '../../../shared/BrowserApi';
import LoginPromptPopup from '../shared/LoginPromptPopup';
import StorageUtils from '../../util/StorageUtils';

export default function SettingsSection({ state }) {
  return (
    <div style={{ width: 300 }} className="p-2">
      <div className="flex text-lg px-2.5 py-2 mt-2.5 font-semibold text-gray-700">
        Extension settings
      </div>
      <LoginPromptPopup
        initialAction="login"
        initialStep={1}
        initialInstance={state.instance}
        onInstanceSelectedHandler={async (link, instance) => {
          await StorageUtils.clearWholeStorage();
          await BrowserApi.storage.set(
            constants.STORAGE.TERMIT_INSTANCE,
            instance
          );
          window.open(link, '_top');
        }}
      />
    </div>
  );
}
