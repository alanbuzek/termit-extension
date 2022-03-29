import { MessageType } from "../types";
import browserApi from "./browserApi";

const getPageAnnotations = async (vocabulary: string, pageHtml: string) => {
  const { termOccurrencesSelectors } = (await browserApi.sendMessage({
    type: MessageType.GetAnnotations,
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
