import React from "react";
import useDropdown from "./useDropdown";
import DropdownItem from "./DropdownItem";
import DropdownContainer from "./DropdownContainer";
import DropdownButton from "./DropdownButton";
import { GoPencil } from "react-icons/go";
import VocabularyUtils from "../../../common/util/VocabularyUtils";
import { useI18n } from "../../../common/component/hook/useI18n";

const VocabularyEditDropdown = ({
  handleDeleteSuggestedAnnotations,
  handleDeleteAllAnnotations,
  vocabulary,
}) => {
  const { i18n } = useI18n();

  const { dropdownRef, isOpen, handleMenuClick, handleItemClick } = useDropdown(
    (id) => {
      if (id === "delete-suggestions") {
        handleDeleteSuggestedAnnotations();
      } else if (id === "delete-all") {
        handleDeleteAllAnnotations();
      } else {
        throw new Error("Unknown action!");
      }
    }
  );

  const options = [
    {
      name: (
        <span className="text-red-600">
          {i18n("occurrence.delete.suggestions")}
        </span>
      ),
      id: "delete-suggestions",
    },
    {
      name: (
        <span className="text-red-600 font-semibold">
          {i18n("occurrence.delete.all")}
        </span>
      ),
      id: "delete-all",
    },
  ];

  if (vocabulary) {
    options.unshift({
      name: i18n("sidebar.vocabulary.link"),
      link: `http://localhost:3000/#/vocabularies/${
        VocabularyUtils.create(vocabulary.iri).fragment
      }`,
    });
  }

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
