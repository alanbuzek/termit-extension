import * as React from "react";
import Term from "../../model/Term";
import { Button } from "reactstrap";
import { TiTimes, TiTrash } from "react-icons/ti";
import SimplePopupWithActions from "./SimplePopupWithActions";
import AnnotationTerms from "./AnnotationTerms";
// import TermDefinitionAnnotationView from "./TermDefinitionAnnotationView";
import { GoPencil } from "react-icons/go";
// import IfUserAuthorized from "../authorization/IfUserAuthorized";
import { useI18n } from "../hook/useI18n";
import TermDefinitionAnnotationView from "./TermDefinitionAnnotationView";
import { ContentState } from "../../../content";
import { TrashIcon } from "./TermOccurrenceAnnotation";

interface TermDefinitionAnnotationProps {
  term?: Term | null;
  resource?: string;
  text: string;
  onRemove: () => void;
  onSelectTerm: (term: Term) => Promise<void>;
  onClose: () => void;
  contentState: ContentState;
}

function createActionButtons(
  props: TermDefinitionAnnotationProps,
  i18n: (msgId: string) => string,
  editing: boolean,
  onEdit: () => void
) {
  const actions: any[] = [];
  if (!editing) {
    actions.push(
      <Button
        className="m-annotation-definition-edit"
        color="primary"
        title={i18n("edit")}
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

export const TermDefinitionAnnotation: React.FC<TermDefinitionAnnotationProps> =
  (props) => {
    const { i18n } = useI18n();
    const term = props.term !== undefined ? props.term : null;
    const [editing, setEditing] = React.useState(term === null);
    React.useEffect(() => {
      if (term) {
        setEditing(false);
      }
    }, [term]);
    const bodyContent = editing ? (
      <AnnotationTerms
        canCreateTerm={false}
        selectedTerm={term}
        i18n={i18n}
        terms={props.contentState.terms!}
        vocabulary={props.contentState.vocabulary!}
        selectVocabularyTerm={(term: Term | null) => {
          if (!term) {
            return;
          }
          return props.onSelectTerm(term);
        }}
      />
    ) : (
      <TermDefinitionAnnotationView
        term={term}
        resource={props.resource}
        textContent={props.text}
      />
    );

    return (
      <SimplePopupWithActions
        component={bodyContent}
        actions={createActionButtons(props, i18n, editing, () =>
          setEditing(!editing)
        )}
        title={
          editing
            ? i18n("extension.definition.prompt")
            : i18n("extension.assigned.definition")
        }
      />
    );
  };

export default TermDefinitionAnnotation;
