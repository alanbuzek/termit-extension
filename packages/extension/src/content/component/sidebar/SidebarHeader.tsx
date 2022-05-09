import React from 'react';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';
import Button from '../shared/Button';
import ExtensionActiveSwitch from './ExtensionActiveSwitch';

const SidebarHeader = ({
  extensionActive,
  setExtensionActive,
  globalLoading,
  user,
  isVocabPrompt,
  instance,
  handleLogin,
  hasAnnotations,
}) => {
  const { i18n } = useI18n();

  return (
    <div className="flex justify-between items-center mt-2 px-3.5 pb-3 border-b border-gray-300">
      <span className="ml-sm-3 ml-md-0 brand ml-2 p-0 text-green-500 text-base">
        TermIt Annotate
      </span>
      {user && !isVocabPrompt && (
        <ExtensionActiveSwitch
          isActive={extensionActive}
          setActive={setExtensionActive}
          loading={globalLoading}
        />
      )}
      {!user && !hasAnnotations && (
        <div>
          {instance ? (
            <a href={`${instance.termitUi}/#/login`} className="mx-auto my-1">
              <Button size="standard" color="secondary">
                {i18n('login.title')}
              </Button>
            </a>
          ) : (
            <Button size="standard" color="secondary" onClick={handleLogin}>
              {i18n('login.title')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
