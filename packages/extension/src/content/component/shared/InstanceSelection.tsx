import React from 'react';
import { IntelligentTreeSelect } from 'intelligent-tree-select';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';

export const INSTANCE_LIST = [
  {
    termitServer: 'https://kbss.felk.cvut.cz:48080/termit/rest',
    termitUi: 'https://kbss.felk.cvut.cz:43000',
    annotaceService: 'https://kbss.felk.cvut.cz:48888',
    graphDb: 'https://kbss.felk.cvut.cz:47200/repositories/termit',
    label: 'Testování',
  },
  {
    termitServer: 'http://kbss.felk.cvut.cz:48080/termit/rest',
    termitUi: 'http://kbss.felk.cvut.cz:43000',
    annotaceService: 'http://kbss.felk.cvut.cz:48888',
    graphDb: 'http://kbss.felk.cvut.cz:47200/repositories/termit',
    label: 'Testování - http',
  },
  {
    termitServer: 'http://localhost:8080/termit/rest',
    termitUi: 'http://localhost:3000',
    annotaceService: 'http://localhost:8888',
    graphDb: 'http://alanbuzek.local:7200/repositories/termitrepo',
    label: 'local',
  },
];

export default function InstanceSelection({
  instanceSelected,
  setInstanceSelected,
}) {
  const { i18n } = useI18n();

  return (
    <IntelligentTreeSelect
      onChange={(value) => {
        setInstanceSelected(value || undefined);
      }}
      value={instanceSelected}
      options={INSTANCE_LIST}
      valueKey="label"
      getOptionLabel={(option) => option.label}
      showSettings={false}
      maxHeight={200}
      multi={false}
      displayInfoOnHover={false}
      expanded
      renderAsTree={false}
      placeholder={i18n('"extension.choose.vocabulary.placeholder"')}
      valueRenderer={(option) => option.label}
    />
  );
}