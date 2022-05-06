import * as React from "react";
// import Term from "../../model/Term";
import AnnotationTerms from "./AnnotationTerms";
import { Button } from "reactstrap";
import { FaCheck } from "react-icons/fa";
import { TiTimes, TiTrash } from "react-icons/ti";
import { AnnotationOriginClass } from "../../util/Annotation";
import TermOccurrenceAnnotationView from "./TermOccurrenceAnnotationView";
import { GoPencil } from "react-icons/go";
import { useI18n } from "../hook/useI18n";
import SimplePopupWithActions from "./SimplePopupWithActions";
import Term from "../../model/Term";
import { ContentState } from "../../../content";

interface TermOccurrenceAnnotationProps {
  term?: Term | null;
  score?: string;
  resource?: string;
  annotationClass: string;
  annotationOrigin: string;
  onSelectTerm: (term: Term) => void;
  onCreateTerm: () => void;
  onClose: () => void;
  contentState: ContentState;
  onRemove: () => void;
}

export const TrashIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
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

function createActionButtons(
  props: TermOccurrenceAnnotationProps,
  i18n: (msgId: string) => string,
  editing: boolean,
  onEdit: () => void
) {
  const actions: any[] = [];
  const t = props.term ? props.term : null;
  if (props.annotationOrigin === AnnotationOriginClass.PROPOSED && t !== null) {
    actions.push(
      <Button
        color="primary"
        title={i18n("annotation.confirm")}
        size="sm"
        onClick={() => props.onSelectTerm(t)}
      >
        <FaCheck />
      </Button>
    );
  }
  if (!editing) {
    actions.push(
      <Button
        color="primary"
        title={i18n("annotation.edit")}
        size="sm"
        onClick={onEdit}
      >
        <GoPencil />
      </Button>
    );
  }

  actions.push(
    <div
      className="hover:bg-red-200 bg-gray-300 border border-gray-300 rounded-md cursor-pointer transition-all duration-200 text-gray-500 px-2 py-1"
      onClick={props.onRemove}
    >
      <TrashIcon />
    </div>
  );

  return actions;
}

export const TermOccurrenceAnnotation: React.FC<TermOccurrenceAnnotationProps> =
  (props) => {
    const { i18n } = useI18n();
    const term = props.term !== undefined ? props.term : null;
    const [editing, setEditing] = React.useState(term === null);
    React.useEffect(() => {
      if (term) {
        setEditing(false);
      }
    }, [term]);
    const onClose = () => {
      setEditing(false);
      props.onClose();
    };
    const popupBody = editing ? (
      <AnnotationTerms
        selectedTerm={term}
        onCreateTerm={props.onCreateTerm}
        i18n={i18n}
        vocabulary={props.contentState.vocabulary!}
        terms={props.contentState.terms!}
        canCreateTerm
        selectVocabularyTerm={(term: Term | null) => {
          if (!term) {
            return;
          }
          return props.onSelectTerm(term);
        }}
      />
    ) : (
      <TermOccurrenceAnnotationView
        term={term}
        resource={props.resource}
        annotationClass={props.annotationClass}
      />
    );

    return (
      <SimplePopupWithActions
        component={popupBody}
        actions={createActionButtons(
          Object.assign({}, props, {
            onSelectTerm: props.onSelectTerm,
            onClose,
          }),
          i18n,
          editing,
          () => setEditing(!editing)
        )}
        title={
          editing ? i18n("annotation.occurrence.title") : "Přiřazený pojem"
        }
      />
    );
  };

export default TermOccurrenceAnnotation;
