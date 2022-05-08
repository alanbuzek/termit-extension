import React from "react";
import { useI18n } from "../../common/component/hook/useI18n";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import { useState } from "react";

export const INSTANCE_LIST = [
  {
    termitServer: "http://localhost:8080/termit/rest",
    termitUi: "http://localhost:3000",
    annotaceService: "http://localhost:8888",
    label: "local",
  },
  {
    termitServer: "https://kbss.felk.cvut.cz/termit-server-demo/rest",
    termitUi: "https://kbss.felk.cvut.cz/termit-server-demo",
    annotaceService: "https://kbss.felk.cvut.cz/termit-server-demo",
    label: "server-demo",
  },
  {
    termitServer: "https://kbss.felk.cvut.cz/termit-server-dev/rest",
    termitUi: "https://kbss.felk.cvut.cz/termit-server-dev",
    annotaceService: "https://kbss.felk.cvut.cz/termit-server-demo",
    label: "server-dev",
  },
  {
    termitServer: "https://termit.fel.cvut.cz/service/ipr/termit/rest",
    termitUi: "https://termit.fel.cvut.cz/service/ipr/termit",
    annotaceService: "https://kbss.felk.cvut.cz/termit-server-demo",
    label: "service-ipr",
  },
  {
    termitServer: "https://kbss.felk.cvut.cz/termit-server-stage/rest",
    termitUi: "https://kbss.felk.cvut.cz/termit-server-stage",
    annotaceService: "https://kbss.felk.cvut.cz/termit-server-demo",
    label: "server-stage",
  },
  {
    termitServer: "https://termit.fel.cvut.cz/dev/service/ipr/termit/rest",
    termitUi: "https://termit.fel.cvut.cz/dev/service/ipr/termit",
    annotaceService: "https://kbss.felk.cvut.cz/termit-server-demo",
    label: "dev-service-ipr",
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
