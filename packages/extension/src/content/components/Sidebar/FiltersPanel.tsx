import React from "react";
import { useState } from "react";
// import Select from "react-dropdown-select";

// // import Select from "react-select";

// // const options = [
// //   { value: "chocolate", label: "Chocolate" },
// //   { value: "strawberry", label: "Strawberry" },
// //   { value: "vanilla", label: "Vanilla" },
// // ];

// // const MyComponent = () => <Select options={options} />;

// import Dropdown from "react-dropdown";
// // import "react-dropdown/style.css";P

const options = ["one", "two", "three"];
const defaultOption = options[0];

export const DropdownComponent = ({
  id,
  options,
  value,
  setValue,
  label,
  defaultOptionText,
}) => {
  return (
    <div className="text-base mb-3 mt-1.5">
      <label form={id} className="text-gray-700">
        {label}
      </label>
      <select
        name={id}
        id={id}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className="p-2"
      >
        <option value="">{defaultOptionText || 'All'}</option>
        {options.map((option) => (
          <option value={option.value} selected={option.value == value}>
            {/* TODO */}
            {option.name.slice(0, 18)}
          </option>
        ))}
      </select>
    </div>
  );
};

// suggested-term-occurrence proposed-occurrence

export const occurrenceTypes = [
  {
    value: "suggested-term-occurrence selected-occurrence",
    name: "Occurrence of an unknown term",
  },
  {
    value: "assigned-term-occurrence selected-occurrence",
    name: "Occurrence of an existing term",
  },
  {
    value: "term-definition selected-occurrence",
    name: "Term definition",
  },
  {
    value: "pending-term-definition selected-occurrence",
    name: "Definition of an unknown term",
  },
  {
    value: "suggested-term-occurrence proposed-occurrence",
    name: "Proposed occurrence of an new term",
  },
  {
    value: "suggested-term-occurrence assigned-term-occurrence",
    name: "Proposed occurrence of an existing term",
  },
];

const FiltersPanel = ({
  occurrenceTypeFilter,
  setOccurrenceTypeFilter,
  annotationsCount,
}) => {
  return (
    <div>
      <div className="flex">
        <DropdownComponent
          id="occurrence-type"
          options={occurrenceTypes}
          value={occurrenceTypeFilter}
          setValue={setOccurrenceTypeFilter}
          label={"Occurrence type filter"}
        />
      </div>
      <div className="text-gray-800 text-base">
        {annotationsCount} annotations found.
      </div>
    </div>
  );
};

export default FiltersPanel;
