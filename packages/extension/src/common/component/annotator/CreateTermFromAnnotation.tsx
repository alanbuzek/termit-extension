import * as React from "react";
import withI18n, { HasI18n } from "../hoc/withI18n";
import Term, { TermData } from "../../model/Term";
import { Button, ButtonToolbar, Col, Row } from "reactstrap";
import TermMetadataCreateForm from "../term/TermMetadataCreateForm";
import { injectIntl } from "react-intl";
import { IRI } from "../../util/VocabularyUtils";
import AssetFactory from "../../util/AssetFactory";
import { langString } from "../../model/MultilingualString";
import { isTermValid, LabelExists } from "../term/TermValidationUtils";
import { ContentState } from "../../../content";
import { Annotation } from "../../util/Annotation";
import TermOccurrence from "../../model/TermOccurrence";
import { getPageUrl } from "../../../content/helper/url";
import { useI18n } from "../hook/useI18n";

interface CreateTermFromAnnotationProps {
  onClose: () => void;
  onMinimize: () => void; // Minimize will be used to allow the user to select definition for a term being created
  vocabularyIri: IRI;
  language: string;
  contentState: ContentState;
  createTerm: (term: Term) => Promise<any>;
  definitionAnnotation?: Annotation;
  termOccurrence: TermOccurrence;
  i18n: any;
  intl: any;
}

interface CreateTermFromAnnotationState extends TermData {
  labelExists: LabelExists;
}

export class CreateTermFromAnnotation extends React.Component<
  CreateTermFromAnnotationProps,
  CreateTermFromAnnotationState
> {
  constructor(props: CreateTermFromAnnotationProps) {
    super(props);

    const { termOccurrence } = props;
    const initialLabel =
      termOccurrence.isSuggested() && termOccurrence.suggestedLemma
        ? termOccurrence.suggestedLemma
        : termOccurrence.getSanitizedExactMatch();

    this.state = Object.assign(
      {},
      AssetFactory.createEmptyTermData(props.language),
      {
        labelExists: {},
        label: langString(initialLabel || "", this.props.language),
        sources: [getPageUrl()],
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.definitionAnnotation &&
      this.props.definitionAnnotation !== prevProps.definitionAnnotation
    ) {
      this.setDefinition(
        this.props.definitionAnnotation.termOccurrence.getSanitizedExactMatch()
      );
    }
  }

  /**
   * Part of public imperative API allowing to set label so that the whole term does not have to be kept in parent
   * component state.
   */
  public setLabel(label: string) {
    this.setState({ label: langString(label.trim(), this.props.language) });
  }

  /**
   * Part of public imperative API allowing to set definition so that the whole term does not have to be kept in
   * parent component state.
   */
  public setDefinition(definition: string) {
    this.setState({
      definition: langString(definition.trim(), this.props.language),
    });
  }

  public onChange = (change: object, callback?: () => void) => {
    this.setState(change, callback);
  };

  public onSave = () => {
    const newTerm = new Term(this.state);
    this.props.createTerm(newTerm).then(() => {
      this.onCancel();
    });
  };

  public onCancel = () => {
    this.setState(AssetFactory.createEmptyTermData());
    this.props.onClose();
  };

  public render() {
    const { i18n, intl } = this.props;
    const invalid = !isTermValid(this.state, this.state.labelExists);

    return (
      <div style={{ width: "100%" }} className="p-3">
        <div
          className="modal-header"
          style={{ paddingTop: 1, paddingRight: 0, paddingLeft: 0 }}
        >
          <h3 className="text-lg font-semibold my-2">
            {i18n("glossary.form.header")}
          </h3>
        </div>
        <div>
          <TermMetadataCreateForm
            onChange={this.onChange}
            termData={this.state}
            language={this.props.language}
            definitionSelector={this.props.onMinimize}
            vocabularyIri={
              this.props.vocabularyIri.namespace +
              this.props.vocabularyIri.fragment
            }
            labelExist={this.state.labelExists}
            i18n={i18n}
            intl={intl}
          />
          <Row>
            <Col xs={12}>
              <ButtonToolbar className="d-flex justify-content-center mt-4">
                <Button
                  id="create-term-submit"
                  color="success"
                  onClick={this.onSave}
                  disabled={invalid}
                  size="sm"
                >
                  {i18n("glossary.form.button.submit")}
                </Button>
                <Button
                  id="create-term-cancel"
                  color="outline-dark"
                  size="sm"
                  onClick={this.onCancel}
                >
                  {i18n("glossary.form.button.cancel")}
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CreateTermFromAnnotation;
