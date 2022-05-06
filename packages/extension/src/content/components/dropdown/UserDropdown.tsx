import React from "react";
import useDropdown from "./useDropdown";
import DropdownItem from "./DropdownItem";
import DropdownContainer from "./DropdownContainer";
import DropdownButton from "./DropdownButton";
import { useI18n } from '../../../common/component/hook/useI18n';

const UserDropdown = () => {
  const { dropdownRef, isOpen, handleMenuClick, handleItemClick } =
    useDropdown();
  const { i18n } = useI18n();

  const options = [
    {
      name: <span>TermIt&nbsp;{i18n("extension.webapp")}</span>,
      link: "http://localhost:3000/#/",
    },
    {
      name: i18n("extension.tutorial"),
      link: "http://localhost:3000/#/tutorial-TODO",
    },
    {
      name: i18n("extension.about"),
      link: "https://kbss-cvut.github.io/termit-web/cs/about",
    },
  ];

  return (
    <>
      <DropdownButton handleMenuClick={handleMenuClick} />
      {isOpen && (
        <DropdownContainer dropdownRef={dropdownRef}>
          {options.map((option) => (
            <DropdownItem
              option={option}
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
