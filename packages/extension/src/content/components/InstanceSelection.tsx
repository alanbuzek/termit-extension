import React from "react";
import { useI18n } from "../../common/component/hook/useI18n";
import { IntelligentTreeSelect } from "intelligent-tree-select";

export const INSTANCE_LIST = [
  {
    termitServer: "http://kbss.felk.cvut.cz:48080/termit/rest",
    termitUi: "http://kbss.felk.cvut.cz:43000",
    annotaceService: "http://kbss.felk.cvut.cz:48888",
    label: "Testování",
  },
  {
    termitServer: "http://localhost:8080/termit/rest",
    termitUi: "http://localhost:3000",
    annotaceService: "http://localhost:8888",
    label: "local",
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
      expanded={true}
      renderAsTree={false}
      placeholder={i18n('"extension.choose.vocabulary.placeholder"')}
      valueRenderer={(option) => option.label}
    />
  );
}
