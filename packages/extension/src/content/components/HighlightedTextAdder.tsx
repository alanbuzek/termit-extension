import React from "react";
import { AnnotationIcon, PencilIcon } from "./Toolbar";


export default function AdderToolbar({
  onMarkOccurrence,
  onMarkDefinition
}) {
  return (
    <div className="flex text-sm">
      <div className="flex items-center flex-col justify-center hover:bg-gray-100 cursor-pointer py-2 px-3"  onClick={onMarkOccurrence} style={{ width: 73 }}>
        <AnnotationIcon className="h-4 w-4 mb-1" />
        Label
      </div>
      <div className="flex items-center justify-center flex-col hover:bg-gray-100 cursor-pointer py-2 px-3" onClick={onMarkDefinition} style={{ width: 73 }}>
        <PencilIcon className="h-4 w-4 mb-1"  />
        Definition
      </div>
    </div>
  );
}
