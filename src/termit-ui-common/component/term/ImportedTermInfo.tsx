import * as React from 'react';
import { GoFileSymlinkDirectory } from 'react-icons/go';
import { UncontrolledTooltip } from 'reactstrap';
import Term from '../../model/Term';
import AssetLabel from '../misc/AssetLabel';
import { useI18n } from '../hook/useI18n';
import Utils from '../../util/Utils';

interface ImportedTermInfoProps {
  term: Term;
}

const ImportedTermInfo: React.FC<ImportedTermInfoProps> = (props) => {
  const { i18n } = useI18n();
  const id = `imported-term-info-${Utils.hashCode(props.term.iri)}`;
  return (
    <div className="imported-term-info" id={id}>
      <UncontrolledTooltip target={id}>
        {i18n('glossary.importedTerm.tooltip')}
        &nbsp;
        {props.term.label.cs}
        <AssetLabel iri={props.term.vocabulary!.iri!} />
      </UncontrolledTooltip>
      <GoFileSymlinkDirectory />
    </div>
  );
};

export default ImportedTermInfo;
