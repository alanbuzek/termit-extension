import React from 'react';
import { IntelligentTreeSelect } from 'intelligent-tree-select';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';

export const INSTANCE_LIST = [
  {
    termitServer: 'https://kbss.felk.cvut.cz/ann/sluzby/server/rest',
    termitUi: 'https://kbss.felk.cvut.cz/termit-ann',
    annotaceService: 'https://kbss.felk.cvut.cz/ann/sluzby/annotace',
    graphDb:
      'https://kbss.felk.cvut.cz/ann/sluzby/db/repositories/alan-termit-test2',
    label: 'Testování',
  },
  {
    termitServer: 'http://localhost:8080/termit/rest',
    termitUi: 'http://localhost:3000',
    annotaceService: 'http://localhost:8888',
    graphDb: 'http://localhost:7200/repositories/termit2',
    label: 'local',
  },
  {
    termitServer: 'https://kbss.felk.cvut.cz/ann/sluzby/server/rest',
    termitUi: 'https://kbss.felk.cvut.cz/termit-ann',
    annotaceService: 'http://localhost:8888',
    graphDb: 'http://kbss.felk.cvut.cz:47200/repositories/alan-termit-test2',
    label: 'remote, local annotace',
  },
];

export const DEFAULT_INSTANCE = INSTANCE_LIST[0];

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
      placeholder={i18n('extension.choose.instance.placeholder')}
      valueRenderer={(option) => option.label}
    />
  );
}
