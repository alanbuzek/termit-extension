import React from 'react';
import constants from '../../../termit-ui-common/util/Constants';
import BrowserApi from '../../../shared/BrowserApi';
import LoginPromptPopup from '../shared/LoginPromptPopup';
import StorageUtils from '../../util/StorageUtils';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';

export default function SettingsSection({ state }) {
  const { i18n } = useI18n();
  return (
    <div style={{ width: 300 }} className="p-2">
      <div className="flex text-lg px-2.5 py-2 mt-2.5 font-semibold text-gray-700">
        {i18n('extension.settings')}
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
      <div className="flex mt-5  border-t py-3 px-2 border-gray-200">
        <div
          className=" text-gray-400 hover:text-red-700 text-sm cursor-pointer hover:underline"
          onClick={() => {
            StorageUtils.clearWholeStorage();
            // eslint-disable-next-line no-restricted-globals
            location.reload();
          }}
        >
          {i18n('extension.cleardata')}
        </div>
      </div>
    </div>
  );
}
