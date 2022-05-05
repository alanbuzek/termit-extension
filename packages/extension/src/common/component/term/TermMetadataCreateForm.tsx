import * as React from "react";
import withI18n, { HasI18n } from "../hoc/withI18n";
import Term, { TermData } from "../../model/Term";
import Utils from "../../util/Utils";
import { Col, Form, Row } from "reactstrap";
import TermTypesEdit from "./TermTypesEdit";
import VocabularyUtils from "../../util/VocabularyUtils";
import { injectIntl } from "react-intl";
import TermDefinitionBlockEdit from "./TermDefinitionBlockEdit";
import AttributeSectionContainer from "../layout/AttributeSectionContainer";
import StringListEdit from "../misc/StringListEdit";
import {
  getLocalized,
  getLocalizedOrDefault,
  getLocalizedPlural,
} from "../../model/MultilingualString";
import { checkLabelUniqueness } from "./TermValidationUtils";
import ShowAdvancedAssetFields from "../asset/ShowAdvancedAssetFields";
import TermScopeNoteEdit from "./TermScopeNoteEdit";
import ValidationResult from "../../model/form/ValidationResult";
import CustomInput from "../misc/CustomInput";
import { loadIdentifier } from "../../../api";
import { getPageUrl } from "../../../content/helper/url";

interface TermMetadataCreateFormProps extends HasI18n {
  onChange: (change: object, callback?: () => void) => void;
  definitionSelector?: () => void;
  termData: TermData;
  vocabularyIri: string;
  labelExist: { [lang: string]: boolean };
  language: string;
}

interface TermMetadataCreateFormState {
  generateUri: boolean;
}

export class TermMetadataCreateForm extends React.Component<
  TermMetadataCreateFormProps,
  TermMetadataCreateFormState
> {
  constructor(props: TermMetadataCreateFormProps) {
    super(props);
    this.state = {
      generateUri: true,
    };
  }

  public componentDidMount(): void {
    const label = this.props.termData.label;
    if (label) {
      this.resolveIdentifier(getLocalized(label));
    }
  }

  private onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.onPrefLabelChange(e.currentTarget.value);
  };

  private onPrefLabelChange = (prefLabel: string) => {
    this.resolveIdentifier(prefLabel);
    const label = Object.assign({}, this.props.termData.label);
    label[this.props.language] = prefLabel;
    const labelExist = Object.assign({}, this.props.labelExist);
    labelExist[this.props.language] = false;
    this.props.onChange({ label, labelExist });

    const prefLabelCurrent = getLocalized(
      this.props.termData.label,
      this.props.language
    ).toLowerCase();
    if (prefLabel.toLowerCase() === prefLabelCurrent) {
      return;
    }
    const vocabularyIri = VocabularyUtils.create(this.props.vocabularyIri);
    checkLabelUniqueness(vocabularyIri, prefLabel, this.props.language, () => {
      labelExist[this.props.language] = true;
      this.props.onChange({
        labelExist: Object.assign({}, this.props.labelExist, labelExist),
      });
    });
  };

  public onAltLabelsChange = (altLabels: string[]) => {
    const language = this.props.language;
    const change = {};
    change[language] = altLabels;
    this.props.onChange({
      altLabels: Object.assign({}, this.props.termData.altLabels, change),
    });
  };

  public onHiddenLabelsChange = (hiddenLabels: string[]) => {
    const language = this.props.language;
    const change = {};
    change[language] = hiddenLabels;
    this.props.onChange({
      hiddenLabels: Object.assign({}, this.props.termData.hiddenLabels, change),
    });
  };

  private onIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setIdentifier(e.currentTarget.value, () =>
      this.setState({ generateUri: false })
    );
  };

  private resolveIdentifier = (label: string) => {
    if (this.state.generateUri && label.length > 0) {
      const vocabularyIri = VocabularyUtils.create(this.props.vocabularyIri);
      loadIdentifier({
        name: label,
        contextIri: vocabularyIri.toString(),
        assetType: "TERM",
      }).then((response) => this.setIdentifier(response));
    }
  };

  private setIdentifier = (
    newUri: string,
    callback: () => void = () => null
  ) => {
    this.props.onChange({ iri: newUri }, callback);
  };

  public onTypeSelect = (types: string[]) => {
    this.props.onChange({ types });
  };

  public onParentSelect = (parentTerms: Term[]) => {
    this.props.onChange({ parentTerms });
  };

  public onSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const src = e.currentTarget.value;
    this.props.onChange({ sources: [src] });
  };

  public render() {
    const { termData, i18n, language } = this.props;
    const source = termData.sources
      ? Utils.sanitizeArray(termData.sources!).join()
      : undefined;
    const label = getLocalizedOrDefault(termData.label, "", language);
    const labelValidation = this.props.labelExist[language]
      ? ValidationResult.blocker(
          this.props.formatMessage("term.metadata.labelExists.message", {
            label,
          })
        )
      : undefined;

    return (
      <Form>
        <Row>
          <Col xs={12}>
            <CustomInput
              name="create-term-label"
              label={i18n("asset.label")}
              help={i18n("term.label.help")}
              hint={i18n("required")}
              onChange={this.onLabelChange}
              autoFocus={true}
              validation={labelValidation}
              value={label}
            />
          </Col>
        </Row>

        <div className="form-section">
          <TermDefinitionBlockEdit
            term={termData}
            onChange={this.props.onChange}
            language={language}
            definitionSelector={this.props.definitionSelector}
          />
        </div>

        <ShowAdvancedAssetFields>
          <Row>
            <Col xs={12}>
              <CustomInput
                name="edit-term-source"
                value={source}
                onChange={this.onSourceChange}
                label={i18n("term.metadata.source")}
                labelClass="definition"
                readOnly={false}
                help={i18n("term.source.help")}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <StringListEdit
                list={getLocalizedPlural(termData.altLabels, language)}
                onChange={this.onAltLabelsChange}
                i18nPrefix={"term.metadata.altLabels"}
              />
            </Col>
          </Row>

          <AttributeSectionContainer label={""}>
            <TermScopeNoteEdit
              term={termData}
              language={language}
              onChange={this.props.onChange}
            />
          </AttributeSectionContainer>

          <Row>
            <Col xs={12}>
              <TermTypesEdit
                termTypes={Utils.sanitizeArray(termData.types)}
                onChange={this.onTypeSelect}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <StringListEdit
                list={getLocalizedPlural(termData.hiddenLabels, language)}
                onChange={this.onHiddenLabelsChange}
                i18nPrefix={"term.metadata.hiddenLabels"}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <CustomInput
                name="create-term-iri"
                label={i18n("asset.iri")}
                help={this.props.i18n("term.iri.help")}
                onChange={this.onIdentifierChange}
                value={termData.iri}
              />
            </Col>
          </Row>
        </ShowAdvancedAssetFields>
      </Form>
    );
  }
}

export default injectIntl(withI18n(TermMetadataCreateForm)) as any;
