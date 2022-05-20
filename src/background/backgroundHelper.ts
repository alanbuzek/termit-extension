import { DEFAULT_INSTANCE } from '../content/component/shared/InstanceSelection';
import { cachedCall } from '../shared/api/cache';
import BrowserApi from '../shared/BrowserApi';
import Vocabulary, {
  VocabularyData,
  CONTEXT as VOCABULARY_CONTEXT,
} from '../termit-ui-common/model/Vocabulary';
import Ajax, { content } from '../termit-ui-common/util/Ajax';
import Constants from '../termit-ui-common/util/Constants';
import JsonLdUtils from '../termit-ui-common/util/JsonLdUtils';

// NOTE: ideally, it would be great to have all API calls in one central place, but there are some quirks with how
// background service worker work, and when importing from src/shared/api/index.ts, it fails because of a transitive import

// move this into a separte file
async function runPageAnnotationAnalysis(
  pageHtml: string,
  vocabulary?: string
) {
  const instance = await BrowserApi.storage.get(
    Constants.STORAGE.TERMIT_INSTANCE
  );

  const vocabularyRepository = instance?.graphDb || DEFAULT_INSTANCE.graphDb;
  const payload: any = {
    content: pageHtml,
    vocabularyContexts: [],
    language: 'cs',
    vocabularyRepository,
  };
  if (vocabulary) {
    payload.vocabularyContexts.push(vocabulary);
  }

  const annotaceApi = new Ajax({
    baseURL: instance?.annotaceService || DEFAULT_INSTANCE.annotaceService,
  });

  return annotaceApi.post(
    '/annotate-to-occurrences',
    content(payload)
      .param('enableKeywordExtraction', 'true')
      .accept(Constants.JSON_MIME_TYPE)
      .contentType(Constants.JSON_MIME_TYPE)
  );
}

const loadVocabularies = cachedCall('vocabularies', async () => {
  const instance = await BrowserApi.storage.get(
    Constants.STORAGE.TERMIT_INSTANCE
  );

  const termitApi = new Ajax({
    baseURL: instance?.termitServer || Constants.TERMIT_SERVER_URL,
  });

  const vocabularies = await termitApi
    .get('/vocabularies')
    // eslint-disable-next-line @typescript-eslint/ban-types
    .then((data: object[]) =>
      data.length !== 0
        ? JsonLdUtils.compactAndResolveReferencesAsArray<VocabularyData>(
            data,
            VOCABULARY_CONTEXT
          )
        : []
    )
    .then((data: VocabularyData[]) =>
      data.map((v) => new Vocabulary(v).mapToMinifiedVersion())
    );

  return vocabularies;
});

export default {
  loadVocabularies,
  runPageAnnotationAnalysis,
};
