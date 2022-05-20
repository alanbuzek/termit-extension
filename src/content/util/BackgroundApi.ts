import BrowserApi from '../../shared/BrowserApi';
import ExtensionMessage from '../../shared/ExtensionMessage';

/**
 * Wrapping message-passing calls to the background-script
 */
const BackgroundApi = {
  async runPageTextAnalysis(pageHtml: string, vocabulary?: string) {
    const { termOccurrencesSelectors } = (await BrowserApi.sendMessage({
      type: ExtensionMessage.RunPageTextAnalysis,
      payload: {
        pageHtml,
        vocabulary,
      },
    })) as any;
    return termOccurrencesSelectors;
  },
  setWaitingForAuth() {
    return BrowserApi.sendMessage({
      type: ExtensionMessage.SetWaitingForAuth,
      payload: {},
    });
  },
};

export default BackgroundApi;
