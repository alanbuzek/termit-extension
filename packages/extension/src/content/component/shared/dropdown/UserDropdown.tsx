import React from 'react';
import useDropdown from './useDropdown';
import DropdownItem from './DropdownItem';
import DropdownContainer from './DropdownContainer';
import DropdownButton from './DropdownButton';
import { useI18n } from '../../../../termit-ui-common/component/hook/useI18n';

const UserDropdown = ({ isAnonymous }) => {
  const { dropdownRef, isOpen, handleMenuClick, handleItemClick } =
    useDropdown();
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

  if (!isAnonymous) {
    options.unshift({
      name: (<span>TermIt&nbsp;{i18n('extension.webapp')}</span>) as any,
      link: 'http://localhost:3000/#/',
    });
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
