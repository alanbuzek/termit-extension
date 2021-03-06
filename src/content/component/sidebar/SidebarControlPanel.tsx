import React, { useState } from 'react';
import { FaBook, FaHighlighter } from 'react-icons/fa';
import { IntelligentTreeSelect } from 'intelligent-tree-select';
import Button from '../shared/Button';

import Vocabulary from '../../../termit-ui-common/model/Vocabulary';
import Annotation from '../../Annotation';
import VocabularyEditDropdown from '../shared/dropdown/VocabularyEditDropdown';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';
import { AnnotatorActions } from '../../AnnotatorController';
import VocabularyUtils from '../../../termit-ui-common/util/VocabularyUtils';
import AssetLink from '../../../termit-ui-common/component/misc/AssetLink';
import PageOverlay from '../../util/PageOverlay';

const SidebarControlPanel = ({
  annotations,
  vocabulary,
  vocabularies,
  handleAnnotatePage,
  handlePageDelete,
  handleDeleteSuggestions,
  isAnonymous,
  isVocabPrompt,
  instance,
}: {
  vocabulary?: Vocabulary;
  vocabularies?: Vocabulary[];
  annotations?: Annotation[];
  handleAnnotatePage: (v: Vocabulary) => void;
  handlePageDelete: () => void;
  handleDeleteSuggestions: () => void;
  isAnonymous: boolean;
  isVocabPrompt: boolean;
  instance;
}) => {
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary>();
  const { i18n } = useI18n();
  const handlePageDeleteClick = () => {
    handlePageDelete();
  };

  if (!annotations || isVocabPrompt) {
    return (
      <div className="p-3 mb-4">
        <img
          src={chrome.runtime.getURL('/static/img/annotate.png')}
          className="w-36 mb-4 mt-5 mx-auto"
          alt="Annotate page"
        />
        <p className="font-semibold text-lg text-center">
          {isAnonymous && i18n('extension.choose.vocabulary.anonymous')}
          {!isAnonymous &&
            !isVocabPrompt &&
            i18n('extension.choose.vocabulary')}
          {isVocabPrompt && i18n('extension.choose.vocabulary.vocabPrompt')}
        </p>
        {!isAnonymous && (
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
            options={vocabularies!.map((vocab) => ({
              iri: vocab.iri,
              label: vocab.label,
            }))}
            valueKey="iri"
            getOptionLabel={(option: Vocabulary) => option.label}
            childrenKey="subTerms"
            showSettings={false}
            maxHeight={200}
            multi={false}
            displayInfoOnHover={false}
            expanded
            renderAsTree={false}
            placeholder={i18n('extension.choose.vocabulary.placeholder')}
            valueRenderer={(option) => option.label}
          />
        )}
        <Button
          className="mx-auto mt-4"
          disabled={!selectedVocabulary && !isAnonymous}
          onClick={() => {
            PageOverlay.on();

            if (isVocabPrompt) {
              AnnotatorActions.setupLoggedInUser(selectedVocabulary!);
            } else {
              handleAnnotatePage(selectedVocabulary!);
            }
          }}
          size="big"
        >
          {i18n('extension.annotate.page')}
          <FaHighlighter className="ml-2 text-lg" />
        </Button>
      </div>
    );
  }

  if (isAnonymous) {
    return null;
  }

  const vocabularyIRI = VocabularyUtils.create(vocabulary!.iri);

  return (
    <div className="px-3 pt-3.5 pb-4 border-b border-gray-200">
      <div className="flex justify-between items-end">
        <div>
          <div className="text-gray-600 text-base mb-2">
            {i18n('extension.annotated.with')}
          </div>
          <div className="flex text-xl font-normal text-gray-700 items-center">
            <FaBook id="props.id" className="block mr-2" />
            <AssetLink
              path={`${instance.termitUi}/#/vocabularies/${vocabularyIRI.fragment}?namespace=${vocabularyIRI.namespace}`}
              asset={vocabulary!}
              id="selected-vocabulary"
              tooltip="asset.link.tooltip"
            >
              {vocabulary!.label}
            </AssetLink>
          </div>
        </div>
        <div className="relative">
          <VocabularyEditDropdown
            handleDeleteAllAnnotations={handlePageDeleteClick}
            handleDeleteSuggestedAnnotations={handleDeleteSuggestions}
          />{' '}
        </div>
      </div>
    </div>
  );
};

export default SidebarControlPanel;
