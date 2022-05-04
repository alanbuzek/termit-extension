import React from "react";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import { Input } from "reactstrap";

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
        <option value="">{defaultOptionText || "All"}</option>
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
    name: "Unknown term",
  },
  {
    value: "assigned-term-occurrence selected-occurrence",
    name: "Existing term",
  },
  {
    value: "term-definition selected-occurrence",
    name: "Term definition",
  },
  {
    value: "pending-term-definition selected-occurrence",
    name: "Unknown term defintion",
  },
  {
    value: "suggested-term-occurrence proposed-occurrence",
    name: "Proposed new term",
  },
  // TODO: put back in
  // {
  //   value: "assigned-term-occurrence suggested-term-occurrence",
  //   name: "Proposed existing term",
  // },
];

const FiltersPanel = ({
  occurrenceTypeFilter,
  setOccurrenceTypeFilter,
  occurrenceTextFilter,
  setOccurrenceTextFilter,
  annotationsCount,
}) => {
  return (
    <>
      <div className="flex px-2.5">
        <Input
          name="occurrence-text-filter"
          value={occurrenceTextFilter}
          onChange={(e) => setOccurrenceTextFilter(e.target.value)}
          bsSize="sm"
          placeholder={"Filter by text"}
          className="flex-1"
        />
        <div style={{ flex: 2 }}>
          <IntelligentTreeSelect
            onChange={(value) => {
              if (!value) {
                setOccurrenceTypeFilter(undefined);
                return;
              }
              setOccurrenceTypeFilter(value);
            }}
            value={occurrenceTypeFilter}
            options={occurrenceTypes}
            valueKey="value"
            optionRenderer={({ option, selectValue }) => {
              console.log("option className: ", option.value);
              return (
                <div
                  className={`${option.value} py-0.5 px-2 cursor-pointer`}
                  onClick={() => selectValue(option)}
                >
                  {option.name}
                </div>
              );
            }}
            showSettings={false}
            maxHeight={300}
            multi={false}
            displayInfoOnHover={false}
            expanded={true}
            renderAsTree={false}
            placeholder="All occurrences"
            valueRenderer={(option) => {
              return option.name;
            }}
          />
        </div>
      </div>
      <div className="text-gray-600 text-sm px-3 mt-2 mb-1">
        {annotationsCount} annotations found.
      </div>
    </>
  );
};

export default FiltersPanel;
