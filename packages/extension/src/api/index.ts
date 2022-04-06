import { constants } from 'buffer';
import Term, { TermData, CONTEXT as TERM_CONTEXT } from "../common/model/Term";
import Vocabulary, {
  CONTEXT as VOCABULARY_CONTEXT,
  VocabularyData,
} from "../common/model/Vocabulary";
import { content, param, params } from "../common/util/Ajax";
import { Annotation } from "../common/util/Annotation";
import JsonLdUtils from "../common/util/JsonLdUtils";
import Utils from "../common/util/Utils";
import VocabularyUtils, { IRI } from "../common/util/VocabularyUtils";
import { mockTerms, mockTerms2 } from "./mockData/mockTerms";
import mockTypes from "./mockData/mockTypes";
import { mockVocabularies } from "./mockData/mockVocabularies";
import Constants from '../common/util/Constants'

// TODO: remove all Promise.resolve() statements and uncomment real back-end calls when ready
// TODO (optional): use fetch-mock or similar library to mock api server responses, will likely be needed to testing

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
// TODO: get this from some config file, env variable...
const serverUrl = "http://localhost:8080";

const callFetch = (path, config) => {
  return fetch(`${serverUrl}/${path}`, config).then((res) => res.json());
};

const api = {
  get(path, config = {}) {
    return callFetch(path, { ...fetchConfig, ...config, method: "GET" });
  },
  post(path, body, config = {}) {
    return callFetch(path, {
      ...fetchConfig,
      ...config,
      body: JSON.stringify(body),
      method: "POST",
    });
  },
  put(path, body, config = {}) {
    return callFetch(path, {
      ...fetchConfig,
      ...config,
      body: JSON.stringify(body),
      method: "GET",
    });
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

export function loadAllTerms(
  vocabularyIri: IRI,
  includeImported: boolean = false
) {
  const parameters = params(
    Object.assign({
      includeImported,
      namespace: vocabularyIri.namespace,
    })
  );

  console.log("paramaters: ", parameters);
  // api
  //   .get(`/vocabularies/${vocabularyIri.fragment}/terms`, parameters)
  return Promise.resolve(mockTerms2)
    .then((data: object[]) =>
      data.length !== 0
        ? JsonLdUtils.compactAndResolveReferencesAsArray<TermData>(
            data,
            TERM_CONTEXT
          )
        : []
    )
    .then((data: TermData[]) => {
      const terms: { [key: string]: Term } = {};
      data.forEach((d) => (terms[d.iri!] = new Term(d)));
      return terms;
    });
}

export function annotatePage(vocabulary, pageHtml) {
  return api.post("annotate?enableKeywordExtraction=true", {
    content: pageHtml,
    vocabularyRepository: vocabulary,
    vocabularyContexts: [],
    language: "cs",
  });
}

/**
 * Fetches RDFS:label of a resource with the specified identifier.
 * @param iri Resource identifier
 */
export function getLabel(iri: string) {
  // TODO: consider implementing labelCache later if needed
  // if (field === "label" && getState().labelCache[iri]) {
  //   return Promise.resolve(getState().labelCache[iri]);
  // }

  const mockDataLabel = "Decree No";

  return Promise.resolve(mockDataLabel);
  // return api.get("/data/label", param("iri", iri));
}

export async function createTermOccurrence(annotation: Annotation) {
  // TODO: save term occurrence to the backend
  return Promise.resolve();
}

export async function createDefinitionOccurrence(annotation: Annotation){
  // TODO
  return Promise.resolve();
}

export async function updateTermOccurrence(annotation: Annotation) {
  // TODO: update term occurrence to the backend
  return Promise.resolve();
}

export function loadTypes() {
  // TODO: add caching layer, at least within one browser session
  // return api
  //   .get("/language/types")

  return Promise.resolve(mockTypes)
    .then((data: object[]) =>
      data.length !== 0
        ? JsonLdUtils.compactAndResolveReferencesAsArray<TermData>(
            data,
            TERM_CONTEXT
          )
        : []
    )
    .then((data: TermData[]) => {
      return data.map((term: TermData) => {
        if (term.subTerms) {
          // @ts-ignore
          term.subTerms = Utils.sanitizeArray(term.subTerms).map(
            (subTerm) => subTerm.iri
          );
        }
        return new Term(term);
      });
    });
}

function resolveTermCreationUrl(term: Term, targetVocabularyIri: IRI) {
  let url = `/vocabularies/${targetVocabularyIri.fragment}/terms`;
  const parents = Utils.sanitizeArray(term.parentTerms);
  if (parents.length > 0) {
    // Use one of the parents, it does not matter which one
    url += `/${VocabularyUtils.create(parents[0].iri!).fragment}/subterms`;
  }
  return url;
}

export function createTerm(term: Term, vocabularyIri: IRI) {
  const url = resolveTermCreationUrl(term, vocabularyIri);
  const data = Object.assign(term.toJsonLd(), {
    vocabulary: {
      iri: vocabularyIri.namespace + vocabularyIri.fragment,
    },
  });

  return Promise.resolve();
  // return api.post(
  //   url,
  //   content(data)
  //     .contentType(Constants.JSON_LD_MIME_TYPE)
  //     .param("namespace", vocabularyIri.namespace)
  // )
}

export function removeOccurrence(annotation: Annotation){
  // TODO
  return Promise.resolve();
}

export default {
  loadVocabularies,
  annotatePage,
  loadAllTerms,
  getLabel,
  createTermOccurrence,
  loadTypes,
  createTerm,
  updateTermOccurrence,
  removeOccurrence,
  createDefinitionOccurrence
};
