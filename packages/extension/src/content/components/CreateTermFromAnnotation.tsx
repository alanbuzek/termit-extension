import * as React from "react";
// import withI18n, { HasI18n } from "../hoc/withI18n";
// import Term, { TermData } from "../../model/Term";
import {
  // Button,
  ButtonToolbar,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Button from './Button';
// import TermMetadataCreateForm from "../term/TermMetadataCreateForm";
// import { injectIntl } from "react-intl";
// import { createTerm } from "../../action/AsyncTermActions";
// import { IRI } from "./VocabularyUtils";
// import AssetFactory from "../../util/AssetFactory";
// import { langString } from "../../model/MultilingualString";
// import TermItState from "../../model/TermItState";
// import { isTermValid, LabelExists } from "../term/TermValidationUtils";

const injectIntl = () => {};

export class CreateTermFromAnnotation extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(
      {},
      {},
      // AssetFactory.createEmptyTermData(props.language),
      { labelExists: {} }
    );
  }

  // /**
  //  * Part of public imperative API allowing to set label so that the whole term does not have to be kept in parent
  //  * component state.
  //  */
  // public setLabel(label: string) {
  //   this.setState({ label: langString(label.trim(), this.props.language) });
  // }

  // /**
  //  * Part of public imperative API allowing to set definition so that the whole term does not have to be kept in
  //  * parent component state.
  //  */
  // public setDefinition(definition: string) {
  //   this.setState({
  //     definition: langString(definition.trim(), this.props.language),
  //   });
  // }

  public onChange = (change: object, callback?: () => void) => {
    this.setState(change, callback);
  };

  public onSave = () => {
    // const newTerm = new Term(this.state);
    // this.props.createTerm(newTerm, this.props.vocabularyIri).then(() => {
    //   this.props.onTermCreated(newTerm);
    //   this.onCancel();
    // });
  };

  public onCancel = () => {
    // this.setState(AssetFactory.createEmptyTermData());
    // this.props.onClose();
  };

  public render() {
    const i18n = this.props.i18n;
    // const invalid = !isTermValid(this.state, this.state.labelExists);
    const invalid = false;
    return (
          <div className="flex">
              <Button
                id="create-term-submit"
                onClick={this.onSave}
                disabled={invalid}
                className="mr-2"
              >
                Add
              </Button>
              <Button
                id="create-term-cancel"
                onClick={this.onCancel}
                color="secondary"
              >
                Close
              </Button>
          </div>
    );
  }
}

export default CreateTermFromAnnotation;