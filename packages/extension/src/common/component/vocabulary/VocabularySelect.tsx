import * as React from "react";
import { useState } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { loadVocabularies } from "../../../api";
import Vocabulary from "../../model/Vocabulary";
import Utils from "../../util/Utils";
import { useI18n } from "../hook/useI18n";

interface VocabularySelectProps {
  id: string;
  vocabularies: Vocabulary[];
  selectedVocabulary: Vocabulary;
  onVocabularyChange: (vocabIdx: Number) => void;
}

const VocabularySelect: React.FC<VocabularySelectProps> = ({
  vocabularies,
  id,
  onVocabularyChange,
  selectedVocabulary
}) => {
  const items = Object.keys(vocabularies).map((vIri) => {
    return (
      <DropdownItem
        className="m-vocabulary-select-item"
        key={vIri}
        onClick={() => {
          onVocabularyChange(vocabIdx);
        }}
      >
        {vocabularies[vIri].label}
      </DropdownItem>
    );
  });

  return (
    <UncontrolledDropdown id={id} group={true} className="w-100" active>
      <DropdownToggle caret={true} className="w-100">
        {selectedVocabulary ? selectedVocabulary.label : "Select vocabulary"}
      </DropdownToggle>
      <DropdownMenu
        modifiers={{
          setMaxHeight: {
            enabled: true,
            order: 890,
            fn: (data) => {
              return {
                ...data,
                styles: {
                  ...data.styles,
                  overflow: "auto",
                  maxHeight: Utils.calculateAssetListHeight() + "px",
                },
              };
            },
          },
        }}
      >
        {items}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default VocabularySelect;
