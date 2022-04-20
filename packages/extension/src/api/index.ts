import { constants } from "buffer";
import Term, { TermData, CONTEXT as TERM_CONTEXT } from "../common/model/Term";
import Vocabulary, {
  CONTEXT as VOCABULARY_CONTEXT,
  VocabularyData,
} from "../common/model/Vocabulary";
import Ajax, { content, contentType, param, params } from "../common/util/Ajax";
import { Annotation } from "../common/util/Annotation";
import JsonLdUtils from "../common/util/JsonLdUtils";
import Utils from "../common/util/Utils";
import VocabularyUtils, { IRI } from "../common/util/VocabularyUtils";
import mockTypes from "./mockData/mockTypes";
import Constants from "../common/util/Constants";
import mockExistingOccurrences from "./mockData/mockExistingOccurrences";
import Website from "../common/model/Website";
import browserApi from "../shared/browserApi";
import { cachedCall } from "./cache";
import TermOccurrence, {
  TermOccurrenceData,
  CONTEXT as OCCURRENCE_CONTEXT,
  CssSelector,
} from "../common/model/TermOccurrence";

// TODO: remove all Promise.resolve() statements and uncomment real back-end calls when ready
// TODO (optional): use fetch-mock or similar library to mock api server responses, will likely be needed to testing

const termitApi = new Ajax({ baseURL: Constants.TERMIT_SERVER_URL });
const annotaceApi = new Ajax({ baseURL: Constants.ANNOTACE_SERVER_URL });

export const loadVocabularies = cachedCall("vocabularies", async () => {
  const vocabularies = await termitApi
    .get("/vocabularies")
    .then((data: object[]) => {
      return data.length !== 0
        ? JsonLdUtils.compactAndResolveReferencesAsArray<VocabularyData>(
            data,
            VOCABULARY_CONTEXT
          )
        : [];
    })
    .then((data: VocabularyData[]) => {
      return data.map((v) => new Vocabulary(v));
    });

  return vocabularies;
});

export function loadAllTerms(
  vocabularyIri: IRI,
  includeImported: boolean = false
) {
  const parameters = params({
    includeImported,
    namespace: vocabularyIri.namespace,
  });

  return (
    termitApi
      .get(`/vocabularies/${vocabularyIri.fragment}/terms`, parameters)
      // return Promise.resolve(mockTerms2)
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
      })
  );
}

export function runPageAnnotationAnalysis(
  vocabulary: string,
  pageHtml: string
) {
  return annotaceApi.post(
    "/annotate",
    content({
      content: pageHtml,
      vocabularyRepository: vocabulary,
      vocabularyContexts: [],
      // TODO: language
      language: "cs",
    })
      .param("enableKeywordExtraction", "true")
      .accept(Constants.JSON_MIME_TYPE)
      .contentType(Constants.JSON_MIME_TYPE)
  );
}

export async function savePageAnnotationResults(
  pageAnnotationAnalysisResult: any,
  website: Website
) {
  // TODO: persist this to a new endpoint
  await createTermOccurrence(website);
  return Promise.resolve();
}

// TODO: move interface elsewhere

/**
 * Creates a website file within a resource (vocabulary)
 */
export async function createWebsiteInDocument(url: string, documentIri: IRI) {
  const website = new Website({ url });

  // TODO: maybe don't need to load the identifier again?
  const websiteIri = await loadIdentifier({
    name: url,
    contextIri: documentIri,
    assetType: "WEBSITE",
  });

  website.label = `Website at ${url}`;
  website.iri = websiteIri;

  // TODO: transform website into a format that we need
  await termitApi.post(
    `/resources/${documentIri.fragment}/websites`,
    content(website.toJsonLd()).param("namespace", documentIri.namespace)
  );

  return website;
}

