// mock response from https://kbss.felk.cvut.cz/termit-server-dev/rest/vocabularies/slovnik-document-376-2014/terms?includeImported=true&namespace=http%3A%2F%2Fonto.fel.cvut.cz%2Fontologies%2Fslovnik%2F
export const mockTerms = [
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/accident",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "accident",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://www.w3.org/2004/02/skos/core#broader": [
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/safety",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          "@language": "cs",
          "@value": "safety",
        },
        "http://www.w3.org/2004/02/skos/core#narrower": [
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/accident",
            "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
              {
                "@id":
                  "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
              },
            "http://www.w3.org/2004/02/skos/core#prefLabel": {
              "@language": "cs",
              "@value": "accident",
            },
          },
        ],
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
          true,
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
          },
        "http://www.w3.org/2004/02/skos/core#inScheme": {
          "@id":
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
        },
        "http://www.w3.org/2004/02/skos/core#definition": {
          "@language": "cs",
          "@value": "",
        },
      },
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/aircraft",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          "@language": "cs",
          "@value": "aircraft",
        },
        "http://www.w3.org/2004/02/skos/core#narrower": [
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/accident",
            "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
              {
                "@id":
                  "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
              },
            "http://www.w3.org/2004/02/skos/core#prefLabel": {
              "@language": "cs",
              "@value": "accident",
            },
          },
        ],
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
          true,
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
          },
        "http://www.w3.org/2004/02/skos/core#inScheme": {
          "@id":
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
        },
        "http://www.w3.org/2004/02/skos/core#definition": {
          "@language": "cs",
          "@value": "",
        },
      },
    ],
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "supplement or amend this Regulation,",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/accidents",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "accidents",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "historii",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/aircraft",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "aircraft",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/accident",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
          },
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          "@language": "cs",
          "@value": "accident",
        },
      },
    ],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/anus",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "anus",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "dfasfdasdf",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/incident",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "incident",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      false,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "access",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/obec",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "obec",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/prejudice",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "prejudice",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "this is prejudice definiton",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/renovace",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "renovace",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/safety",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "safety",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/accident",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
          },
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          "@language": "cs",
          "@value": "accident",
        },
      },
    ],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/safety-hazards",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "safety hazards",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014/pojem/which",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "which",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/slovnik-document-376-2014",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-808070709",
    },
    "http://www.w3.org/2004/02/skos/core#definition": [
      { "@language": "cs", "@value": "fasfdasdf" },
      { "@language": "en", "@value": "" },
    ],
  },
];
