import * as React from "react";
import withI18n, { HasI18n } from "../hoc/withI18n";
import Term, { TermData } from "../../model/Term";
import {
  Button,
  ButtonToolbar,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import TermMetadataCreateForm from "../term/TermMetadataCreateForm";
import { injectIntl } from "react-intl";
// import { createTerm } from "../../action/AsyncTermActions";
import { IRI } from "../../util/VocabularyUtils";
import AssetFactory from "../../util/AssetFactory";
import { langString } from "../../model/MultilingualString";
// import TermItState from "../../model/TermItState";
import { isTermValid, LabelExists } from "../term/TermValidationUtils";

interface CreateTermFromAnnotationProps extends HasI18n {
  show: boolean;
  onClose: () => void;
  onMinimize: () => void; // Minimize will be used to allow the user to select definition for a term being created
  onTermCreated: (term: Term) => void;
  vocabularyIri: IRI;
  language: string;

  createTerm: (term: Term, vocabularyIri: IRI) => Promise<any>;
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
    this.state = Object.assign(
      {},
      AssetFactory.createEmptyTermData(props.language),
      { labelExists: {} }
    );
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
    // const newTerm = new Term(this.state);
    console.log('on save inside called')
    this.props.onSave();
    // this.props.createTerm(newTerm, this.props.vocabularyIri).then(() => {
    //   this.props.onTermCreated(newTerm);
    //   this.onCancel();
    // });
  };

  public onCancel = () => {
    this.setState(AssetFactory.createEmptyTermData());
    this.props.onClose();
  };

  public render() {
    const i18n = this.props.i18n;
    const invalid = !isTermValid(this.state, this.state.labelExists);
    return (
      <div
        id="annotator-create-term"
        isOpen={this.props.show}
        toggle={this.onCancel}
        size="lg"
        style={{ width: "100%" }}
        className="p-3"
      >
        <div
          className="modal-header"
          style={{ paddingTop: 1, paddingRight: 0, paddingLeft: 0 }}
        >
          <h5>Vytvořit nový pojem</h5>
          {
            // i18n("glossary.form.header")
          }
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
                  Vytvořit
                  {/* {i18n("glossary.form.button.submit")} */}
                </Button>
                <Button
                  id="create-term-cancel"
                  color="outline-dark"
                  size="sm"
                  onClick={this.onCancel}
                >
                  Zrušit
                  {/* {i18n("glossary.form.button.cancel")} */}
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

// export default connect(
//   (state: TermItState) => ({ language: state.configuration.language }),
//   (dispatch: ThunkDispatch) => {
//     return {
//       createTerm: (term: Term, vocabularyIri: IRI) =>
//         dispatch(createTerm(term, vocabularyIri)),
//     };
//   },
//   undefined,
//   { forwardRef: true }
// )(
//   injectIntl(withI18n(CreateTermFromAnnotation, { forwardRef: true }), {
//     forwardRef: true,
//   })
// );

export default injectIntl(withI18n(CreateTermFromAnnotation)) as any;
