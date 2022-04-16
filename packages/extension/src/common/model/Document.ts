import OntologicalVocabulary from "../util/VocabularyUtils";
import VocabularyUtils from "../util/VocabularyUtils";
import File, { OWN_CONTEXT as FILE_CONTEXT, FileData } from "./File";
import Resource, {
  CONTEXT as RESOURCE_CONTEXT,
  ResourceData,
} from "./Resource";
import Utils from "../util/Utils";
import { AssetData } from "./Asset";
import Website, {
  OWN_CONTEXT as WEBSITE_CONTEXT,
  WebsiteData,
} from "./Website";

const ctx = {
  files: {
    "@id": VocabularyUtils.HAS_FILE,
    "@container": "@set",
  },
  websites: {
    "@id": VocabularyUtils.HAS_WEBSITE,
    "@container": "@set",
  },
  vocabulary: VocabularyUtils.HAS_DOCUMENT_VOCABULARY,
};

export const CONTEXT = Object.assign(
  {},
  RESOURCE_CONTEXT,
  ctx,
  FILE_CONTEXT,
  WEBSITE_CONTEXT
);

export interface DocumentData extends ResourceData {
  files: FileData[];
  websites: WebsiteData[];
  vocabulary?: AssetData;
}

export default class Document extends Resource implements DocumentData {
  public files: File[];
  public websites: Website[];
  public vocabulary?: AssetData;

  constructor(data: DocumentData) {
    super(data);
    this.vocabulary = data.vocabulary;
    this.files = Utils.sanitizeArray(data.files).map((fd) => new File(fd));
    this.websites = Utils.sanitizeArray(data.websites).map(
      (fd) => new Website(fd)
    );
  }

  public clone() {
    return new Document(this);
  }

  public toJsonLd(): DocumentData {
    const result: any = Object.assign({}, this, {
      "@context": CONTEXT,
      types: [OntologicalVocabulary.RESOURCE, OntologicalVocabulary.DOCUMENT],
    });
    // Break reference cycles by replacing them with ID-references only
    result.files = Document.replaceCircularReferencesToOwnerWithOwnerId(
      result.files
    );
    result.websites = Document.replaceCircularReferencesToOwnerWithOwnerId(
      result.websites
    );
    result.vocabulary = this.vocabulary ? this.vocabulary.iri : undefined;
    return result;
  }

  public static replaceCircularReferencesToOwnerWithOwnerId(
    files: File[]
  ): FileData[] {
    return files.map((f) =>
      Object.assign({}, f, {
        owner: f.owner ? { iri: f.owner.iri } : undefined,
      })
    );
  }
}
