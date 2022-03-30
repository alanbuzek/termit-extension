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

export const mockTerms2 = [
  {
    "@id": "https://slovník.gov.cz/generický/testpk/pojem/budova",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "budova",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/guyana-afriquaine/pojem/guyana",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/guyana-afriquaine",
          },
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          "@language": "cs",
          "@value": "Guyana",
        },
      },
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/stavba",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006",
          },
        "http://www.w3.org/2004/02/skos/core#prefLabel": [
          { "@language": "cs", "@value": "Stavba" },
          { "@language": "en", "@value": "Structure" },
        ],
      },
    ],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      { "@id": "https://slovník.gov.cz/generický/testpk" },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-336906746",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/building",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": [
      { "@language": "cs", "@value": "Budova" },
      { "@language": "en", "@value": "Building" },
    ],
    "http://www.w3.org/2004/02/skos/core#narrower": [
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/residential-house",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
          },
        "http://www.w3.org/2004/02/skos/core#prefLabel": [
          { "@language": "cs", "@value": "Bytový dům" },
          { "@language": "en", "@value": "Apartment Building" },
        ],
      },
    ],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://www.w3.org/2004/02/skos/core#broader": [
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/stavb",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://www.w3.org/2004/02/skos/core#prefLabel": [
          { "@language": "cs", "@value": "Stavba" },
          { "@language": "en", "@value": "Structure" },
        ],
        "http://www.w3.org/2004/02/skos/core#narrower": [
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/building",
            "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
              {
                "@id":
                  "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
              },
            "http://www.w3.org/2004/02/skos/core#prefLabel": [
              { "@language": "cs", "@value": "Budova" },
              { "@language": "en", "@value": "Building" },
            ],
          },
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/guyana-afriquaine/pojem/guyana",
            "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
              {
                "@id":
                  "http://onto.fel.cvut.cz/ontologies/slovnik/guyana-afriquaine",
              },
            "http://www.w3.org/2004/02/skos/core#prefLabel": {
              "@language": "cs",
              "@value": "Guyana",
            },
          },
        ],
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
          true,
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
          },
        "http://www.w3.org/2004/02/skos/core#inScheme": {
          "@id":
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance736063743",
        },
        "http://www.w3.org/2004/02/skos/core#definition": {
          "@language": "cs",
          "@value": "",
        },
      },
    ],
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id": "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance736063743",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value":
        "Budova je nadzemní stavba včetně její podzemní části prostorově soustředěná a navenek převážně uzavřená obvodovými stěnami a střešní konstrukcí.",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/residential-house",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": [
      { "@language": "cs", "@value": "Bytový dům" },
      { "@language": "en", "@value": "Apartment Building" },
    ],
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://www.w3.org/2004/02/skos/core#broader": [
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/structure-type",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://www.w3.org/2004/02/skos/core#prefLabel": [
          { "@language": "cs", "@value": "Druh stavby" },
          { "@language": "en", "@value": "Structure Type" },
        ],
        "http://www.w3.org/2004/02/skos/core#narrower": [
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/residential-house",
            "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
              {
                "@id":
                  "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
              },
            "http://www.w3.org/2004/02/skos/core#prefLabel": [
              { "@language": "cs", "@value": "Bytový dům" },
              { "@language": "en", "@value": "Apartment Building" },
            ],
          },
        ],
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
          true,
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
          },
        "http://www.w3.org/2004/02/skos/core#inScheme": {
          "@id":
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance736063743",
        },
        "http://www.w3.org/2004/02/skos/core#definition": {
          "@language": "cs",
          "@value": "",
        },
      },
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/building",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://www.w3.org/2004/02/skos/core#prefLabel": [
          { "@language": "cs", "@value": "Budova" },
          { "@language": "en", "@value": "Building" },
        ],
        "http://www.w3.org/2004/02/skos/core#narrower": [
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/residential-house",
            "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
              {
                "@id":
                  "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
              },
            "http://www.w3.org/2004/02/skos/core#prefLabel": [
              { "@language": "cs", "@value": "Bytový dům" },
              { "@language": "en", "@value": "Apartment Building" },
            ],
          },
        ],
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
          true,
        "http://www.w3.org/2004/02/skos/core#broader": [
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/stavb",
            "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
            "http://www.w3.org/2004/02/skos/core#prefLabel": [
              { "@language": "cs", "@value": "Stavba" },
              { "@language": "en", "@value": "Structure" },
            ],
            "http://www.w3.org/2004/02/skos/core#narrower": [
              {
                "@id":
                  "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/building",
                "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
                  {
                    "@id":
                      "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
                  },
                "http://www.w3.org/2004/02/skos/core#prefLabel": [
                  { "@language": "cs", "@value": "Budova" },
                  { "@language": "en", "@value": "Building" },
                ],
              },
              {
                "@id":
                  "http://onto.fel.cvut.cz/ontologies/slovnik/guyana-afriquaine/pojem/guyana",
                "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
                  {
                    "@id":
                      "http://onto.fel.cvut.cz/ontologies/slovnik/guyana-afriquaine",
                  },
                "http://www.w3.org/2004/02/skos/core#prefLabel": {
                  "@language": "cs",
                  "@value": "Guyana",
                },
              },
            ],
            "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
              true,
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
              {
                "@id":
                  "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
              },
            "http://www.w3.org/2004/02/skos/core#inScheme": {
              "@id":
                "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance736063743",
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
              "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
          },
        "http://www.w3.org/2004/02/skos/core#inScheme": {
          "@id":
            "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance736063743",
        },
        "http://www.w3.org/2004/02/skos/core#definition": {
          "@language": "cs",
          "@value":
            "Budova je nadzemní stavba včetně její podzemní části prostorově soustředěná a navenek převážně uzavřená obvodovými stěnami a střešní konstrukcí.",
        },
      },
    ],
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id": "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance736063743",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/structure-type",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": [
      { "@language": "cs", "@value": "Druh stavby" },
      { "@language": "en", "@value": "Structure Type" },
    ],
    "http://www.w3.org/2004/02/skos/core#narrower": [
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/residential-house",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
          },
        "http://www.w3.org/2004/02/skos/core#prefLabel": [
          { "@language": "cs", "@value": "Bytový dům" },
          { "@language": "en", "@value": "Apartment Building" },
        ],
      },
    ],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id": "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance736063743",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/stavb",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": [
      { "@language": "cs", "@value": "Stavba" },
      { "@language": "en", "@value": "Structure" },
    ],
    "http://www.w3.org/2004/02/skos/core#narrower": [
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/building",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
          },
        "http://www.w3.org/2004/02/skos/core#prefLabel": [
          { "@language": "cs", "@value": "Budova" },
          { "@language": "en", "@value": "Building" },
        ],
      },
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/guyana-afriquaine/pojem/guyana",
        "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
          {
            "@id":
              "http://onto.fel.cvut.cz/ontologies/slovnik/guyana-afriquaine",
          },
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          "@language": "cs",
          "@value": "Guyana",
        },
      },
    ],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id": "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance736063743",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/stavba",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": [
      { "@language": "cs", "@value": "Stavba" },
      { "@language": "en", "@value": "Structure" },
    ],
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-1479566043",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value":
        "Stavbou se rozumí veškerá stavební díla, která vznikají stavební nebo montážní technologií, bez zřetele na jejich stavebně technické provedení, použité stavební výrobky, materiály a konstrukce, na účel využití a dobu trvání. Dočasná stavba je stavba, u které stavební úřad předem omezí dobu jejího trvání. Za stavbu se považuje také výrobek plnící funkci stavby. Stavba, která slouží reklamním účelům, je stavba pro reklamu. ",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/stavební-pozemek",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "stavební pozemek",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-1479566043",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value":
        "pozemek, jeho část nebo soubor pozemků, vymezený a určený k umístění stavby územním rozhodnutím, společným povolením, kterým se stavba umisťuje a povoluje (dále jen „společné povolení“), anebo regulačním plánem.",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/územní",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "územní",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-1479566043",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "nezahrnuté do zastavěného",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/územní-pojem-2",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "územní pojem 2",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-1479566043",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/zákon",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "zákon",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-1479566043",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value":
        "upravuje ve věcech stavebního řádu zejména povolování staveb a jejich změn, terénních úprav a zařízení, užívaní a odstraňování staveb , dohled a zvláštní pravomoci stavebních úřadů, postavení a oprávnění autorizovaných inspektorů, soustavu stavebních úřadů, povinnosti a odpovědnost osob při přípravě a provádění staveb .",
    },
  },
  {
    "@id":
      "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/změna",
    "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.w3.org/2004/02/skos/core#prefLabel": {
      "@language": "cs",
      "@value": "změna",
    },
    "http://www.w3.org/2004/02/skos/core#narrower": [],
    "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-draft":
      true,
    "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/je-pojmem-ze-slovníku":
      {
        "@id":
          "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006",
      },
    "http://www.w3.org/2004/02/skos/core#inScheme": {
      "@id":
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/glosář/instance-1479566043",
    },
    "http://www.w3.org/2004/02/skos/core#definition": {
      "@language": "cs",
      "@value": "",
    },
  },
];
