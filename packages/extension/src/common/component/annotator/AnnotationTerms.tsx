import * as React from "react";
import { Button, FormGroup, FormText, Label } from "reactstrap";
import Vocabulary from "../../model/Vocabulary";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import { GoPlus } from "react-icons/go";
import Utils from "../../util/Utils";
import {
  commonTermTreeSelectProps,
  processTermsForTreeSelect,
} from "../term/TermTreeSelectHelper";
import Term, { TermData } from "../../model/Term";
import {
  createTermsWithImportsOptionRenderer,
  createTermValueRenderer,
} from "../misc/treeselect/Renderers";
import { HasI18n } from "../hoc/withI18n";
import { useI18n } from "../hook/useI18n";
import { TermsMap } from "../../../content";

interface GlossaryTermsProps extends HasI18n {
  vocabulary?: Vocabulary;
  terms: TermsMap;
  counter: number;
  selectVocabularyTerm: (selectedTerms: Term | null) => void;
}

interface AnnotationTermsProps extends GlossaryTermsProps {
  canCreateTerm?: boolean;
  onChange: (term: Term | null) => void;
  selectedTerm: Term | null;
  onCreateTerm?: () => void;
}

export class AnnotationTerms extends React.Component<AnnotationTermsProps> {
  private readonly treeComponent: React.RefObject<IntelligentTreeSelect>;

  public static defaultProps: Partial<AnnotationTermsProps> = {
    canCreateTerm: true,
  };

  constructor(props: AnnotationTermsProps) {
    super(props);
    this.treeComponent = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.treeComponent.current) {
        // This is a workaround because autoFocus was causing issues with scrolling (screen would jump to the top due to the initial position of the popover)
        this.treeComponent.current.focus();
      }
    }, 100);
  }

  public componentDidUpdate(prevProps: AnnotationTermsProps) {
    if (prevProps.counter < this.props.counter) {
      this.forceUpdate();
    }
    if (prevProps.locale !== this.props.locale) {
      this.treeComponent.current.forceUpdate();
    }
  }

  public componentWillUnmount() {
    this.props.selectVocabularyTerm(null);
  }

  private handleChange = (term: TermData | null) => {
    console.log("term: ", term);
    if (term === null) {
      this.props.selectVocabularyTerm(term);
      this.props.onChange(null);
    } else {
      // The tree component adds depth and expanded attributes to the options when rendering,
      // We need to get rid of them before working with the term
      // We are creating a defensive copy of the term so that the rest of the application and the tree component
      // have their own versions
      const cloneData = Object.assign({}, term);
      // @ts-ignore
      delete cloneData.expanded;
      // @ts-ignore
      delete cloneData.depth;
      const clone = new Term(cloneData);
      this.props.selectVocabularyTerm(clone);
      this.props.onChange(clone);
    }
  };

  public render() {
    const { i18n, vocabulary } = this.props;
    const terms = processTermsForTreeSelect(
      Object.values(this.props.terms),
      Utils.sanitizeArray(vocabulary!.allImportedVocabularies).concat(
        vocabulary!.iri
      )
    );

    console.log("processed terms are here: ", terms);

    return (
      <FormGroup>
        <div className="align-items-center d-flex mb-2">
          <div className="flex-grow-1">
            <Label className="attribute-label mb-0">
              {i18n("type.term") + ":"}
            </Label>
          </div>
          {this.props.canCreateTerm && (
            <Button
              key="annotator.createTerm"
              color="primary"
              title={i18n("glossary.createTerm.tooltip")}
              size="sm"
              onClick={this.props.onCreateTerm}
              className="pull-right"
            >
              <GoPlus className="mr-1" />
              {i18n("annotator.createTerm.button")}
            </Button>
          )}
        </div>
        <IntelligentTreeSelect
          ref={this.treeComponent}
          className="p-0 mt-1"
          onChange={this.handleChange}
          value={this.props.selectedTerm}
          options={terms}
          isMenuOpen={false}
          multi={false}
          optionRenderer={createTermsWithImportsOptionRenderer(
            this.props.vocabulary!.iri
          )}
          valueRenderer={createTermValueRenderer(this.props.vocabulary!.iri)}
          {...commonTermTreeSelectProps(this.props)}
        />
        <FormText>
          {i18n("resource.metadata.terms.edit.select.placeholder")}
        </FormText>
      </FormGroup>
    );
  }
}

export default AnnotationTerms;
