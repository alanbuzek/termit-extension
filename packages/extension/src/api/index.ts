import { constants } from "buffer";
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
import Constants from "../common/util/Constants";
import mockExistingOccurrences from "./mockData/mockExistingOccurrences";

// TODO: remove all Promise.resolve() statements and uncomment real back-end calls when ready
// TODO (optional): use fetch-mock or similar library to mock api server responses, will likely be needed to testing

const defaultTermitHeaders = {
  "Content-Type": "application/json",
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXJtaXQtYWRtaW5Aa2Jzcy5mZWxrLmN2dXQuY3oiLCJqdGkiOiJodHRwOi8vb250by5mZWwuY3Z1dC5jei9vbnRvbG9naWVzL2FwcGxpY2F0aW9uL3Rlcm1pdC9zeXN0ZW0tYWRtaW4tdXNlciIsImlhdCI6MTY0OTg3NDA3NCwiZXhwIjoxNjQ5OTYwNDc0LCJyb2xlIjoiUk9MRV9GVUxMX1VTRVItUk9MRV9BRE1JTi1ST0xFX1JFU1RSSUNURURfVVNFUiJ9.2EzsVO6Ajr18ZiE2JJR2UA34KLGoXcJqfJgYVImfxZA",
  Accept: "application/ld+json",
  // 'Content-Type': 'application/x-www-form-urlencoded',
};
const fetchConfig = {
  method: "POST",
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: new Headers(defaultTermitHeaders),
  redirect: "follow", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};

const annotaceFetchConfig = {
  method: "POST",
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: new Headers({
    "Content-Type": "application/json",
    // Accept: "application/ld+json",
    // 'Content-Type': 'application/x-www-form-urlencoded',
  }),
  redirect: "follow", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};

const callFetch = (rootUrl: string, path: string, config) => {
  console.log("config: ", config);
  return fetch(`${rootUrl}${path}`, config).then((res) => res.json());
};

const createApi = (rootUrl: string, isAnnotace: boolean = false) => ({
  get(path, config = {}) {
    return callFetch(rootUrl, path, {
      ...(isAnnotace ? annotaceFetchConfig : fetchConfig),
      ...config,
      method: "GET",
    });
  },
  post(path, body, config = {}) {
    return callFetch(rootUrl, path, {
      ...(isAnnotace ? annotaceFetchConfig : fetchConfig),
      ...config,
      body: body ? JSON.stringify(body) : null,
      method: "POST",
    });
  },
  put(path, body, config = {}) {
    return callFetch(rootUrl, path, {
      ...(isAnnotace ? annotaceFetchConfig : fetchConfig),
      ...config,
      body: JSON.stringify(body),
      method: "GET",
    });
  },
  del(path, config = {}) {
    return callFetch(rootUrl, path, {
      ...(isAnnotace ? annotaceFetchConfig : fetchConfig),
      ...config,
      method: "DELETE",
    });
  },
});

// TODO: get these from some config file, env variable...
const termitServerUrl = "http://localhost:8082/termit/rest";
const annotaceServerUrl = "http://localhost:8080";

const termitApi = createApi(termitServerUrl);
const annotaceApi = createApi(annotaceServerUrl, true);

export function loadVocabularies() {
  return (
    termitApi
      .get("/vocabularies")
      // return Promise.resolve(mockVocabularies)
      .then((data: object[]) => {
        console.log("mockVocabularies: ", mockVocabularies);
        console.log("data: ", data);

        return data.length !== 0
          ? JsonLdUtils.compactAndResolveReferencesAsArray<VocabularyData>(
              data,
              VOCABULARY_CONTEXT
            )
          : [];
      })
      .then((data: VocabularyData[]) => {
        console.log(
          "RESULT: ",
          data.map((v) => new Vocabulary(v))
        );
        return data.map((v) => new Vocabulary(v));
      })
  );
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
  // termitApi
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

export function runPageAnnotationAnalysis(
  vocabulary: string,
  pageHtml: string
) {
  return annotaceApi.post("/annotate?enableKeywordExtraction=true", {
    content: pageHtml,
    vocabularyRepository: vocabulary,
    vocabularyContexts: [],
    language: "cs",
  });
}

export function savePageAnnotationResults(pageAnnotationAnalysisResult: any) {
  // TODO: persist this to a new endpoint
  return Promise.resolve();
}

// TODO: move interface elsewhere
export interface Website {
  // TODO: adjust when finalized in termit
  url: string;
  iri?: string;
  document?: string;
}

/**
 * Creates a website file within a resource (vocabulary)
 */
export async function createWebsiteInDocument(
  website: Website,
  documentIri: IRI
) {
  const websiteIri = await loadIdentifier({
    name: website.url,
    contextIri: documentIri,
    assetType: "WEBSITE",
  });

  website.iri = websiteIri;

  // TODO: transform website into a format that we need
  // await termitApi.post(`/resources/${documentIri.fragment}/websites`, content(website).param("namespace", documentIri.namespace));

  return website;
}

export async function getExistingWebsite(url: string) {
  // TODO: create endpoint
  // const website =  await termitApi.get(`/resources/websites`, { url });
  // TODO: add caching
  let website: Website | null = null;

  if (url === "http://www.lubina.cz/historie/14/geologie-flora") {
    website = {
      url,
      document: "http://onto.fel.cvut.cz/ontologies/slovnik/023/document",
    };
  }
  return website;
}

export async function getWebsitesTermOccurrences(website: Website) {
  // TODO: add endpoint
  const map = {};

  mockExistingOccurrences.forEach(({ termOccurrence, term }) => {
    termOccurrence.term = term;
    if (!map[termOccurrence.cssSelector]) {
      map[termOccurrence.cssSelector] = [];
    }
    map[termOccurrence.cssSelector].push(termOccurrence);
  });

  const result: any[] = [];
  Object.entries(map).forEach(([key, value]) => {
    result.push({
      cssSelectors: [key],
      termOccurrences: value,
    });
  });

  console.log("transformed result: ", result);
  return Promise.resolve(result);
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
  // return termitApi.get("/data/label", param("iri", iri));
}

export async function createTermOccurrence(annotation: Annotation) {
  // TODO: save term occurrence to the backend
  return Promise.resolve();
}

export async function createDefinitionOccurrence(annotation: Annotation) {
  // TODO
  return Promise.resolve();
}

export async function updateTermOccurrence(annotation: Annotation) {
  // TODO: update term occurrence to the backend
  return Promise.resolve();
}

export function loadTypes() {
  // TODO: add caching layer, at least within one browser session
  // return termitApi
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

  return termitApi.post(url + `?namespace=${vocabularyIri.namespace}`, data, {
    headers: new Headers({
      ...defaultTermitHeaders,
      "Content-Type": Constants.JSON_LD_MIME_TYPE,
    }),
  });
}

export function removeOccurrence(annotation: Annotation) {
  // TODO
  return Promise.resolve();
}

export function loadIdentifier<T extends { name: string; assetType: string }>(
  parameters: T
) {
  return termitApi.post(
    `/identifiers?${Object.entries(parameters).map(
      ([key, value]) => `${key}=${value}`
    ).join('&')}`,
    null
  );
}

export default {
  loadVocabularies,
  runPageAnnotationAnalysis,
  loadAllTerms,
  getLabel,
  createTermOccurrence,
  loadTypes,
  createTerm,
  updateTermOccurrence,
  removeOccurrence,
  createDefinitionOccurrence,
  savePageAnnotationResults,
  createWebsiteInDocument,
  getExistingWebsite,
  getWebsitesTermOccurrences,
  loadIdentifier,
};
