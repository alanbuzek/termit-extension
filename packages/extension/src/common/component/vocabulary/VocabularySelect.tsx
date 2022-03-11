import * as React from "react";
import { useState } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import Vocabulary from "../../model/Vocabulary";
import Utils from "../../util/Utils";
import { useI18n } from "../hook/useI18n";

interface VocabularySelectProps {
  id?: string;
  vocabulary: Vocabulary | null;
  onVocabularySet: (vocabulary: Vocabulary) => void;
}

const vocabularies = [
  {
    iri: "http://onto.fel.cvut.cz/ontologies/slovnik/01234",
    types: [
      "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
    ],
    label: "01234",
    comment: "",
    document: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovnik/01234/document",
      types: [
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
      ],
      label: "Dokument pro 01234",
      terms: [],
      vocabulary: {
        iri: "http://onto.fel.cvut.cz/ontologies/slovnik/01234",
        types:
          "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
        glossary: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-1652839972",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
          "http://www.w3.org/2004/02/skos/core#hasTopConcept": [
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/01234/pojem/01234-druhý",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/01234/pojem/o1234-první",
            },
          ],
        },
        model: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance-1229611339",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
        },
        document: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/01234/document",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          vocabulary: "[CIRCULAR]",
          label: "Dokument pro 01234",
        },
        comment: "",
        label: "01234",
      },
      files: [],
    },
    glossary: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-1652839972",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
      "http://www.w3.org/2004/02/skos/core#hasTopConcept": [
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/01234/pojem/01234-druhý",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/01234/pojem/o1234-první",
        },
      ],
    },
    model: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance-1229611339",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
    },
  },
  {
    iri: "http://onto.fel.cvut.cz/ontologies/slovnik/023",
    types: [
      "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
    ],
    label: "023",
    comment: "Fix popisu",
    document: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovnik/023/document",
      types: [
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
      ],
      label: "Dokument pro 023",
      terms: [],
      vocabulary: {
        iri: "http://onto.fel.cvut.cz/ontologies/slovnik/023",
        types:
          "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
        glossary: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance1465504189",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
        },
        model: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance408586309",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
        },
        document: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/023/document",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          vocabulary: "[CIRCULAR]",
          label: "Dokument pro 023",
        },
        comment: "Fix popisu",
        label: "023",
      },
      files: [],
    },
    glossary: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance1465504189",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
    },
    model: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance408586309",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
    },
  },
  {
    iri: "http://onto.fel.cvut.cz/ontologies/slovnik/1610-nefungujici-annotator-ve-firefoxu",
    types: [
      "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
    ],
    label: "1610-Nefungujici annotator ve firefoxu",
    comment: "",
    document: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovnik/1610-nefungujici-annotator-ve-firefoxu/document",
      types: [
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
      ],
      label: "Dokument pro 1610-Nefungujici annotator ve firefoxu",
      terms: [],
      vocabulary: {
        iri: "http://onto.fel.cvut.cz/ontologies/slovnik/1610-nefungujici-annotator-ve-firefoxu",
        types:
          "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
        glossary: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance327952317",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
        },
        model: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance-353476218",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
        },
        document: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/1610-nefungujici-annotator-ve-firefoxu/document",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          vocabulary: "[CIRCULAR]",
          files: [
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/1610-nefungujici-annotator-ve-firefoxu/document/soubor/čsn-p-iso-6707-1_návrh-květen2019_výběr.htm",
              types: [
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
              ],
              owner: "[CIRCULAR]",
              label: "ČSN P ISO 6707-1_Návrh květen2019_výběr.htm",
            },
          ],
          label: "Dokument pro 1610-Nefungujici annotator ve firefoxu",
        },
        comment: "",
        label: "1610-Nefungujici annotator ve firefoxu",
      },
      files: [
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/1610-nefungujici-annotator-ve-firefoxu/document/soubor/čsn-p-iso-6707-1_návrh-květen2019_výběr.htm",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          label: "ČSN P ISO 6707-1_Návrh květen2019_výběr.htm",
          terms: [],
          owner: {
            iri: "http://onto.fel.cvut.cz/ontologies/slovnik/1610-nefungujici-annotator-ve-firefoxu/document",
            types: [
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
            ],
            vocabulary: "[CIRCULAR]",
            files: [
              {
                iri: "http://onto.fel.cvut.cz/ontologies/slovnik/1610-nefungujici-annotator-ve-firefoxu/document/soubor/čsn-p-iso-6707-1_návrh-květen2019_výběr.htm",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "ČSN P ISO 6707-1_Návrh květen2019_výběr.htm",
              },
            ],
            label: "Dokument pro 1610-Nefungujici annotator ve firefoxu",
          },
          origin: "",
        },
      ],
    },
    glossary: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance327952317",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
    },
    model: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance-353476218",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
    },
  },
  {
    iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test",
    types: [
      "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
    ],
    label: "Alan B. Test",
    comment: "Toto je můj testovací slovník",
    document: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document",
      types: [
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
      ],
      label: "Dokument pro Alan B. Test",
      terms: [],
      vocabulary: {
        iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test",
        types:
          "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
        glossary: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance1887759804",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
          "http://www.w3.org/2004/02/skos/core#hasTopConcept": [
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/pojem/stavební",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/pojem/parcela",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/pojem/pozemek",
            },
          ],
        },
        model: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance-720101836",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
        },
        document: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          vocabulary: "[CIRCULAR]",
          files: [
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document/soubor/component.html",
              types: [
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
              ],
              owner: "[CIRCULAR]",
              label: "component.html",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document/soubor/zakonyprolidi_cs_2013_256_v20210101.html",
              types: [
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
              ],
              owner: "[CIRCULAR]",
              label: "zakonyprolidi_cs_2013_256_v20210101.html",
            },
          ],
          label: "Dokument pro Alan B. Test",
        },
        comment: "Toto je můj testovací slovník",
        label: "Alan B. Test",
      },
      files: [
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document/soubor/component.html",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          label: "component.html",
          terms: [],
          owner: {
            iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document",
            types: [
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
            ],
            vocabulary: "[CIRCULAR]",
            files: [
              {
                iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document/soubor/component.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "component.html",
              },
              {
                iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document/soubor/zakonyprolidi_cs_2013_256_v20210101.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "zakonyprolidi_cs_2013_256_v20210101.html",
              },
            ],
            label: "Dokument pro Alan B. Test",
          },
          origin: "",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document/soubor/zakonyprolidi_cs_2013_256_v20210101.html",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          label: "zakonyprolidi_cs_2013_256_v20210101.html",
          terms: [],
          owner: {
            iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document",
            types: [
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
            ],
            vocabulary: "[CIRCULAR]",
            files: [
              {
                iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document/soubor/component.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "component.html",
              },
              {
                iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/document/soubor/zakonyprolidi_cs_2013_256_v20210101.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "zakonyprolidi_cs_2013_256_v20210101.html",
              },
            ],
            label: "Dokument pro Alan B. Test",
          },
          origin: "",
        },
      ],
    },
    glossary: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance1887759804",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
      "http://www.w3.org/2004/02/skos/core#hasTopConcept": [
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/pojem/stavební",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/pojem/parcela",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan-b.-test/pojem/pozemek",
        },
      ],
    },
    model: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance-720101836",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
    },
  },
  {
    iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan's-new-test-vocabulary--14.12.",
    types: [
      "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
    ],
    label: "Alan's new test vocabulary  14.12.",
    comment: "This is my new vocabulary",
    document: {
      iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc",
      types: [
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
      ],
      label: "abc",
      terms: [],
      vocabulary: {
        iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan's-new-test-vocabulary--14.12.",
        types:
          "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
        glossary: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance1773328496",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
          "http://www.w3.org/2004/02/skos/core#hasTopConcept": {
            iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan's-new-test-vocabulary--14.12./pojem/new-term",
          },
        },
        model: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance-683271533",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
        },
        document: {
          iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          vocabulary: "[CIRCULAR]",
          files: [
            {
              iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/816561de61d45430ecc4.css",
              types: [
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
              ],
              owner: "[CIRCULAR]",
              label: "816561de61d45430ecc4.css",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/lesson2.pdf",
              types: [
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
              ],
              owner: "[CIRCULAR]",
              label: "Lesson2.pdf",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/index.html",
              types: [
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
              ],
              owner: "[CIRCULAR]",
              label: "index.html",
            },
          ],
          comment: "",
          label: "abc",
        },
        comment: "This is my new vocabulary",
        label: "Alan's new test vocabulary  14.12.",
      },
      files: [
        {
          iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/816561de61d45430ecc4.css",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          label: "816561de61d45430ecc4.css",
          terms: [],
          owner: {
            iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc",
            types: [
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
            ],
            vocabulary: "[CIRCULAR]",
            files: [
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/816561de61d45430ecc4.css",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "816561de61d45430ecc4.css",
              },
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/lesson2.pdf",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "Lesson2.pdf",
              },
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/index.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "index.html",
              },
            ],
            comment: "",
            label: "abc",
          },
          origin: "",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/lesson2.pdf",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          label: "Lesson2.pdf",
          terms: [],
          owner: {
            iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc",
            types: [
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
            ],
            vocabulary: "[CIRCULAR]",
            files: [
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/816561de61d45430ecc4.css",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "816561de61d45430ecc4.css",
              },
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/lesson2.pdf",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "Lesson2.pdf",
              },
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/index.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "index.html",
              },
            ],
            comment: "",
            label: "abc",
          },
          origin: "",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/index.html",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          label: "index.html",
          terms: [],
          owner: {
            iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc",
            types: [
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
            ],
            vocabulary: "[CIRCULAR]",
            files: [
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/816561de61d45430ecc4.css",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "816561de61d45430ecc4.css",
              },
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/lesson2.pdf",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "Lesson2.pdf",
              },
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/abc/soubor/index.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "index.html",
              },
            ],
            comment: "",
            label: "abc",
          },
          origin: "",
        },
      ],
      comment: "",
    },
    glossary: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance1773328496",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
      "http://www.w3.org/2004/02/skos/core#hasTopConcept": {
        iri: "http://onto.fel.cvut.cz/ontologies/slovnik/alan's-new-test-vocabulary--14.12./pojem/new-term",
      },
    },
    model: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance-683271533",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
    },
  },
  {
    iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006",
    types: [
      "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
    ],
    label: "Building Act No.183/2006 Coll.",
    comment: "",
    document: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/document",
      types: [
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
      ],
      label: "Building Act No.183/2006 Coll.",
      terms: [],
      vocabulary: {
        iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006",
        types:
          "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
        importedVocabularies: [
          {
            iri: "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
          },
          {
            iri: "https://slovník.gov.cz/generický/testpk",
          },
        ],
        glossary: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-1479566043",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
          "http://www.w3.org/2004/02/skos/core#hasTopConcept": [
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/zákon",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/stavební-pozemek",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/zastavěné-území",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/změna",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/stavba",
            },
          ],
        },
        model: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance-59311126",
          types:
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
        },
        document: {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/document",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          vocabulary: "[CIRCULAR]",
          files: [
            {
              iri: "http://onto.fel.cvut.cz/ontologies/zdroj/zakonyprolidi_cs_2006_183_v20200312-2.html",
              types: [
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
              ],
              owner: "[CIRCULAR]",
              comment: "",
              label: "zakonyprolidi_cs_2006_183_v20200312-2.html",
            },
            {
              iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/document/soubor/zakonyprolidi_cs_2013_256_v20210101-v2.html",
              types: [
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
              ],
              owner: "[CIRCULAR]",
              label: "zakonyprolidi_cs_2013_256_v20210101-v2.html",
            },
          ],
          comment: "",
          label: "Building Act No.183/2006 Coll.",
        },
        comment: "",
        label: "Building Act No.183/2006 Coll.",
      },
      files: [
        {
          iri: "http://onto.fel.cvut.cz/ontologies/zdroj/zakonyprolidi_cs_2006_183_v20200312-2.html",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          label: "zakonyprolidi_cs_2006_183_v20200312-2.html",
          terms: [],
          owner: {
            iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/document",
            types: [
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
            ],
            vocabulary: "[CIRCULAR]",
            files: [
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/zakonyprolidi_cs_2006_183_v20200312-2.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                comment: "",
                label: "zakonyprolidi_cs_2006_183_v20200312-2.html",
              },
              {
                iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/document/soubor/zakonyprolidi_cs_2013_256_v20210101-v2.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "zakonyprolidi_cs_2013_256_v20210101-v2.html",
              },
            ],
            comment: "",
            label: "Building Act No.183/2006 Coll.",
          },
          comment: "",
          origin: "",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/document/soubor/zakonyprolidi_cs_2013_256_v20210101-v2.html",
          types: [
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
          ],
          label: "zakonyprolidi_cs_2013_256_v20210101-v2.html",
          terms: [],
          owner: {
            iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/document",
            types: [
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/dokument",
              "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
            ],
            vocabulary: "[CIRCULAR]",
            files: [
              {
                iri: "http://onto.fel.cvut.cz/ontologies/zdroj/zakonyprolidi_cs_2006_183_v20200312-2.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                comment: "",
                label: "zakonyprolidi_cs_2006_183_v20200312-2.html",
              },
              {
                iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/document/soubor/zakonyprolidi_cs_2013_256_v20210101-v2.html",
                types: [
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/soubor",
                  "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/zdroj",
                ],
                owner: "[CIRCULAR]",
                label: "zakonyprolidi_cs_2013_256_v20210101-v2.html",
              },
            ],
            comment: "",
            label: "Building Act No.183/2006 Coll.",
          },
          origin: "",
        },
      ],
      comment: "",
    },
    glossary: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-1479566043",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář",
      "http://www.w3.org/2004/02/skos/core#hasTopConcept": [
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/zákon",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/stavební-pozemek",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/zastavěné-území",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/změna",
        },
        {
          iri: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/stavba",
        },
      ],
    },
    model: {
      iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model/instance-59311126",
      types:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/model",
    },
    importedVocabularies: [
      {
        iri: "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
      },
      {
        iri: "https://slovník.gov.cz/generický/testpk",
      },
    ],
  },
];

const VocabularySelect: React.FC<VocabularySelectProps> = (props) => {
  const [vocabulary, setVocabulary] = useState();

  const items = Object.keys(vocabularies || []).map((vIri) => {
    return (
      <DropdownItem
        className="m-vocabulary-select-item"
        key={vIri}
        onClick={() => {
          console.log("dropdown item clicked");
          setVocabulary(vocabularies[vIri]);
        }}
        onChange={() => console.log('changed')}
      >
        {vocabularies[vIri].label}
      </DropdownItem>
    );
  });

  return (
    <UncontrolledDropdown
      id={props.id}
      group={true}
      size="sm"
      className="w-100 mb-3"
    >
      <DropdownToggle caret={true} className="w-100">
        {vocabulary ? vocabulary.label : "Choose vocabulary"}
      </DropdownToggle>
      <DropdownMenu
        modifiers={{
          setMaxHeight: {
            enabled: true,
            order: 890,
            fn: (data) => {
              return {
                ...data,
                styles: {
                  ...data.styles,
                  overflow: "auto",
                  maxHeight: Utils.calculateAssetListHeight() + "px",
                },
              };
            },
          },
        }}
      >
        {items}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default VocabularySelect;
