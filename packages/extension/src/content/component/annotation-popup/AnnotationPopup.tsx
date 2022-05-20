import classnames from 'classnames';
import React, { useState } from 'react';
import { CreateTermFromAnnotation } from '../../../termit-ui-common/component/annotator/CreateTermFromAnnotation';
import TermDefinitionAnnotation from '../../../termit-ui-common/component/annotator/TermDefinitionAnnotation';
import TermOccurrenceAnnotation from '../../../termit-ui-common/component/annotator/TermOccurrenceAnnotation';
import PurposeSelectionDialog from './PurpuseSelectionDialog';

import Annotation, {
  AnnotationTypeClass,
  AnnotationOriginClass,
  AnnotationType,
} from '../../Annotation';
import PageOverlay from '../../util/PageOverlay';
import { ContentState, AnnotatorActions } from '../../AnnotatorController';
import Term from '../../../termit-ui-common/model/Term';
import VocabularyUtils from '../../../termit-ui-common/util/VocabularyUtils';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';
import LoginPromptPopup from '../shared/LoginPromptPopup';

/**
 * Union of possible toolbar commands.
 *
 * @typedef {'annotate'|'highlight'|'show'|'hide'} Command
 */

export enum PopupType {
  CreateTermModal,
  TermDefinition,
  TermOccurrence,
  PurposeSelection,
}

type ContentPopupProps = {
  annotation: Annotation;
  contentState: ContentState;
  initialPopupType: PopupType;
  showAt: (x: number, y: number, isModal: boolean) => void;
  hide: any;
  selectionRange: any;
  onSelectDefinition: any;
  repositionWithAnnotation: (Annotation) => void;
};

function AnnotationPopup({
  initialPopupType,
  showAt,
  hide,
  selectionRange,
  annotation,
  contentState,
  onSelectDefinition,
  repositionWithAnnotation,
}: ContentPopupProps) {
  const [currPopup, setCurrPopup] = useState(initialPopupType);
  const [isMinimized, setIsMinimized] = useState(false);
  const [definitionAnnotation, setDefinitionAnnotation] =
    useState<Annotation>();
  const closePopup = () => {
    hide();
  };
  const vocabularyIri =
    contentState.vocabulary &&
    VocabularyUtils.create(contentState.vocabulary.iri);
  const { i18n, intl } = useI18n();
  const isAnonymous = !contentState.user;

  const renderContentPopup = () => {
    if (isAnonymous && currPopup !== PopupType.PurposeSelection) {
      return <LoginPromptPopup />;
    }

    switch (currPopup) {
      case PopupType.CreateTermModal:
        // 4. create term annotation
        return (
          <CreateTermFromAnnotation
            intl={intl}
            i18n={i18n}
            onClose={() => {
              setCurrPopup(PopupType.TermOccurrence);
              setDefinitionAnnotation(undefined);
              PageOverlay.off();
            }}
            onMinimize={() => {
              setIsMinimized(true);
              PageOverlay.off();
              onSelectDefinition((defAnnotation: Annotation) => {
                PageOverlay.on();
                setIsMinimized(false);
                setDefinitionAnnotation(defAnnotation);
              });
            }}
            vocabularyIri={vocabularyIri!}
            createTerm={(term: Term) =>
              // PageOverlay.off();
              AnnotatorActions.createTerm(
                term,
                vocabularyIri!,
                annotation,
                definitionAnnotation
              )
            }
            language="cs"
            contentState={contentState}
            definitionAnnotation={definitionAnnotation}
            termOccurrence={annotation.termOccurrence}
          />
        );
      case PopupType.PurposeSelection:
        return (
          <PurposeSelectionDialog
            onMarkOccurrence={async () => {
              const markedAnnotation =
                await AnnotatorActions.createUnknownOccurrenceFromRange(
                  selectionRange,
                  AnnotationType.OCCURRENCE
                );
              if (isAnonymous) {
                closePopup();
                return;
              }
              repositionWithAnnotation(markedAnnotation);

              setCurrPopup(PopupType.TermOccurrence);
            }}
            onMarkDefinition={async () => {
              const markedAnnotation =
                await AnnotatorActions.createUnknownOccurrenceFromRange(
                  selectionRange,
                  AnnotationType.DEFINITION
                );

              if (isAnonymous) {
                closePopup();
                return;
              }
              repositionWithAnnotation(markedAnnotation);

              setCurrPopup(PopupType.TermDefinition);
            }}
          />
        );
      case PopupType.TermOccurrence:
        return (
          <TermOccurrenceAnnotation
            instance={contentState.instance}
            term={annotation?.term}
            annotationClass={
              annotation?.getTermState() ||
              AnnotationTypeClass.SUGGESTED_OCCURRENCE
            }
            annotationOrigin={
              annotation?.getTermCreatorState() ||
              AnnotationOriginClass.PROPOSED
            }
            onRemove={() => {
              closePopup();
              return AnnotatorActions.removeOccurrence(annotation);
            }}
            onSelectTerm={(term: Term) =>
              AnnotatorActions.assignTermToOccurrence(
                term,
                annotation,
                AnnotationType.OCCURRENCE
              )
            }
            onCreateTerm={() => {
              showAt(0, 0, true);
              setCurrPopup(PopupType.CreateTermModal);
            }}
            onClose={closePopup}
            contentState={contentState}
          />
        );
      case PopupType.TermDefinition:
        return (
          <TermDefinitionAnnotation
            instance={contentState.instance}
            term={annotation?.term}
            text={
              annotation?.termOccurrence?.getTextContent() ||
              selectionRange.toString()
            }
            onRemove={() => {
              closePopup();
              return AnnotatorActions.removeOccurrence(annotation);
            }}
            onSelectTerm={(term: Term) =>
              AnnotatorActions.assignTermToOccurrence(
                term,
                annotation,
                AnnotationType.DEFINITION
              )
            }
            onClose={closePopup}
            contentState={contentState}
          />
        );
      default:
        return null;
    }
  };

  let style: any = {
    visibility: isMinimized ? 'hidden' : 'visible',
  };

  if (currPopup === PopupType.CreateTermModal) {
    style = { ...style, width: 700, height: 500, overflowY: 'scroll' };
  }

  return (
    <div
      className={classnames(
        'hyp-u-border hyp-u-bg-color--white',
        'AdderToolbar',
        {
          'AdderToolbar--up': true,
          'is-active': true,
        }
      )}
      style={style}
    >
      <div
        className="hyp-u-layout-row AdderToolbar__actions"
        style={{ width: '100%' }}
      >
        {renderContentPopup()}
      </div>
    </div>
  );
}

// this ensures the wrapped component is mounted anew and no previous state is preserved, when calling hide() and show() in AnnotationPopupContainer
function isVisibleWrapper(WrappedComponent) {
  // eslint-disable-next-line react/display-name
  return ({ isVisible, ...props }) => {
    if (!isVisible) {
      return null;
    }

    return <WrappedComponent isVisible {...props} />;
  };
}

export default isVisibleWrapper(AnnotationPopup);
