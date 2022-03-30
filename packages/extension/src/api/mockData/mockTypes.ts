
const mockTypes = [
    {
      "@id": "http://onto.fel.cvut.cz/ontologies/ufo/intrinsic-trope",
      "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
      "http://www.w3.org/2004/02/skos/core#prefLabel": [
        { "@language": "cs", "@value": "Vlastnost" },
        { "@language": "en", "@value": "Aspect" },
      ],
      "http://www.w3.org/2004/02/skos/core#scopeNote": [],
      "http://www.w3.org/2004/02/skos/core#narrower": [],
    },
    {
      "@id": "http://onto.fel.cvut.cz/ontologies/ufo/object",
      "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
      "http://www.w3.org/2004/02/skos/core#prefLabel": [
        { "@language": "cs", "@value": "Objekt" },
        { "@language": "en", "@value": "Object" },
      ],
      "http://www.w3.org/2004/02/skos/core#scopeNote": {
        "@language": "en",
        "@value":
          "Object is any identifiable endurant entity existence of which is not directly dependent on an existence of another entity.",
      },
      "http://www.w3.org/2004/02/skos/core#narrower": [],
    },
    {
      "@id": "http://onto.fel.cvut.cz/ontologies/ufo/event",
      "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
      "http://www.w3.org/2004/02/skos/core#prefLabel": [
        { "@language": "cs", "@value": "Událost" },
        { "@language": "en", "@value": "Event" },
      ],
      "http://www.w3.org/2004/02/skos/core#scopeNote": {
        "@language": "en",
        "@value":
          "An event, perdurant in the ontological sense. Events do not change its properties over time.",
      },
      "http://www.w3.org/2004/02/skos/core#narrower": [],
    },
    {
      "@id": "http://onto.fel.cvut.cz/ontologies/ufo/object-type",
      "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
      "http://www.w3.org/2004/02/skos/core#prefLabel": [
        { "@language": "cs", "@value": "Typ objektu" },
        { "@language": "en", "@value": "Object Type" },
      ],
      "http://www.w3.org/2004/02/skos/core#scopeNote": [],
      "http://www.w3.org/2004/02/skos/core#narrower": [],
    },
    {
      "@id": "http://onto.fel.cvut.cz/ontologies/ufo/relator-type",
      "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
      "http://www.w3.org/2004/02/skos/core#prefLabel": [
        { "@language": "cs", "@value": "Typ vztahu" },
        { "@language": "en", "@value": "Relation" },
      ],
      "http://www.w3.org/2004/02/skos/core#scopeNote": [],
      "http://www.w3.org/2004/02/skos/core#narrower": [],
    },
    {
      "@id": "http://onto.fel.cvut.cz/ontologies/ufo/intrinsic-trope-type",
      "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
      "http://www.w3.org/2004/02/skos/core#prefLabel": [
        { "@language": "cs", "@value": "Typ vlastnosti" },
        { "@language": "en", "@value": "Aspect Type" },
      ],
      "http://www.w3.org/2004/02/skos/core#scopeNote": [],
      "http://www.w3.org/2004/02/skos/core#narrower": [],
    },
    {
      "@id": "http://onto.fel.cvut.cz/ontologies/ufo/individual",
      "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
      "http://www.w3.org/2004/02/skos/core#prefLabel": [
        { "@language": "cs", "@value": "Individuál" },
        { "@language": "en", "@value": "Individual" },
      ],
      "http://www.w3.org/2004/02/skos/core#scopeNote": [],
      "http://www.w3.org/2004/02/skos/core#narrower": [
        {
          "@id": "http://onto.fel.cvut.cz/ontologies/ufo/relator",
          "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        },
        {
          "@id": "http://onto.fel.cvut.cz/ontologies/ufo/event",
          "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        },
        {
          "@id": "http://onto.fel.cvut.cz/ontologies/ufo/object",
          "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        },
        {
          "@id": "http://onto.fel.cvut.cz/ontologies/ufo/intrinsic-trope",
          "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        },
      ],
    },
    {
      "@id": "http://onto.fel.cvut.cz/ontologies/ufo/relator",
      "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
      "http://www.w3.org/2004/02/skos/core#prefLabel": [
        { "@language": "cs", "@value": "Vztah" },
        { "@language": "en", "@value": "Relator" },
      ],
      "http://www.w3.org/2004/02/skos/core#scopeNote": [],
      "http://www.w3.org/2004/02/skos/core#narrower": [],
    },
    {
      "@id": "http://onto.fel.cvut.cz/ontologies/ufo/event-type",
      "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
      "http://www.w3.org/2004/02/skos/core#prefLabel": [
        { "@language": "cs", "@value": "Typ události" },
        { "@language": "en", "@value": "Event Type" },
      ],
      "http://www.w3.org/2004/02/skos/core#scopeNote": [],
      "http://www.w3.org/2004/02/skos/core#narrower": [],
    },
    {
      "@id": "http://onto.fel.cvut.cz/ontologies/ufo/type",
      "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
      "http://www.w3.org/2004/02/skos/core#prefLabel": [
        { "@language": "cs", "@value": "Typ" },
        { "@language": "en", "@value": "Type" },
      ],
      "http://www.w3.org/2004/02/skos/core#scopeNote": [],
      "http://www.w3.org/2004/02/skos/core#narrower": [
        {
          "@id": "http://onto.fel.cvut.cz/ontologies/ufo/event-type",
          "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        },
        {
          "@id": "http://onto.fel.cvut.cz/ontologies/ufo/object-type",
          "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        },
        {
          "@id": "http://onto.fel.cvut.cz/ontologies/ufo/intrinsic-trope-type",
          "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        },
        {
          "@id": "http://onto.fel.cvut.cz/ontologies/ufo/relator-type",
          "@type": ["http://www.w3.org/2004/02/skos/core#Concept"],
        },
      ],
    },
  ];

  export default mockTypes;
  