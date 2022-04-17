import OntologicalVocabulary from "../util/VocabularyUtils";
import Resource, { ResourceData } from "./Resource";
import Document, { DocumentData } from "./Document";
import VocabularyUtils from "../util/VocabularyUtils";

const ctx = {
  owner: VocabularyUtils.IS_PART_OF_DOCUMENT,
  url: VocabularyUtils.WEBSITE_URL
};

/**
 * This defines only context part specific to File. Complete context can be obtained from Document context.
 *
 * This is for circular dependency prevention.
 */
export const OWN_CONTEXT = ctx;

export interface WebsiteData extends ResourceData {
  url?: string;
  owner?: DocumentData;
}

export default class Website extends Resource implements WebsiteData {
  public owner?: DocumentData;
  public url?: string;

  constructor(data: WebsiteData) {
    super(data);
    this.owner = data.owner;
    this.url = data.url;
  }

  public clone() {
    return new Website(this);
  }

  public toJsonLd(): {} {
    const jsonLd: any = Object.assign({}, this, {
      // Import lazily to evade circular dependency in context definition between Website and Document
      "@context": require("./Document").CONTEXT,
      types: [OntologicalVocabulary.RESOURCE, OntologicalVocabulary.WEBSITE],
    });
    if (jsonLd.owner) {
      const ind = jsonLd.owner.websites.findIndex(
        (item: any) => item.iri === this.iri
      );
      // Replace reference to myself with an IRI reference only to prevent serialization cycle errors
      jsonLd.owner.websites.splice(ind, 1, { iri: this.iri });
      jsonLd.owner.websites =
        Document.replaceCircularReferencesToOwnerWithOwnerId(
          jsonLd.owner.websites
        );
    }
    return jsonLd;
  }
}

export const EMPTY_WEBSITE = new Website({
  iri: "http://empty",
  label: "",
  terms: [],
});
