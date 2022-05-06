import { MessageType } from "../types/messageTypes";
import browserApi from "./BrowserApi";

const runPageTextAnalysis = async (vocabulary: string, pageHtml: string) => {
  const { termOccurrencesSelectors } = (await browserApi.sendMessage({
    type: MessageType.RunPageTextAnalysis,
    payload: {
      pageHtml,
      vocabulary,
    },
  })) as any;
  return termOccurrencesSelectors;
};

export default {
  runPageTextAnalysis,
};