export async function getExistingWebsite(
  url: string,
  vocabularies: Vocabulary[]
): Promise<{ website: Website; vocabulary: Vocabulary } | null> {
  // TODO: this doesn't do any back-end work as of now, check if this is ok?
  const foundVocabulary = vocabularies.find((vocab) => {
    return vocab.document?.websites.find((website) => website.url === url);
  });
  if (!foundVocabulary) {
    return null;
  }
  const foundWebsite = foundVocabulary.document?.websites.find(
    (website) => website.url === url
  );

  return Promise.resolve({
    website: foundWebsite!,
    vocabulary: foundVocabulary,
  });
}

export async function getWebsiteTermOccurrences(
  website: Website
): Promise<TermOccurrence[][]> {
  // TODO: add endpoint
  const map = {};
  const websiteIRI: IRI = VocabularyUtils.create(website.iri);
  const existingOccurrences: TermOccurrence[] = await termitApi
    .get(
      `/occurrence/resources/${websiteIRI.fragment}?namespace=${websiteIRI.namespace}`,
      params({ namespace: websiteIRI.namespace })
    )
    .then((data: object[]) =>
      data.length !== 0
        ? JsonLdUtils.compactAndResolveReferencesAsArray<TermOccurrenceData>(
            data,
            OCCURRENCE_CONTEXT
          )
        : []
    )
    .then((data: TermOccurrenceData[]) =>
      data.map((d) => new TermOccurrence(d))
    );

  // group to optimize for mark.js, maybe later removed
  const selectorMap = {};
  existingOccurrences
    // TODO: this filtering to be later done on the back-end in SPARQL
    .filter((occurrence) => {
      return occurrence.target.source.iri === website.iri;
    })
    .forEach((occurrence) => {
      const cssSelector = occurrence.target.selectors.find((selector) =>
        selector.types.includes(VocabularyUtils.CSS_SELECTOR)
      ) as CssSelector;
      if (!cssSelector){
        console.log('NO CSS selectors: ', occurrence.target.selectors, ', occurrence: ', occurrence);
      } else {
        console.log('css selector found: ', cssSelector);
      }

      if (!selectorMap[cssSelector.value]) {
        selectorMap[cssSelector.value] = [];
      }
      selectorMap[cssSelector.value].push(occurrence);
    });

  return Object.values(selectorMap);
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

  return termitApi.post(
    url,
    content(data)
      .contentType(Constants.JSON_LD_MIME_TYPE)
      .param("namespace", vocabularyIri.namespace)
  );
}

export async function createTermOccurrence(website: Website, term?: Term) {
  const websiteIRI: IRI = VocabularyUtils.create(website.iri);

  return termitApi.post(
    `/occurrence`,
    params({
      namespace: websiteIRI.namespace,
      websiteFragment: websiteIRI.fragment,
      // TODO:
      // termFragment: term ? VocabularyUtils.create(term.iri).fragment : null,
    }).contentType(Constants.JSON_MIME_TYPE)
  );
  // TODO
  // const url = resolveTermCreationUrl(term, vocabularyIri);
  // const data = Object.assign(term.toJsonLd(), {
  //   vocabulary: {
  //     iri: vocabularyIri.namespace + vocabularyIri.fragment,
  //   },
  // });
  // const resourceIRI = VocabularyUtils.create(
  //   "http://onto.fel.cvut.cz/ontologies/slovnik/my-new-slovnik/document/soubor/rozvrh.png"
  // );
  // return termitApi.post(
  //   `/vocabularies/${vocabularyIri.fragment}/occurrences?namespace=${vocabularyIri.namespace}&resourceNormalizedName=${resourceIRI.fragment}`,
  //   null,
  //   {
  //     headers: new Headers({
  //       ...defaultTermitHeaders,
  //       // "Content-Type": Constants.JSON_LD_MIME_TYPE,
  //     }),
  //   }
  // );
}
export function removeOccurrence(annotation: Annotation) {
  // TODO
  return Promise.resolve();
}

export function loadIdentifier<T extends { name: string; assetType: string }>(
  parameters: T
) {
  return termitApi.post(`/identifiers`, params(parameters));
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
  getWebsiteTermOccurrences,
  loadIdentifier,
};
