import { MessageType } from "../types";
import browserApi from "./browserApi";

// TODO: probably no longer needed
const getPageAnnotations = async (vocabulary: string, pageHtml: string) => {
  const { termOccurrencesSelectors } = (await browserApi.sendMessage({
    type: MessageType.GetPageAnnotationsAnalysis,
    payload: {
      pageHtml,
      // vocabularyIri
      vocabulary,
    },
  })) as any;
  return termOccurrencesSelectors;
};

export default {
  getPageAnnotations,
};
