import BrowserApi from "./BrowserApi";
import { ExtensionMessage } from "./ExtensionMessage";

const runPageTextAnalysis = async (pageHtml: string, vocabulary?: string) => {
  const { termOccurrencesSelectors } = (await BrowserApi.sendMessage({
    type: ExtensionMessage.RunPageTextAnalysis,
    payload: {
      pageHtml,
      vocabulary,
    },
  })) as any;
  return termOccurrencesSelectors;
};

const setWaitingForAuth = async () => {
  await BrowserApi.sendMessage({
    type: ExtensionMessage.SetWaitingForAuth,
    payload: {},
  });
};

export default {
  runPageTextAnalysis,
  setWaitingForAuth,
};
