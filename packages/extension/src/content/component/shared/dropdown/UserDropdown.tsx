import React from 'react';
import useDropdown from './useDropdown';
import DropdownItem from './DropdownItem';
import DropdownContainer from './DropdownContainer';
import DropdownButton from './DropdownButton';
import { useI18n } from '../../../../termit-ui-common/component/hook/useI18n';
import StorageUtils from '../../../util/StorageUtils';

const UserDropdown = ({ isAnonymous, instance }) => {
  const { dropdownRef, isOpen, handleMenuClick, handleItemClick } = useDropdown(
    (id) => {
      if (id === 'logout') {
        StorageUtils.clearStorageOnLogout();
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      } else if (id === 'clear-data') {
        StorageUtils.clearWholeStorage();
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }
    }
  );
  const { i18n } = useI18n();

  const options = [
    {
      name: i18n('extension.tutorial'),
      link: chrome.runtime.getURL('tutorial.html'),
    },
    {
      name: i18n('extension.about'),
      link: 'https://kbss-cvut.github.io/termit-web/cs/about',
    },
  ];

  if (!isAnonymous && instance) {
    options.unshift({
      name: (<span>TermIt&nbsp;{i18n('extension.webapp')}</span>) as any,
      link: `${instance.termitUi}/#/`,
    });

    options.push({
      name: (<span>{i18n('main.logout')}</span>) as any,
      id: 'logout',
    } as any);
  }

  return (
    <>
      <DropdownButton handleMenuClick={handleMenuClick} />
      {isOpen && (
        <DropdownContainer dropdownRef={dropdownRef}>
          {options.map((option) => (
            <DropdownItem
              option={option as any}
              key={option.name}
              handleItemClick={handleItemClick}
            >
              {option.name}
            </DropdownItem>
          ))}
        </DropdownContainer>
      )}
    </>
  );
};

export default UserDropdown;
