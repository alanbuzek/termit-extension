import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { ContentState } from "..";
import api from "../../api";
import Vocabulary from "../../common/model/Vocabulary";
import { Annotation } from '../../common/util/Annotation';
import PageSummary from "./PageSummery";

const SidebarApp = ({ state, handleAnnotatePage }) => {
  // TODO: state should not expose annotator and all its methods
  const annotations: Annotation[] = state.annotator?.getAnnotations();
  console.log('passed down state: ', state);
  return (
    <div
      className="h-full w-full p-3 overflow-x-auto"
      style={{ background: "#dddddd" }}
    >
      <PageSummary
        annotations={annotations}
        handleAnnotatePage={handleAnnotatePage}
      />
      {annotations?.map((annotation) => {
        return (
          <div className="shadow-md rounded-md p-3 border border-gray-400 mb-3 cursor-pointer bg-white hover:bg-gray-300">
            <div className="mb-0 text-lg font-semibold">
              {annotation.termOccurrence?.originalTerm}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarApp;
