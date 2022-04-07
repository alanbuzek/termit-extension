const mockExistingOccurrences = [
  {
    termOccurrence: {
      about: "_:ab3d-0",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "krajina",
      typeof: "ddo:výskyt-termu",
      score: 1,
      startOffset:
        "Lubina leží v geologicky zajímavé okrajové části Vnějších Západních       Karpat a to v Podbeskydské pahorkatině. Naše ",
      originalTerm: "krajina",
      cssSelector: "#content > div.hfeed > div.entry-content > p:nth-child(1)",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-1",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "katastr",
      typeof: "ddo:výskyt-termu",
      score: 1,
      startOffset:
        "Lubina leží v geologicky zajímavé okrajové části Vnějších Západních       Karpat a to v Podbeskydské pahorkatině. Naše krajina je vytvořena z       hornin, které se usazovaly v okrajových částech druhohorního a       třetihorního oceánu, který tady byl před 200-15 miliony let. Nejstarší       horniny z této doby vystupují na povrch i v korytě Lubiny na zdejším       ",
      originalTerm: "katastru",
      cssSelector: "#content > div.hfeed > div.entry-content > p:nth-child(1)",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-2",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "obec",
      typeof: "ddo:výskyt-termu",
      score: 1,
      startOffset:
        "Lubina leží v geologicky zajímavé okrajové části Vnějších Západních       Karpat a to v Podbeskydské pahorkatině. Naše krajina je vytvořena z       hornin, které se usazovaly v okrajových částech druhohorního a       třetihorního oceánu, který tady byl před 200-15 miliony let. Nejstarší       horniny z této doby vystupují na povrch i v korytě Lubiny na zdejším       katastru. V mělkých vodách moře se usazoval i vápenec, jako třeba v       nedalekémŠtramberku.       Ale i ve Větřkovicích se pro místní potřebu těžil ještě na počátku 20.       stol. Blízko naší ",
      originalTerm: "obce",
      cssSelector: "#content > div.hfeed > div.entry-content > p:nth-child(1)",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-3",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "sopka",
      typeof:
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/výskyt-termu",
      startOffset:
        "Lubina leží v geologicky zajímavé okrajové části Vnějších Západních       Karpat a to v Podbeskydské pahorkatině. Naše krajina je vytvořena z       hornin, které se usazovaly v okrajových částech druhohorního a       třetihorního oceánu, který tady byl před 200-15 miliony let. Nejstarší       horniny z této doby vystupují na povrch i v korytě Lubiny na zdejším       katastru. V mělkých vodách moře se usazoval i vápenec, jako třeba v       nedalekémŠtramberku.       Ale i ve Větřkovicích se pro místní potřebu těžil ještě na počátku 20.       stol. Blízko naší obce se nachází vyhaslá podmořská ",
      originalTerm: "sopka",
      cssSelector: "#content > div.hfeed > div.entry-content > p:nth-child(1)",
    },
    term: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/stavební-pozemek",
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-4",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "hornina",
      typeof:
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/výskyt-termu",
      startOffset:
        "Lubina leží v geologicky zajímavé okrajové části Vnějších Západních       Karpat a to v Podbeskydské pahorkatině. Naše krajina je vytvořena z       hornin, které se usazovaly v okrajových částech druhohorního a       třetihorního oceánu, který tady byl před 200-15 miliony let. Nejstarší       horniny z této doby vystupují na povrch i v korytě Lubiny na zdejším       katastru. V mělkých vodách moře se usazoval i vápenec, jako třeba v       nedalekémŠtramberku.       Ale i ve Větřkovicích se pro místní potřebu těžil ještě na počátku 20.       stol. Blízko naší obce se nachází vyhaslá podmořská sopka – Hončova Hůrka.       Dosud se zde nalézají různé polodrahokamy. Vyvřelá ",
      originalTerm: "hornina",
      cssSelector: "#content > div.hfeed > div.entry-content > p:nth-child(1)",
    },
    term: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/stavební-pozemek",
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-5",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "obec",
      typeof:
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/výskyt-termu",
      startOffset: "Stejně jako skladbu geologickou má ",
      originalTerm: "obec",
      cssSelector: "#content > div.hfeed > div.entry-content > p:nth-child(4)",
    },
    term: "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/building",
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-6",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "chráněnné",
      typeof:
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/výskyt-termu",
      startOffset:
        "Stejně jako skladbu geologickou má obec mimořádně bohatou druhovou       skladbu rostlin. Toho si všimli botanikové už koncem 19. stol. Z hlediska       fytografického členění ČR tvoří řeka Lubina přirozenou hranici mezi       východním okrajem fytografického podokresu Moravské brány vlastní na levém       břehu řeky a Beskydkým podhůřím na břehu pravém. Z toho je zřejmé, proč je       u nás tak veliká různorodost květeny a vegetace. To se týká i hub.       Odborníci z Ostravského muzea prozkoumali lokalitu kolem přehrady a       udělili jí statut “Přechodně ",
      originalTerm: "chráněnné",
      cssSelector: "#content > div.hfeed > div.entry-content > p:nth-child(4)",
    },
    term: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/územní",
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-8",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "katastr obec",
      typeof: "ddo:výskyt-termu",
      score: 1,
      startOffset:
        "Stejně jako skladbu geologickou má obec mimořádně bohatou druhovou       skladbu rostlin. Toho si všimli botanikové už koncem 19. stol. Z hlediska       fytografického členění ČR tvoří řeka Lubina přirozenou hranici mezi       východním okrajem fytografického podokresu Moravské brány vlastní na levém       břehu řeky a Beskydkým podhůřím na břehu pravém. Z toho je zřejmé, proč je       u nás tak veliká různorodost květeny a vegetace. To se týká i hub.       Odborníci z Ostravského muzea prozkoumali lokalitu kolem přehrady a       udělili jí statut “Přechodně chráněnné plochy”. Na původním ",
      originalTerm: "katastru obce",
      cssSelector: "#content > div.hfeed > div.entry-content > p:nth-child(4)",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-9",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "fojtství",
      typeof: "ddo:výskyt-termu",
      score: 1,
      startOffset:
        "Stejně jako skladbu geologickou má obec mimořádně bohatou druhovou       skladbu rostlin. Toho si všimli botanikové už koncem 19. stol. Z hlediska       fytografického členění ČR tvoří řeka Lubina přirozenou hranici mezi       východním okrajem fytografického podokresu Moravské brány vlastní na levém       břehu řeky a Beskydkým podhůřím na břehu pravém. Z toho je zřejmé, proč je       u nás tak veliká různorodost květeny a vegetace. To se týká i hub.       Odborníci z Ostravského muzea prozkoumali lokalitu kolem přehrady a       udělili jí statut “Přechodně chráněnné plochy”. Na původním katastru obce       byla nalezena stolička mamuta. Je uložena v Okresním vlastivědném ústavu v       Novém Jičíně. Dnes je prostor Lubiny geologicky i fytogeograficky zmapován       a výsledky jsou uloženy na Odboru životního prostředí Městského úřadu vKopřivnicia také v kopřivnickém Muzeu ",
      originalTerm: "fojtství",
      cssSelector: "#content > div.hfeed > div.entry-content > p:nth-child(4)",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-11",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "katastr obec",
      typeof: "ddo:výskyt-termu",
      score: 1,
      startOffset:
        "\nLubina leží v geologicky zajímavé okrajové části Vnějších Západních       Karpat a to v Podbeskydské pahorkatině. Naše krajina je vytvořena z       hornin, které se usazovaly v okrajových částech druhohorního a       třetihorního oceánu, který tady byl před 200-15 miliony let. Nejstarší       horniny z této doby vystupují na povrch i v korytě Lubiny na zdejším       katastru. V mělkých vodách moře se usazoval i vápenec, jako třeba v       nedalekémŠtramberku.       Ale i ve Větřkovicích se pro místní potřebu těžil ještě na počátku 20.       stol. Blízko naší obce se nachází vyhaslá podmořská sopka – Hončova Hůrka.       Dosud se zde nalézají různé polodrahokamy. Vyvřelá hornina z této sopky       zasahuje až k nám a přispívá ke složení nejúrodnější půdy obou vesnic. Pro       svou barvu je tento lán pojmenován “Černice”.\n    \n    Rostlinstvo\n    Stejně jako skladbu geologickou má obec mimořádně bohatou druhovou       skladbu rostlin. Toho si všimli botanikové už koncem 19. stol. Z hlediska       fytografického členění ČR tvoří řeka Lubina přirozenou hranici mezi       východním okrajem fytografického podokresu Moravské brány vlastní na levém       břehu řeky a Beskydkým podhůřím na břehu pravém. Z toho je zřejmé, proč je       u nás tak veliká různorodost květeny a vegetace. To se týká i hub.       Odborníci z Ostravského muzea prozkoumali lokalitu kolem přehrady a       udělili jí statut “Přechodně chráněnné plochy”. Na původním katastru obce       byla nalezena stolička mamuta. Je uložena v Okresním vlastivědném ústavu v       Novém Jičíně. Dnes je prostor Lubiny geologicky i fytogeograficky zmapován       a výsledky jsou uloženy na Odboru životního prostředí Městského úřadu vKopřivnicia také v kopřivnickém Muzeu fojtství.\n    Přehrada\n    Pro potřebu závoduTatrabyla na ",
      originalTerm: "katastru obce",
      cssSelector: "#content > div.hfeed > div.entry-content",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-12",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "přehrada",
      typeof: "ddo:výskyt-termu",
      score: 1,
      startOffset:
        "\nLubina leží v geologicky zajímavé okrajové části Vnějších Západních       Karpat a to v Podbeskydské pahorkatině. Naše krajina je vytvořena z       hornin, které se usazovaly v okrajových částech druhohorního a       třetihorního oceánu, který tady byl před 200-15 miliony let. Nejstarší       horniny z této doby vystupují na povrch i v korytě Lubiny na zdejším       katastru. V mělkých vodách moře se usazoval i vápenec, jako třeba v       nedalekémŠtramberku.       Ale i ve Větřkovicích se pro místní potřebu těžil ještě na počátku 20.       stol. Blízko naší obce se nachází vyhaslá podmořská sopka – Hončova Hůrka.       Dosud se zde nalézají různé polodrahokamy. Vyvřelá hornina z této sopky       zasahuje až k nám a přispívá ke složení nejúrodnější půdy obou vesnic. Pro       svou barvu je tento lán pojmenován “Černice”.\n    \n    Rostlinstvo\n    Stejně jako skladbu geologickou má obec mimořádně bohatou druhovou       skladbu rostlin. Toho si všimli botanikové už koncem 19. stol. Z hlediska       fytografického členění ČR tvoří řeka Lubina přirozenou hranici mezi       východním okrajem fytografického podokresu Moravské brány vlastní na levém       břehu řeky a Beskydkým podhůřím na břehu pravém. Z toho je zřejmé, proč je       u nás tak veliká různorodost květeny a vegetace. To se týká i hub.       Odborníci z Ostravského muzea prozkoumali lokalitu kolem přehrady a       udělili jí statut “Přechodně chráněnné plochy”. Na původním katastru obce       byla nalezena stolička mamuta. Je uložena v Okresním vlastivědném ústavu v       Novém Jičíně. Dnes je prostor Lubiny geologicky i fytogeograficky zmapován       a výsledky jsou uloženy na Odboru životního prostředí Městského úřadu vKopřivnicia také v kopřivnickém Muzeu fojtství.\n    Přehrada\n    Pro potřebu závoduTatrabyla na katastru obce Větřkovice v letech 1973-75     vybudována ",
      originalTerm: "přehrada",
      cssSelector: "#content > div.hfeed > div.entry-content",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-13",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "krajina",
      typeof: "ddo:výskyt-termu",
      score: 1,
      startOffset:
        "\nLubina leží v geologicky zajímavé okrajové části Vnějších Západních       Karpat a to v Podbeskydské pahorkatině. Naše krajina je vytvořena z       hornin, které se usazovaly v okrajových částech druhohorního a       třetihorního oceánu, který tady byl před 200-15 miliony let. Nejstarší       horniny z této doby vystupují na povrch i v korytě Lubiny na zdejším       katastru. V mělkých vodách moře se usazoval i vápenec, jako třeba v       nedalekémŠtramberku.       Ale i ve Větřkovicích se pro místní potřebu těžil ještě na počátku 20.       stol. Blízko naší obce se nachází vyhaslá podmořská sopka – Hončova Hůrka.       Dosud se zde nalézají různé polodrahokamy. Vyvřelá hornina z této sopky       zasahuje až k nám a přispívá ke složení nejúrodnější půdy obou vesnic. Pro       svou barvu je tento lán pojmenován “Černice”.\n    \n    Rostlinstvo\n    Stejně jako skladbu geologickou má obec mimořádně bohatou druhovou       skladbu rostlin. Toho si všimli botanikové už koncem 19. stol. Z hlediska       fytografického členění ČR tvoří řeka Lubina přirozenou hranici mezi       východním okrajem fytografického podokresu Moravské brány vlastní na levém       břehu řeky a Beskydkým podhůřím na břehu pravém. Z toho je zřejmé, proč je       u nás tak veliká různorodost květeny a vegetace. To se týká i hub.       Odborníci z Ostravského muzea prozkoumali lokalitu kolem přehrady a       udělili jí statut “Přechodně chráněnné plochy”. Na původním katastru obce       byla nalezena stolička mamuta. Je uložena v Okresním vlastivědném ústavu v       Novém Jičíně. Dnes je prostor Lubiny geologicky i fytogeograficky zmapován       a výsledky jsou uloženy na Odboru životního prostředí Městského úřadu vKopřivnicia také v kopřivnickém Muzeu fojtství.\n    Přehrada\n    Pro potřebu závoduTatrabyla na katastru obce Větřkovice v letech 1973-75     vybudována přehrada, která slouží také širokému okolí k rekreaci. Je     umístěna v překrásné ",
      originalTerm: "krajině",
      cssSelector: "#content > div.hfeed > div.entry-content",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-14",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "obec",
      typeof: "ddo:výskyt-termu",
      score: 1,
      startOffset: "Historie ",
      originalTerm: "obce",
      cssSelector: "#content > p > a",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:ab3d-15",
      property: "ddo:je-výskytem-termu",
      resource: "",
      content: "www.lubina.cz",
      typeof: "ddo:výskyt-termu",
      score: 1,
      startOffset: "",
      originalTerm: "www.lubina.cz",
      cssSelector: "#footer > a:nth-child(1)",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:xrd9v",
      content: "mimořádně bohatou druhovou\n      skladbu rostlin",
      originalTerm: "mimořádně bohatou druhovou\n      skladbu rostlin",
      property:
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-výskytem-definice-termu",
      startOffset: "Stejně jako skladbu geologickou má obec ",
      typeof: "http://www.w3.org/2004/02/skos/core#definition",
      cssSelector:
        ":root > :nth-child(2) > :nth-child(1) > :nth-child(5) > :nth-child(1) > :nth-child(2) > :nth-child(4)",
    },
    term: "http://onto.fel.cvut.cz/ontologies/slovnik/decree-no-268-2009/pojem/building",
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:djlkh",
      content: "horniny",
      originalTerm: "horniny",
      property:
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-výskytem-termu",
      startOffset:
        "Lubina leží v geologicky zajímavé okrajové části Vnějších Západních\n      Karpat a to v Podbeskydské pahorkatině. Naše krajina je vytvořena z\n      hornin, které se usazovaly v okrajových částech druhohorního a\n      třetihorního oceánu, který tady byl před 200-15 miliony let. Nejstarší\n      ",
      typeof:
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/výskyt-termu",
      cssSelector:
        ":root > :nth-child(2) > :nth-child(1) > :nth-child(5) > :nth-child(1) > :nth-child(2) > :nth-child(1)",
    },
    term: "http://onto.fel.cvut.cz/ontologies/slovnik/building-act-no183-2006/pojem/územní",
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:urqx",
      content: "Moravské",
      originalTerm: "Moravské",
      property:
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-výskytem-definice-termu",
      startOffset:
        "Stejně jako skladbu geologickou má obec mimořádně bohatou druhovou\n      skladbu rostlin. Toho si všimli botanikové už koncem 19. stol. Z hlediska\n      fytografického členění ČR tvoří řeka Lubina přirozenou hranici mezi\n      východním okrajem fytografického podokresu ",
      typeof: "http://www.w3.org/2004/02/skos/core#definition",
      cssSelector:
        ":root > :nth-child(2) > :nth-child(1) > :nth-child(5) > :nth-child(1) > :nth-child(2) > :nth-child(4)",
    },
    term: null,
    annotatationStatus: 0,
  },
  {
    termOccurrence: {
      about: "_:26h06",
      content: "lokalitu",
      originalTerm: "lokalitu",
      property:
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/je-výskytem-termu",
      startOffset:
        "Stejně jako skladbu geologickou má obec mimořádně bohatou druhovou\n      skladbu rostlin. Toho si všimli botanikové už koncem 19. stol. Z hlediska\n      fytografického členění ČR tvoří řeka Lubina přirozenou hranici mezi\n      východním okrajem fytografického podokresu Moravské brány vlastní na levém\n      břehu řeky a Beskydkým podhůřím na břehu pravém. Z toho je zřejmé, proč je\n      u nás tak veliká různorodost květeny a vegetace. To se týká i hub.\n      Odborníci z Ostravského muzea prozkoumali ",
      typeof:
        "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/výskyt-termu",
      cssSelector:
        ":root > :nth-child(2) > :nth-child(1) > :nth-child(5) > :nth-child(1) > :nth-child(2) > :nth-child(4)",
    },
    term: null,
    annotatationStatus: 0,
  },
];

export default mockExistingOccurrences;