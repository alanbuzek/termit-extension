import React from "react";
import { useI18n } from "../../common/component/hook/useI18n";
import { AnnotationIcon, PencilIcon } from "./Toolbar";

export default function AdderToolbar({ onMarkOccurrence, onMarkDefinition }) {
  const { i18n } = useI18n();

  return (
    <div className="flex text-sm">
      <div
        className="flex items-center flex-col justify-center hover:bg-gray-100 cursor-pointer py-2 px-3"
        onClick={onMarkOccurrence}
        style={{ width: 73 }}
      >
        <AnnotationIcon className="h-4 w-4 mb-1" />
        {i18n("extension.annotation.label")}
      </div>
      <div
        className="flex items-center justify-center flex-col hover:bg-gray-100 cursor-pointer py-2 px-3"
        onClick={onMarkDefinition}
        style={{ width: 73 }}
      >
        <PencilIcon className="h-4 w-4 mb-1" />
        {i18n("extension.annotation.definition")}
      </div>
    </div>
  );
}
