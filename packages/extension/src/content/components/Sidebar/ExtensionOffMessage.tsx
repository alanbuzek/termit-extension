import React from "react";
import { useI18n } from '../../../common/component/hook/useI18n';

const ExtensionOffMessage = () => {
  const { i18n } = useI18n();

  return (
    <div className="mt-2 p-3 mb-4 flex flex-col items-center">
      <img
        src={chrome.runtime.getURL("/static/img/deactivated-small.png")}
        className="w-full p-4"
      />
      <p className="font-semibold text-lg mt-2">{i18n("extension.off.message")}</p>
      <p className='text-base font-normal text-gray-600 mt-1 text-center'>{i18n("extension.off.explanation")}</p>
    </div>
  );
};

export default ExtensionOffMessage;
