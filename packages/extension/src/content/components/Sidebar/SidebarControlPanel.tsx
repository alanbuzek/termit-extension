import React from "react";
import Button from "../Button";
import { useState } from "react";
import Vocabulary from "../../../common/model/Vocabulary";
import { Annotation } from "../../../common/util/Annotation";
import { FaBook, FaHighlighter } from "react-icons/fa";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import { overlay } from "../../helper/overlay";
import VocabularyEditDropdown from "../dropdown/VocabularyEditDropdown";
import { useI18n } from "../../../common/component/hook/useI18n";

const SidebarControlPanel = ({
  annotations,
  vocabulary,
  vocabularies,
  handleAnnotatePage,
  handlePageDelete,
  handleDeleteSuggestions,
}: {
  vocabulary?: Vocabulary;
  vocabularies?: Vocabulary[];
  annotations?: Annotation[];
  handleAnnotatePage: (v: Vocabulary) => void;
  handlePageDelete: () => void;
  handleDeleteSuggestions: () => void;
}) => {
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary>();
  const { i18n } = useI18n();
  const handlePageDeleteClick = () => {
    handlePageDelete();
  };

  if (!annotations) {
    return (
      <div className="p-3 mb-4">
        <img
          src={chrome.runtime.getURL("/static/img/annotate.png")}
          className="w-36 mb-4 mt-5 mx-auto"
        />
        <p className="font-semibold text-lg text-center">
          {i18n("extension.choose.vocabulary")}
        </p>
        <IntelligentTreeSelect
          onChange={(value) => {
            if (!value) {
              setSelectedVocabulary(undefined);
              return;
            }
            const foundVocabulary = vocabularies?.find(
              (vocab) => vocab.iri === value.iri
            );
            setSelectedVocabulary(foundVocabulary);
          }}
          value={
            selectedVocabulary
              ? {
                  iri: selectedVocabulary.iri,
                  label: selectedVocabulary.label,
                }
              : null
          }
          options={vocabularies!.map((vocabulary) => ({
            iri: vocabulary.iri,
            label: vocabulary.label,
          }))}
          valueKey="iri"
          getOptionLabel={(option: Vocabulary) => option.label}
          childrenKey="subTerms"
          showSettings={false}
          maxHeight={200}
          multi={false}
          displayInfoOnHover={false}
          expanded={true}
          renderAsTree={false}
          placeholder="Choose vocabulary"
          valueRenderer={(option) => option.label}
        />
        <Button
          className="mx-auto mt-4"
          disabled={!selectedVocabulary}
          onClick={() => {
            overlay.on();

            handleAnnotatePage(selectedVocabulary!);
          }}
          size="big"
        >
          {i18n("extension.annotate.page")}
          <FaHighlighter className="ml-2 text-lg" />
        </Button>
      </div>
    );
  }

  return (
    <div className="px-3 pt-3.5 pb-4 bg-gray-100 border-b border-gray-200">
      <div className="flex justify-between items-end">
        <div>
          <div className="text-gray-600 text-base mb-2">
            
            {i18n("extension.annotated.with")}
          </div>
          <div className="flex text-xl font-semibold text-gray-700 items-center">
            <FaBook id={"props.id"} className={"block mr-2"} />
            {vocabulary!.label}
          </div>
        </div>
        <div className="relative">
          <VocabularyEditDropdown
            handleDeleteAllAnnotations={handlePageDeleteClick}
            handleDeleteSuggestedAnnotations={handleDeleteSuggestions}
            vocabulary={vocabulary}
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarControlPanel;
