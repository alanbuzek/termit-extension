// @id and @type are merged from ASSET_CONTEXT
const ctx = {
  '@id': 'iri',
};

export const CONTEXT = { ...ctx };

export type SourceShape = {
  iri: string;
};
