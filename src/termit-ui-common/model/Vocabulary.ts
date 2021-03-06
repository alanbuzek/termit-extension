import VocabularyUtils from '../util/VocabularyUtils';
import Asset, { ASSET_CONTEXT, AssetData } from './Asset';
import Document, {
  CONTEXT as DOCUMENT_CONTEXT,
  DocumentData,
} from './Document';
import WithUnmappedProperties from './WithUnmappedProperties';
import Utils from '../util/Utils';
import Constants from '../util/Constants';

// @id and @type are merged from ASSET_CONTEXT
const ctx = {
  label: VocabularyUtils.DC_TITLE,
  comment: VocabularyUtils.DC_DESCRIPTION,
  document: VocabularyUtils.DESCRIBES_DOCUMENT,
  glossary: VocabularyUtils.HAS_GLOSSARY,
  model: VocabularyUtils.HAS_MODEL,
  importedVocabularies: VocabularyUtils.IMPORTS_VOCABULARY,
};

export const CONTEXT = { ...ASSET_CONTEXT, ...DOCUMENT_CONTEXT, ...ctx };

const MAPPED_PROPERTIES = [
  '@context',
  'iri',
  'label',
  'comment',
  'document',
  'types',
  'glossary',
  'model',
  'importedVocabularies',
  'allImportedVocabularies',
  'termCount',
];

export interface VocabularyData extends AssetData {
  label: string;
  comment?: string;
  document?: DocumentData;
  glossary?: AssetData;
  model?: AssetData;
  importedVocabularies?: AssetData[];
}

export default class Vocabulary extends Asset implements VocabularyData {
  public label: string;

  public comment?: string;

  public glossary?: AssetData;

  public model?: AssetData;

  public importedVocabularies?: AssetData[];

  public allImportedVocabularies?: string[];

  public document?: DocumentData;

  public termCount?: number;

  constructor(data: VocabularyData) {
    super(data);
    Object.assign(this, data);
    this.label = data.label;
    this.types = Utils.sanitizeArray(data.types);
    if (this.types.indexOf(VocabularyUtils.VOCABULARY) === -1) {
      this.types.push(VocabularyUtils.VOCABULARY);
    }
    if (data.document) {
      this.document = new Document(data.document);
    }
  }

  getLabel(): string {
    return this.label;
  }

  public toJsonLd(): VocabularyData {
    const result: VocabularyData = { ...this, '@context': CONTEXT };
    delete (result as any).allImportedVocabularies;
    delete (result as any).termCount;
    if (result.document) {
      result.document = (this.document as Document)?.toJsonLd();
    }
    return result;
  }

  public get unmappedProperties(): Map<string, string[]> {
    return WithUnmappedProperties.getUnmappedProperties(
      this,
      MAPPED_PROPERTIES
    );
  }

  public set unmappedProperties(properties: Map<string, string[]>) {
    WithUnmappedProperties.setUnmappedProperties(
      this,
      properties,
      MAPPED_PROPERTIES
    );
  }

  public mapToMinifiedVersion(): Vocabulary {
    return {
      label: this.label,
      iri: this.iri,
      document: {
        iri: this.document?.iri,
        label: this.document?.label,
        websites: this.document?.websites
          ? this.document.websites.map((website) => ({
              iri: website.iri,
              label: website.label,
              url: website.url,
            }))
          : [],
      },
    } as Vocabulary;
  }
}
