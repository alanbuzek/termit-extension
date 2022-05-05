import React from "react";
import Button from "../Button";
import { useState } from "react";
import Vocabulary from "../../../common/model/Vocabulary";
import { Annotation } from "../../../common/util/Annotation";
import { FaBook, FaHighlighter } from "react-icons/fa";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import { overlay } from "../../helper/overlay";
import VocabularyEditDropdown from "../dropdown/VocabularyEditDropdown";

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
          Choose a vocabulary to start annotating with.
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
          Annotate Page
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
            Page annotated with:
          </div>
          <div className="flex text-xl font-semibold text-gray-700 items-center">
            <FaBook id={"props.id"} className={"block mr-2"} />
            {/* <AssetLink
          asset={vocabulary!}
          path={`http://localhost:3000/#/vocabularies/${
            VocabularyUtils.create(vocabulary!.iri!).fragment
          }?namespace=http://onto.fel.cvut.cz/ontologies/slovnik/`}
        /> */}
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

      {/* <div className="p-3 mb-3 rounded-md">
        <div className="text-base font-semibold text-gray-800 rounded-md mb-2">
          Selected vocabulary:{" "}
          <AssetLink
            asset={vocabulary!}
            path={`http://localhost:3000/#/vocabularies/${
              VocabularyUtils.create(vocabulary!.iri!).fragment
            }?namespace=http://onto.fel.cvut.cz/ontologies/slovnik/`}
          />
        </div>
        <h3>
          There are <span className="text-blue-600">{annotations.length}</span>{" "}
          annotations on this page.
        </h3>
      </div>
      <div className="flex ml-auto mr-2">
        <Button
          disabled={deleteLoading}
          onClick={handlePageDeleteClick}
          color="alertLight"
          className="mr-2"
        >
          Delete website <TrashIcon />
        </Button>
      </div> */}
    </div>
  );
};

export default SidebarControlPanel;
