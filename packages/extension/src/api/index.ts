import Vocabulary, {
  CONTEXT as VOCABULARY_CONTEXT,
  VocabularyData,
} from "../common/model/Vocabulary";
import JsonLdUtils from "../common/util/JsonLdUtils";
import { mockVocabularies } from "./mockData/mockVocabularies";

const fetchConfig = {
  method: "POST",
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json",
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  redirect: "follow", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};
const serverUrl = "http://localhost:8888";

const callFetch = (path, config) => {
  return fetch(`${serverUrl}/${path}`, config).then((res) => res.json());
};

const api = {
  get(path, config = {}) {
    return callFetch(path, { ...fetchConfig, ...config, method: "GET" });
  },
  post(path, body, config = {}) {
    return callFetch(path, { ...fetchConfig, ...config, body, method: "POST" });
  },
  put(path, body, config = {}) {
    return callFetch(path, { ...fetchConfig, ...config, body, method: "GET" });
  },
  del(path, config = {}) {
    return callFetch(path, { ...fetchConfig, ...config, method: "DELETE" });
  },
};

export function loadVocabularies() {
  //   return api
  //     .get("/vocabularies")

  return Promise.resolve(mockVocabularies)
    .then((data: object[]) =>
      data.length !== 0
        ? JsonLdUtils.compactAndResolveReferencesAsArray<VocabularyData>(
            data,
            VOCABULARY_CONTEXT
          )
        : []
    )
    .then((data: VocabularyData[]) => data.map((v) => new Vocabulary(v)));
}

export function annotatePage(vocabulary, pageHtml) {
  return api.post("/annotate?enableKeywordExtraction=true", {
    content: pageHtml,
    vocabularyRepository: vocabulary,
    vocabularyContexts: [],
    language: "cs",
  });
}

export default {
  loadVocabularies,
  annotatePage
};
