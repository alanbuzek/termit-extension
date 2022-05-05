import React from "react";
import useDropdown from "./useDropdown";
import DropdownItem from "./DropdownItem";
import DropdownContainer from "./DropdownContainer";
import DropdownButton from "./DropdownButton";

const UserDropdown = () => {
  const { dropdownRef, isOpen, handleMenuClick, handleItemClick } =
    useDropdown();

  const options = [
    {
      name: <span>TermIt&nbsp;Web&nbsp;App</span>,
      link: "http://localhost:3000/#/",
    },
    {
      name: "Tutorial",
      link: "http://localhost:3000/#/tutorial-TODO",
    },
    {
      name: "About",
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
