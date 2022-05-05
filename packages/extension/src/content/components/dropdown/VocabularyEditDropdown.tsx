import React from "react";
import useDropdown from "./useDropdown";
import DropdownItem from "./DropdownItem";
import DropdownContainer from "./DropdownContainer";
import DropdownButton from "./DropdownButton";
import { GoPencil } from "react-icons/go";

const VocabularyEditDropdown = ({
  handleDeleteSuggestedAnnotations,
  handleDeleteAllAnnotations,
}) => {
  const { dropdownRef, isOpen, handleMenuClick, handleItemClick } = useDropdown(
    (id) => {
      if (id === "delete-suggestions") {
        handleDeleteSuggestedAnnotations();
      } else if (id === "delete-all") {
        handleDeleteAllAnnotations();
      } else {
        throw new Error("Uknown action!");
      }
    }
  );

  const options = [
    {
      name: <span className="text-red-600">Delete&nbsp;suggestions</span>,
      id: "delete-suggestions",
    },
    {
      name: (
        <span className="text-red-600 font-semibold">
          Delete&nbsp;all&nbsp;annotations
        </span>
      ),
      id: "delete-all",
    },
  ];

  return (
    <>
      <DropdownButton
        handleMenuClick={handleMenuClick}
        icon={
          <GoPencil className="text-lg text-gray-600 hover:text-gray-800 cursor-pointer" />
        }
      />
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

export default VocabularyEditDropdown;
