import * as React from 'react';
import { getLocalized } from '../../model/MultilingualString';

import Term, { TermInfo } from '../../model/Term';
import User from '../../model/User';
import { getShortLocale } from '../../util/IntlUtil';
import VocabularyUtils from '../../util/VocabularyUtils';
import { useI18n } from '../hook/useI18n';
import AssetLink from '../misc/AssetLink';
import OutgoingLink from '../misc/OutgoingLink';

interface TermLinkProps {
  term: Term | TermInfo;
  id?: string;
  language?: string;
  activeTab?: string;
  instance?;
}

export function getTermPath(term: Term | TermInfo, instance?) {
  return getTermPathWithTab(term, instance);
}

function getTermPathWithTab(term: Term | TermInfo, instance?) {
  const vocIri = VocabularyUtils.create(term.vocabulary!.iri!);
  const iri = VocabularyUtils.create(term.iri);

  if (!instance){
    return '';
  }

  return `${instance.termitUi}/#/vocabularies/${vocIri.fragment}/terms/${iri.fragment}`;
}

export const TermLink: React.FC<TermLinkProps> = (props) => {
  const { term, id, language } = props;
  const { i18n, locale } = useI18n();
  const label = getLocalized(term.label, language || getShortLocale(locale));
  if (!term.vocabulary) {
    // This can happen e.g. when FTS returns a term in the predefined language used for term types
    return <OutgoingLink label={label} iri={term.iri} />;
  }
  const path = getTermPathWithTab(term, props.instance);
  // Make a copy of the term with a simple localized label for the AssetLink component
  const t = { ...term, label };

  return (
    <AssetLink
      id={id}
      asset={t}
      path={path}
      tooltip={i18n('asset.link.tooltip')}
    />
  );
};

export default TermLink;
