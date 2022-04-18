import React from "react";
import { Spinner } from "reactstrap";
import Button from "./Button";
import Toggle from "react-toggle";
import { useState } from "react";
import VocabularySelect from "../../common/component/vocabulary/VocabularySelect";
import { useEffect } from "react";
import { loadVocabularies } from "../../api";
import Vocabulary from "../../common/model/Vocabulary";
import { Annotation } from "../../common/util/Annotation";
import AssetLink from "../../common/component/misc/AssetLink";

export const getUrlInfo = (url) => {
  const urlObject = new URL(url);

  const checkedHostname = urlObject.hostname.replace("www.", "");
  return { checkedHostname, urlObject };
};

const PageSummary = ({
  annotations,
  vocabulary,
  vocabularies,
  handleAnnotatePage,
}: {
  vocabulary?: Vocabulary;
  vocabularies?: Vocabulary[];
  annotations?: Annotation[];
  handleAnnotatePage: (v: Vocabulary) => void;
}) => {
  const loading = false;
  const disabled = false;

 
  const [selectedVocabulary, setSelectedVocabulary] = useState();
  const onVocabularyChange = (vIri: string) =>
    setSelectedVocabulary(vocabularies![vIri]);

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
        <VocabularySelect
          id={"vocabularySelect1"}
          vocabularies={vocabularies}
          selectVocabulary={selectedVocabulary}
          onVocabularyChange={onVocabularyChange}
        />
        <Button
          onClick={() => {
            setAnnotationLoading(true);

            // TODO: remove timeout
            setTimeout(() => {
              // TODO: remove this fallback, adjust it to a different, proper default (To be specified)
              handleAnnotatePage(selectedVocabulary || vocabularies[0]);
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
      <div className="p-3 mb-4 rounded-md bg-gray-100 border-gray-600 border">
        <div className="text-base font-semibold text-gray-800 rounded-md mb-2">
          Vocabulary: <AssetLink asset={vocabulary} path="/" />
        </div>
        <h3>
          There are <span className="text-blue-600">{annotations.length}</span>{" "}
          annotations on this page.
        </h3>
      </div>
    </div>
  );
};

export default PageSummary;
