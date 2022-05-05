import * as React from "react";
import { TermData } from "../../model/Term";
import ValidationResult from "../../model/ValidationResult";
import FormValidationResult from "../../model/form/ValidationResult";
import { Col, FormGroup, Label, Row } from "reactstrap";
import TextArea from "../misc/TextArea";
import { getLocalizedOrDefault } from "../../model/MultilingualString";
import VocabularyUtils from "../../util/VocabularyUtils";
import { useI18n } from "../hook/useI18n";
import Button from "../../../content/components/Button";

interface TermDefinitionBlockEditProps {
  term: TermData;
  language: string;
  definitionSelector: () => void;
  getValidationResults?: (property: string) => ValidationResult[];
  onChange: (change: Partial<TermData>) => void;
  readOnly?: boolean;
}

export const TermDefinitionBlockEdit: React.FC<TermDefinitionBlockEditProps> = (
  props
) => {
  const { term, language, getValidationResults, onChange, readOnly } = props;
  const { i18n, locale } = useI18n();
  const onDefinitionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const change = {};
    change[language] = value;
    onChange({ definition: Object.assign({}, term.definition, change) });
  };
  const validationDefinition = getValidationResults!(
    VocabularyUtils.DEFINITION
  );

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="flex justify-between items-center">
            <Label className="attribute-label definition">
              {i18n("term.metadata.definition.text")}
            </Label>
            <Button
              color="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.definitionSelector();
              }}
            >
              {i18n("annotator.createTerm.selectDefinition")}
            </Button>
          </div>
          <TextArea
            name="edit-term-definition"
            value={getLocalizedOrDefault(term.definition, "", language)}
            readOnly={readOnly}
            validation={validationDefinition.map((v) =>
              FormValidationResult.fromOntoValidationResult(v, locale)
            )}
            onChange={onDefinitionChange}
            rows={4}
            help={i18n("term.definition.help")}
          />
        </Col>
      </Row>
    </>
  );
};

TermDefinitionBlockEdit.defaultProps = {
  getValidationResults: () => [],
  readOnly: false,
};

export default TermDefinitionBlockEdit;
