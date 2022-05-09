import Toggle from 'react-toggle';
import React from 'react';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';

const ExtensionActiveSwitch = ({ isActive, setActive, loading }) => {
  const { i18n } = useI18n();
  return (
    <label
      className="flex justify-center rounded-lg p-1 items-center mb-0"
      htmlFor="extensionActive"
    >
      <div
        className={`text-sm font-semibold flex items-center ${
          loading ? 'text-gray-400' : 'text-gray-700'
        }`}
      >
        {isActive ? i18n('extension.on') : i18n('extension.off')}
      </div>
      <Toggle
        name="burritoIsReady"
        value="extensionActive"
        icons={false}
        onChange={(e) => {
          setActive(e.target.checked);
        }}
        checked={isActive}
        className="ml-2.5"
        disabled={loading}
      />
    </label>
  );
};

export default ExtensionActiveSwitch;
