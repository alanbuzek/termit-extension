import React from "react";
import { Spinner } from "reactstrap";
import Button from "./Button";
import Toggle from "react-toggle";
import { useState } from "react";
import VocabularySelect from "../../common/component/vocabulary/VocabularySelect";
import { useEffect } from "react";
import { loadVocabularies } from "../../api";
import Vocabulary from "../../common/model/Vocabulary";

export const getUrlInfo = (url) => {
  const urlObject = new URL(url);

  const checkedHostname = urlObject.hostname.replace("www.", "");
  return { checkedHostname, urlObject };
};

const PageSummary = ({ annotations, handleAnnotatePage }) => {
  const loading = false;
  const disabled = false;

  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  useEffect(() => {
    loadVocabularies().then((vocab) => setVocabularies(vocab));
  }, []);
  const [selectedVocabulary, setSelectedVocabulary] = useState();
  const onVocabularyChange = (vIri: string) => setSelectedVocabulary(vocabularies[vIri]);

  const [annotationLoading, setAnnotationLoading] = useState(false);
  const { checkedHostname } = getUrlInfo(window.location.href);
  const allowPannel = (
    <label className="flex justify-between rounded-lg p-3 items-center mb-4 bg-white">
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
        {/* {allowPannel} */}
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
            }, 1500);
          }}
          loading={annotationLoading}
        >
          Annotate page
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 mb-4 rounded-md bg-gray-100 border-gray-600 border">
      {allowPannel}
      <h3>
        There are <span className="text-blue-600">{annotations.length}</span>{" "}
        term occurrences on this page
      </h3>
    </div>
  );
};

export default PageSummary;
