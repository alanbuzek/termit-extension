import * as React from 'react';
import { FormGroup, FormText, Label } from 'reactstrap';
import Vocabulary from '../../model/Vocabulary';
import { IntelligentTreeSelect } from 'intelligent-tree-select';
import 'intelligent-tree-select/lib/styles.css';
import { GoPlus } from 'react-icons/go';
import Utils from '../../util/Utils';
import {
  commonTermTreeSelectProps,
  processTermsForTreeSelect,
} from '../term/TermTreeSelectHelper';
import Term, { TermData } from '../../model/Term';
import {
  createTermsWithImportsOptionRenderer,
  createTermValueRenderer,
} from '../misc/treeselect/Renderers';
import { HasI18n } from '../hoc/withI18n';
import { TermsMap } from '../../../content/AnnotatorController';
import Button from '../../../content/component/shared/Button';

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
  instance?;
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
    if (term === null) {
      this.props.selectVocabularyTerm(term);
    } else {
      // The tree component adds depth and expanded attributes to the options when rendering,
      // We need to get rid of them before working with the term
      // We are creating a defensive copy of the term so that the rest of the application and the tree component
      // have their own versions
      const cloneData = { ...term };
      // @ts-ignore
      delete cloneData.expanded;
      // @ts-ignore
      delete cloneData.depth;
      const clone = new Term(cloneData);
      this.props.selectVocabularyTerm(clone);
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

    return (
      <FormGroup>
        <div className="flex mb-0">
          <div className="flex-1">
            <IntelligentTreeSelect
              ref={this.treeComponent}
              className="p-0 w-full"
              onChange={this.handleChange}
              value={this.props.selectedTerm}
              options={terms}
              isMenuOpen={false}
              multi={false}
              optionRenderer={createTermsWithImportsOptionRenderer(
                this.props.vocabulary!.iri
              )}
              valueRenderer={createTermValueRenderer(
                this.props.vocabulary!.iri,
                this.props.instance
              )}
              {...commonTermTreeSelectProps(this.props)}
              placeholder={i18n('terms.select.assignment.placeholder')}
            />
          </div>
          {this.props.canCreateTerm && (
            <div className="p-0.5">
              <Button
                style={{ flex: 0.15 }}
                onClick={this.props.onCreateTerm}
                color="primary"
                size="icon"
                className="ml-1 py-1 px-2 h-full w-full"
              >
                <GoPlus className="text-base text-gray-700" />
              </Button>
            </div>
          )}
        </div>
        <FormText className="ml-2 -mb-3">
          {i18n('resource.metadata.terms.edit.select.placeholder')}
        </FormText>
      </FormGroup>
    );
  }
}

export default AnnotationTerms;
