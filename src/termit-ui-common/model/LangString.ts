const ctx = {
  language: '@language',
  value: '@value',
};

export const CONTEXT = { ...ctx };

export type LangString = {
  language: string;
  value: string;
};
