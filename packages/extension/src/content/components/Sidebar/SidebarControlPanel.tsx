import React from "react";
import Button from "../Button";
import Toggle from "react-toggle";
import { useState } from "react";
import Vocabulary from "../../../common/model/Vocabulary";
import { Annotation } from "../../../common/util/Annotation";
import AssetLink from "../../../common/component/misc/AssetLink";
import VocabularyUtils from "../../../common/util/VocabularyUtils";
import FiltersPanel, { DropdownComponent } from "./FiltersPanel";
import { FaBook, FaHighlighter } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import { getLocalized } from "../../../common/model/MultilingualString";
import { getShortLocale } from "../../../common/util/IntlUtil";

export const getUrlInfo = (url) => {
  const urlObject = new URL(url);

  const checkedHostname = urlObject.hostname.replace("www.", "");
  return { checkedHostname, urlObject };
};

const TrashIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
};

const SidebarControlPanel = ({
  annotations,
  vocabulary,
  vocabularies,
  handleAnnotatePage,
  handlePageDelete,
}: {
  vocabulary?: Vocabulary;
  vocabularies?: Vocabulary[];
  annotations?: Annotation[];
  handleAnnotatePage: (v: Vocabulary) => void;
  handlePageDelete: () => void;
}) => {
  const loading = false;
  const disabled = false;

  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary>();
  const onVocabularyChange = (vIri: string) => {
    const vocabulary = vocabularies!.find((v) => v.iri === vIri);
    setSelectedVocabulary(vocabulary);
  };

  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePageDeleteClick = () => {
    setDeleteLoading(true);
    handlePageDelete();
  };

  const [annotationLoading, setAnnotationLoading] = useState(false);

  if (!annotations) {
    return (
      <div className="p-3 mb-4">
        {/* {allowPanel} */}
        <img
          src={chrome.runtime.getURL("/static/img/annotate.png")}
          className="w-36 mb-4 mt-8 mx-auto"
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
            setAnnotationLoading(true);

            // TODO: remove timeout
            setTimeout(() => {
              // TODO: remove this fallback, adjust it to a different, proper default (To be specified)
              handleAnnotatePage(selectedVocabulary!);
            }, 200);
          }}
          loading={annotationLoading}
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
        <div className="mb-1.5">
          <GoPencil className="text-lg text-gray-600 hover:text-gray-800 cursor-pointer mr-2" />
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
