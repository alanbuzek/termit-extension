import Term, { TermData, CONTEXT as TERM_CONTEXT } from "../common/model/Term";
import Vocabulary, {
  CONTEXT as VOCABULARY_CONTEXT,
  VocabularyData,
} from "../common/model/Vocabulary";
import Ajax, { content, contentType, param, params } from "../common/util/Ajax";
import { Annotation } from "../common/util/Annotation";
import JsonLdUtils from "../common/util/JsonLdUtils";
import Utils from "../common/util/Utils";
import VocabularyUtils, { IRI, IRIImpl } from "../common/util/VocabularyUtils";
import Constants from "../common/util/Constants";
import Website from "../common/model/Website";
import { cachedCall } from "./cache";
import TermOccurrence, {
  TermOccurrenceData,
  CONTEXT as OCCURRENCE_CONTEXT,
} from "../common/model/TermOccurrence";
import BrowserApi from "../shared/BrowserApi";
import User, { UserData } from "../common/model/User";
import { TermsMap } from "../content";
import { DocumentData } from "../common/model/Document";

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

  return termitApi
    .get(`/vocabularies/${vocabularyIri.fragment}/terms`, parameters)
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
  termOccurrences: TermOccurrence[],
  website: Website,
  vocabularyIri: string
) {
  if (termOccurrences.length > 0) {
    await saveTermOccurrences(
      termOccurrences,
      website,
      // TODO: make this more versetile
      VocabularyUtils.SUGGESTED_TERM_OCCURRENCE,
      vocabularyIri
    );
  }
}

// TODO: move interface elsewhere

/**
 * Creates a website file within a resource (vocabulary)
 */
export async function createWebsiteInDocument(url: string, documentIRI: IRI) {
  const website = new Website({ url });

  const websiteIri = await loadIdentifier({
    name: url,
    contextIri: documentIRI.toString(),
    assetType: "WEBSITE",
  });

  website.label = `Website at ${url}`;
  website.iri = websiteIri;

  await termitApi.post(
    `/resources/${documentIRI.fragment}/websites`,
    content(website.toJsonLd()).param("namespace", documentIRI.namespace)
  );

  return website;
}

export async function removeWebsiteFromDocument(
  document: DocumentData,
  website: Website
) {
  const websiteIRI = VocabularyUtils.create(website.iri);
  const documentIRI = VocabularyUtils.create(document.iri);

  await termitApi.delete(
    `/resources/${documentIRI.fragment}/websites/${websiteIRI.fragment}`,
    param("namespace", websiteIRI.namespace)
  );

  return website;
}

