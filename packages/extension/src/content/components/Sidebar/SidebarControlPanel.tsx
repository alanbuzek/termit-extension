import React from "react";
import Button from "../Button";
import Toggle from "react-toggle";
import { useState } from "react";
import VocabularySelect from "../../../common/component/vocabulary/VocabularySelect";
import Vocabulary from "../../../common/model/Vocabulary";
import { Annotation } from "../../../common/util/Annotation";
import AssetLink from "../../../common/component/misc/AssetLink";
import VocabularyUtils from "../../../common/util/VocabularyUtils";
import { DropdownComponent } from "./FiltersPanel";

export const getUrlInfo = (url) => {
  const urlObject = new URL(url);

  const checkedHostname = urlObject.hostname.replace("www.", "");
  return { checkedHostname, urlObject };
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

  const [selectedVocabulary, setSelectedVocabulary] =
    useState<Vocabulary | null>(null);
  const onVocabularyChange = (vIri: string) => {
    const vocabulary = vocabularies!.find((v) => v.iri === vIri);
    setSelectedVocabulary(vocabulary);
  };

  const [annotationLoading, setAnnotationLoading] = useState(false);
  const { checkedHostname } = getUrlInfo(window.location.href);
  const allowPanel = (
    <label className="flex justify-between rounded-lg px-3 py-2 items-center mb-1.5 bg-gray-200">
      <div
        className={` text-base flex items-center ${
          loading && !disabled ? "text-gray-400" : "text-gray-800"
        }`}
      >
        Allow on {checkedHostname}{" "}
        {/* {loading && !disabled && <Spinner size="5" className="ml-3" />} */}
      </div>
      <Toggle
        disabled={loading}
        checked={!disabled}
        icons={false}
        onChange={() => {
          console.log("TODO");
        }}
      />
    </label>
  );

  if (!annotations) {
    return (
      <div className="p-3 mb-4 rounded-md bg-gray-100 border-gray-600 border">
        {/* {allowPanel} */}
        <p className="font-semibold">This page hasn't be annotated yet.</p>
        <DropdownComponent
          options={vocabularies!.map((vocab) => ({
            name: vocab.label,
            value: vocab.iri,
          }))}
          id="vocabulary-select"
          label={"Vocabulary to annotate with"}
          value={selectedVocabulary?.iri}
          setValue={(newValue) => onVocabularyChange(newValue)}
        ></DropdownComponent>
        <Button
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
        >
          Annotate page
        </Button>
      </div>
    );
  }

  return (
    <div>
      {allowPanel}
      <div className="p-3 mb-3 rounded-md bg-gray-100 border-gray-600 border">
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
      <div className="flex">
        <Button onClick={handlePageDelete} color="alertLight" className="mr-2">
          Delete all annotations
        </Button>
        {/* <Button onClick={handlePageDelete} color="alert">
          Delete suggested annotations
        </Button> */}
      </div>
    </div>
  );
};

export default SidebarControlPanel;
