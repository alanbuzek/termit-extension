import React from "react";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import { Input } from "reactstrap";
import { useI18n } from "../../../common/component/hook/useI18n";

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
    name: "occurrence.unknown.term",
  },
  {
    value: "assigned-term-occurrence selected-occurrence",
    name: "occurrence.existing.term",
  },
  {
    value: "term-definition selected-occurrence",
    name: "occurrence.known.definition",
  },
  {
    value: "pending-term-definition selected-occurrence",
    name: "occurrence.unknown.definition",
  },
  {
    value: "suggested-term-occurrence proposed-occurrence",
    name: "occurrence.suggested.new.term",
  },
  {
    value: "assigned-term-occurrence proposed-occurrence",
    name: "occurrence.suggested.existing.term",
  },
];

const FiltersPanel = ({
  occurrenceTypeFilter,
  setOccurrenceTypeFilter,
  occurrenceTextFilter,
  setOccurrenceTextFilter,
  annotationsCount,
}) => {
  const { i18n } = useI18n();

  return (
    <>
      <div className="flex px-2.5">
        <Input
          name="occurrence-text-filter"
          value={occurrenceTextFilter}
          onChange={(e) => setOccurrenceTextFilter(e.target.value)}
          bsSize="sm"
          placeholder={i18n("extension.occurrences.filter.placeholder")}
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
              return (
                <div
                  className={`${option.value} py-0.5 px-2 cursor-pointer`}
                  onClick={() => selectValue(option)}
                >
                  {i18n(option.name)}
                </div>
              );
            }}
            showSettings={false}
            maxHeight={300}
            multi={false}
            displayInfoOnHover={false}
            expanded={true}
            renderAsTree={false}
            placeholder={i18n("extension.occurrences.all")}
            valueRenderer={(option) => {
              return i18n(option.name);
            }}
          />
        </div>
      </div>
      <div className="text-gray-600 text-sm px-3 mt-2 mb-1">
        {annotationsCount} {i18n("extension.found.annotations")}.
      </div>
    </>
  );
};

export default FiltersPanel;