export async function removeSuggestedOccurrences(
  document: DocumentData,
  website: Website
) {
  const websiteIRI = VocabularyUtils.create(website.iri);
  const documentIRI = VocabularyUtils.create(document.iri);

  await termitApi.delete(
    `/resources/${documentIRI.fragment}/websites/${websiteIRI.fragment}/suggestions`,
    param("namespace", websiteIRI.namespace)
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
  website: Website,
  terms: TermsMap
): Promise<TermOccurrence[]> {
  const websiteIRI: IRI = VocabularyUtils.create(website.iri);
  return termitApi
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

export function loadTypes() {
  // TODO: add caching layer, at least within one browser session
  // return

  return termitApi
    .get("/language/types")
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
    })
    .then((result) => {
      const map = {};
      result.forEach((v) => (map[v.iri] = v));
      return map;
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

export function loadTerm(termNormalizedName: string, vocabularyIri: IRI) {
  return termitApi
    .get(
      `/vocabularies/${vocabularyIri.fragment}/terms/${termNormalizedName}`,
      param("namespace", vocabularyIri.namespace)
    )
    .then((data: object) =>
      JsonLdUtils.compactAndResolveReferences<TermData>(data, TERM_CONTEXT)
    )
    .then((data: TermData) => new Term(data));
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

export function updateTerm(term: Term) {
  const termIri = VocabularyUtils.create(term.iri);
  const vocabularyIri = VocabularyUtils.create(term.vocabulary!.iri!);
  const reqUrl =
    "/vocabularies/" + vocabularyIri.fragment + "/terms/" + termIri.fragment;
  return termitApi.put(
    reqUrl,
    content(term.toJsonLd()).params({
      namespace: vocabularyIri.namespace,
    })
  );
}

export function setTermDefinitionSource(
  source: TermOccurrence,
  term: Term,
  website: Website
) {
  const termIri = VocabularyUtils.create(term.iri);
  source.target.selectors.forEach((selector) => {
    if (selector.iri) {
      delete selector.iri;
    }
  });

  if (source.target.iri) {
    delete source.target.iri;
  }

  if (source.iri) {
    delete source.iri;
  }

  return termitApi
    .put(
      `/terms/${termIri.fragment}/definition-source`,
      param("namespace", termIri.namespace).content(source.toJsonLd())
    )
    .then((result) => {
      source.iri = result["@id"];
    });
}

export function removeTermDefinitionSource(source: TermOccurrence, term: Term) {
  const termIri = VocabularyUtils.create(term.iri);

  return termitApi.delete(
    `/terms/${termIri.fragment}/definition-source`,
    param("namespace", termIri.namespace)
  );
}

// NOTE: this currently only assigns term to occurrence, but could do other updates later
export async function updateTermOccurrence(termOccurrence: TermOccurrence) {
  const termIRI = VocabularyUtils.create(termOccurrence.term!.iri!);
  const termOccurrenceIRI = VocabularyUtils.create(termOccurrence.iri!);

  return termitApi.put(
    `/occurrence/${termOccurrenceIRI.fragment}`,
    params({
      termNamespace: termIRI.namespace,
      termFragment: termIRI.fragment,
      occurrenceNamespace: termOccurrenceIRI.namespace,
      // TODO:
      // termFragment: term ? VocabularyUtils.create(term.iri).fragment : null,
    })
  );
}

export async function saveTermOccurrences(
  termOccurrences: TermOccurrence[],
  website: Website,
  occurrenceType: string,
  vocabularyIri: string
) {
  const websiteIRI: IRI = VocabularyUtils.create(website.iri);

  const paramsPayload: {
    websiteNamespace: string;
    websiteFragment: string;
    contextIri: string;
  } = {
    websiteNamespace: websiteIRI.namespace!,
    websiteFragment: websiteIRI.fragment,
    contextIri: vocabularyIri,
  };

  const contentBody = termOccurrences.map((termOccurrence) => {
    const payload = {
      exactMatch: termOccurrence.getTextQuoteSelector().exactMatch,
      selector: termOccurrence.getCssSelector().value,
      start: termOccurrence.getTextPositionSelector().start,
      extraTypes: [occurrenceType],
      id: termOccurrence.id,
    };

    if (termOccurrence.term && termOccurrence.term.iri) {
      const termIRI = VocabularyUtils.create(termOccurrence.term.iri);
      payload.termNamespace = termIRI.namespace;
      payload.termFragment = termIRI.fragment;
    }

    return payload;
  });

  return termitApi
    .post(
      `/occurrence`,
      content(contentBody)
        .params(paramsPayload)
        // TODO: add back in, maybe not?
        // .content(termOccurrence.toJsonLd())
        .contentType(Constants.JSON_MIME_TYPE)
    )
    .then((termOccurrencesResult) => {
      // make sure termOccurrences have iris
      termOccurrencesResult.forEach((toResult, i) => {
        termOccurrences[i].iri = toResult["@id"];
      });
      return termOccurrencesResult;
    });
}

export function removeOccurrence(termOccurrence: TermOccurrence) {
  const termOccurrenceIRI = VocabularyUtils.create(termOccurrence.iri!);
  const termIRI = termOccurrence.term
    ? VocabularyUtils.create(termOccurrence.term!.iri!)
    : null;

  const paramsPayload: { namespace: string; termFragment?: string } = {
    namespace: termOccurrenceIRI.namespace!,
    // TODO:
    // termFragment: term ? VocabularyUtils.create(term.iri).fragment : null,
  };

  if (termIRI) {
    paramsPayload.termFragment = termIRI.fragment;
  }
  // TODO
  return termitApi.delete(
    `/occurrence/${termOccurrenceIRI.fragment}`,
    params(paramsPayload)
  );
}

export function loadIdentifier<T extends { name: string; assetType: string }>(
  parameters: T
) {
  return termitApi.post(`/identifiers`, params(parameters));
}

export async function getUser() {
  const userData: UserData = await BrowserApi.storage.get(
    Constants.STORAGE.USER
  );
  if (!userData) {
    return null;
  }

  return new User(userData);
}

export default {
  loadVocabularies,
  runPageAnnotationAnalysis,
  loadAllTerms,
  getLabel,
  saveTermOccurrences,
  loadTypes,
  createTerm,
  removeOccurrence,
  createDefinitionOccurrence,
  savePageAnnotationResults,
  createWebsiteInDocument,
  getExistingWebsite,
  getWebsiteTermOccurrences,
  loadIdentifier,
  updateTermOccurrence,
  getUser,
  removeWebsiteFromDocument,
  setTermDefinitionSource,
  removeTermDefinitionSource,
  updateTerm,
  loadTerm,
  removeSuggestedOccurrences,
};
