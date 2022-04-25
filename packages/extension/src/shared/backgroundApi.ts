import { MessageType } from "../types/messageTypes";
import browserApi from "./BrowserApi";

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
