import * as React from 'react';
import { Col, Row } from 'reactstrap';
import { TermData } from '../../model/Term';
import TextArea from '../misc/TextArea';
import { getLocalizedOrDefault } from '../../model/MultilingualString';
import { useI18n } from '../hook/useI18n';
import MultilingualIcon from '../misc/MultilingualIcon';

interface TermScopeNoteEditProps {
  term: TermData;
  language: string;
  onChange: (change: Partial<TermData>) => void;
}

export const TermScopeNoteEdit: React.FC<TermScopeNoteEditProps> = (props) => {
  const { term, language, onChange } = props;
  const { i18n } = useI18n();
  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const change = {};
    change[language] = value;
    onChange({ scopeNote: { ...term.scopeNote, ...change } });
  };
  return (
    <>
      <Row>
        <Col xs={12}>
          <TextArea
            name="create-term-comment"
            label={i18n('term.metadata.comment')}
            labelClass="attribute-label"
            type="textarea"
            rows={4}
            value={getLocalizedOrDefault(term.scopeNote, '', language)}
            help={i18n('term.comment.help')}
            onChange={onTextChange}
          />
        </Col>
      </Row>
    </>
  );
};

export default TermScopeNoteEdit;
