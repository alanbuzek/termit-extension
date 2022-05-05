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

interface TermDefinitionAnnotationProps {
  target: string;
  term?: Term | null;
  resource?: string;
  text: string;
  isOpen: boolean;
  onRemove: () => void;
  onSelectTerm: (term: Term) => Promise<void>;
  onToggleDetailOpen: () => void;
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
      // <IfUserAuthorized
      //   renderUnauthorizedAlert={false}
      //   key="annotation.definition.edit"
      // >
      <Button
        className="m-annotation-definition-edit"
        color="primary"
        title={i18n("edit")}
        size="sm"
        onClick={onEdit}
      >
        <GoPencil />
      </Button>
      // </IfUserAuthorized>
    );
  }
  actions.push(
    // <IfUserAuthorized
    //   renderUnauthorizedAlert={false}
    //   key="annotation.definition.remove"
    // >
    <Button
      className="m-annotation-definition-remove"
      color="primary"
      title={i18n("remove")}
      size="sm"
      onClick={props.onRemove}
    >
      <TiTrash />
    </Button>
    // </IfUserAuthorized>
  );
  actions.push(
    <Button
      key="annotation.definition.close"
      className="m-annotation-definition-close"
      color="primary"
      title={i18n("annotation.close")}
      size="sm"
      onClick={props.onClose}
    >
      <TiTimes />
    </Button>
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
        onChange={() => ({})}
        canCreateTerm={false}
        selectedTerm={term}
        i18n={i18n}
        terms={props.contentState.terms!}
        vocabulary={props.contentState.vocabulary!}
        selectVocabularyTerm={(term: Term | null) => {
          if (!term){
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
        isOpen={props.isOpen}
        target={props.target}
        toggle={props.onToggleDetailOpen}
        component={bodyContent}
        actions={createActionButtons(props, i18n, editing, () =>
          setEditing(!editing)
        )}
        title={i18n("annotation.definition.title")}
      />
    );
  };

export default TermDefinitionAnnotation;
