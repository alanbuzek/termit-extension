/* global chrome */
/* src/content.js */
import { MessageType } from "../types";
import AnnotatorGuest from "./annotatorGuest";
import Mark from "../markjs";
import { EventBus } from "./utils/emitter";
import React from "react";
import { Sidebar } from "./sidebar";

/**
 * Mark an element as having been added by the boot script.
 *
 * This marker is later used to know which elements to remove when unloading
 * the client.
 *
 * @param {HTMLElement} el
 */
function tagElement(el) {
  el.setAttribute("data-hypothesis-asset", "");
}

/**
 * Preload a URL using a `<link rel="preload" as="<type>" ...>` element
 *
 * This can be used to preload an API request or other resource which we know
 * that the client will load.
 *
 * @param {Document} doc
 * @param {string} type - Type of resource
 * @param {string} url
 */
function preloadURL(doc, type, url) {
  const link = doc.createElement("link");
  link.rel = "preload";
  link.as = type;
  link.href = url;

  // If this is a resource that we are going to read the contents of, then we
  // need to make a cross-origin request. For other types, use a non cross-origin
  // request which returns a response that is opaque.
  if (type === "fetch") {
    link.crossOrigin = "anonymous";
  }

  tagElement(link);
  doc.head.appendChild(link);
}

/**
 * Extract the protocol and hostname (ie. host without port) from the URL.
 *
 * We don't use the URL constructor here because IE and early versions of Edge
 * do not support it and this code runs early in the life of the app before any
 * polyfills can be loaded.
 */
function extractOrigin(url) {
  const match = url.match(/(https?):\/\/([^:/]+)/);
  if (!match) {
    return null;
  }
  return { protocol: match[1], hostname: match[2] };
}

function currentScriptOrigin(document_ = document) {
  const scriptEl =
    /** @type {HTMLScriptElement|null} */ document_.currentScript;
  if (!scriptEl) {
    // Function was called outside of initial script execution.
    return null;
  }
  return extractOrigin(scriptEl.src);
}

/**
 * Replace references to `current_host` and `current_scheme` URL template
 * parameters with the corresponding elements of the current script URL.
 *
 * During local development, there are cases when the client/h needs to be accessed
 * from a device or VM that is not the system where the development server is
 * running. In that case, all references to `localhost` need to be replaced
 * with the IP/hostname of the dev server.
 *
 * @param {string} url
 * @param {Document} document_
 */
export function processUrlTemplate(url, document_ = document) {
  if (url.indexOf("{") === -1) {
    // Not a template. This should always be the case in production.
    return url;
  }

  const origin = currentScriptOrigin(document_);

  if (origin) {
    url = url.replace("{current_host}", origin.hostname);
    url = url.replace("{current_scheme}", origin.protocol);
  } else {
    throw new Error(
      "Could not process URL template because script origin is unknown"
    );
  }

  return url;
}

// `Object.assign()`-like helper. Used because this script needs to work
// in IE 10/11 without polyfills.
function assign(dest, src) {
  for (const k in src) {
    if (src.hasOwnProperty(k)) {
      dest[k] = src[k];
    }
  }
  return dest;
}

/**
 * Return a parsed `js-hypothesis-config` object from the document, or `{}`.
 *
 * Find all `<script class="js-hypothesis-config">` tags in the given document,
 * parse them as JSON, and return the parsed object.
 *
 * If there are no `js-hypothesis-config` tags in the document then return
 * `{}`.
 *
 * If there are multiple `js-hypothesis-config` tags in the document then merge
 * them into a single returned object (when multiple scripts contain the same
 * setting names, scripts further down in the document override those further
 * up).
 *
 * @param {Document|Element} document - The root element to search.
 */
export function parseJsonConfig(document) {
  const config = {};
  const settingsElements = document.querySelectorAll(
    "script.js-hypothesis-config"
  );

  for (let i = 0; i < settingsElements.length; i++) {
    let settings;
    try {
      settings = JSON.parse(settingsElements[i].textContent || "");
    } catch (err) {
      console.warn(
        "Could not parse settings from js-hypothesis-config tags",
        err
      );
      settings = {};
    }
    assign(config, settings);
  }

  return config;
}

const settings = parseJsonConfig(document);
const assetRoot = processUrlTemplate(settings.assetRoot || "__ASSET_ROOT__");

const config = {
  assetRoot,
};


const contentState = {
  annotations: null,
}

const annotate = () => {
  chrome.runtime.sendMessage(
    {
      type: MessageType.GetAnnotations,
      payload: {
        // pageLang: document.documentElement.lang,
        pageHtml: document.body.outerHTML,
      },
    },
    (response) => {
      const {
        data: { termOccurrencesSelectors: data },
        error,
      } = response;

      if (error || !data) {
        console.error("There was an error annotationg this page: ", error);
        return;
      }

      console.log('got data: ', data);
      contentState.annotations = data;
      const results = {
        highlights: {
          failures: 0,
          successes: 0,
          overselectedFailures: 0,
        },
        selectors: {
          successes: 0,
          failures: 0,
          overselectedFailures: 0,
        },
      };
      data.forEach(({ cssSelectors, termOccurrences }) => {
        const selectedElements = Array.from(
          document.querySelectorAll(cssSelectors[0])
        );
        if (selectedElements.length === 1) {
          results.selectors.successes += 1;
        } else if (selectedElements.length === 0) {
          console.log(
            "[Selector] Failure: ",
            cssSelectors,
            ", ",
            selectedElements
          );
          results.selectors.failures += 1;
        } else {
          results.selectors.overselectedFailures += 1;
          console.log(
            "[Selector] Overseledcted Failure: ",
            cssSelectors,
            ", ",
            selectedElements
          );
        }
        if (selectedElements.length === 1) {
          const markInstance = new Mark(selectedElements[0]);
          termOccurrences.forEach((termOccurance) => {
            markInstance.mark(termOccurance.originalTerm, {
              accuracy: {
                value: "exactly",
                limiters: [
                  ",",
                  ".",
                  ":",
                  ";",
                  "'",
                  '"',
                  "?",
                  "!",
                  ")",
                  "(",
                  "-",
                ],
              },
              filter(node, term, offestInCurrentNode) {
                let calculatedOffset = node.textContent.slice(
                  0,
                  offestInCurrentNode
                );
                let currNode = node;
                while (currNode.previousSibling) {
                  currNode = currNode.previousSibling;
                  if (currNode.textContent) {
                    calculatedOffset = currNode.textContent + calculatedOffset;
                  }
                }

                const pureLeft = calculatedOffset.replace(/\s/g, "");
                const pureRight = termOccurance.startOffset.replace(/\s/g, "");

                return pureLeft === pureRight;
              },
              element: "termit-h",
              diacritcs: false,
              exclude: ["termit-h"],
              caseSensitive: true,
              separateWordSearch: false,
              className: `termit-highlighted-word`,
              done(numberOfMatches) {
                if (numberOfMatches === 1) {
                  results.highlights.successes += 1;
                } else if (numberOfMatches === 0) {
                  console.log(
                    "Failure: ",
                    termOccurance,
                    ", ",
                    selectedElements[0]
                  );
                  results.highlights.failures += 1;
                } else {
                  results.highlights.overselectedFailures += 1;
                  console.log(
                    "Overseledcted Failure: ",
                    termOccurance,
                    ", ",
                    selectedElements[0]
                  );
                }
              },
            });
          });
        }
      });


      initSidebar();
    }
  );
};

export const overlay = {
  previousOverflowValue: "",
  init() {
    const overlay = document.createElement("div");
    overlay.id = "termit-overlay";
    document.body.appendChild(overlay);
  },
  on() {
    this.previousOverflowValue = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.getElementById("termit-overlay").style.display = "block";
  },
  off() {
    document.body.style.overflow = this.previousOverflowValue;
    document.getElementById("termit-overlay").style.display = "none";
  },
};

window.addEventListener("load", () => {
  overlay.init();
  preloadURL(
    document,
    "style",
    chrome.runtime.getURL("/static/css/annotator.css")
  );
  preloadURL(
    document,
    "style",
    chrome.runtime.getURL("/static/css/styles.css")
  );
  preloadURL(
    document,
    "style",
    chrome.runtime.getURL("/static/css/bootstrap-termit.css")
  );
  annotate();
  // setTimeout(() => {

  new AnnotatorGuest(document.body);
  // }, 10000);
});

/**
 * List of allowed configuration keys per application context. Keys omitted
 * in a given context will be removed from the relative configs when calling
 * getConfig.
 *
 * @param {AppContext} [appContext] - The name of the app.
 */
function configurationKeys(appContext) {
  const contexts = {
    annotator: ["clientUrl", "subFrameIdentifier"],
    sidebar: [
      "appType",
      "annotations",
      "branding",
      "enableExperimentalNewNoteButton",
      "externalContainerSelector",
      "focus",
      "group",
      "onLayoutChange",
      "openSidebar",
      "query",
      "requestConfigFromFrame",
      "services",
      "showHighlights",
      "sidebarAppUrl",
      "theme",
      "usernameUrl",
    ],
    notebook: [
      "branding",
      "group",
      "notebookAppUrl",
      "requestConfigFromFrame",
      "services",
      "theme",
      "usernameUrl",
    ],
  };

  switch (appContext) {
    case "annotator":
      return contexts.annotator;
    case "sidebar":
      return contexts.sidebar;
    case "notebook":
      return contexts.notebook;
    case "all":
      // Complete list of configuration keys used for testing.
      return [...contexts.annotator, ...contexts.sidebar, ...contexts.notebook];
    default:
      throw new Error(`Invalid application context used: "${appContext}"`);
  }
}

/** @type {ValueGetter} */
function getHostPageSetting(settings, name) {
  return settings.hostPageSetting(name);
}

/**
 * Definitions of configuration keys
 * @type {ConfigDefinitionMap}
 */
const configDefinitions = {
  annotations: {
    allowInBrowserExt: true,
    defaultValue: null,
    getValue: (settings) => settings.annotations,
  },
  appType: {
    allowInBrowserExt: true,
    defaultValue: null,
    getValue: getHostPageSetting,
  },
  branding: {
    defaultValue: null,
    allowInBrowserExt: false,
    getValue: getHostPageSetting,
  },
  // URL of the client's boot script. Used when injecting the client into
  // child iframes.
  clientUrl: {
    allowInBrowserExt: true,
    defaultValue: null,
    getValue: (settings) => settings.clientUrl,
  },
  enableExperimentalNewNoteButton: {
    allowInBrowserExt: false,
    defaultValue: null,
    getValue: getHostPageSetting,
  },
  group: {
    allowInBrowserExt: true,
    defaultValue: null,
    getValue: (settings) => settings.group,
  },
  focus: {
    allowInBrowserExt: false,
    defaultValue: null,
    getValue: getHostPageSetting,
  },
  theme: {
    allowInBrowserExt: false,
    defaultValue: null,
    getValue: getHostPageSetting,
  },
  usernameUrl: {
    allowInBrowserExt: false,
    defaultValue: null,
    getValue: getHostPageSetting,
  },
  onLayoutChange: {
    allowInBrowserExt: false,
    defaultValue: null,
    getValue: getHostPageSetting,
  },
  openSidebar: {
    allowInBrowserExt: true,
    defaultValue: false,
    coerce: () => false,
    getValue: getHostPageSetting,
  },
  query: {
    allowInBrowserExt: true,
    defaultValue: null,
    getValue: (settings) => settings.query,
  },
  requestConfigFromFrame: {
    allowInBrowserExt: false,
    defaultValue: null,
    getValue: getHostPageSetting,
  },
  services: {
    allowInBrowserExt: false,
    defaultValue: null,
    getValue: getHostPageSetting,
  },
  showHighlights: {
    allowInBrowserExt: false,
    defaultValue: "always",
    getValue: (settings) => settings.showHighlights,
  },
  notebookAppUrl: {
    allowInBrowserExt: true,
    defaultValue: null,
    getValue: (settings) => settings.notebookAppUrl,
  },
  sidebarAppUrl: {
    allowInBrowserExt: true,
    defaultValue: null,
    getValue: (settings) => settings.sidebarAppUrl,
  },
  // Sub-frame identifier given when a frame is being embedded into
  // by a top level client
  subFrameIdentifier: {
    allowInBrowserExt: true,
    defaultValue: null,
    getValue: getHostPageSetting,
  },
  externalContainerSelector: {
    allowInBrowserExt: false,
    defaultValue: null,
    getValue: getHostPageSetting,
  },
};

/**
 * Return the configuration for a given application context.
 *
 * @param {AppContext} [appContext] - The name of the app.
 */
export function getConfig(appContext = "annotator", window_ = window) {
  // const settings = settingsFrom(window_);
  const settings = {};
  const config = {};
  // Filter the config based on the application context as some config values
  // may be inappropriate or erroneous for some applications.
  let filteredKeys = configurationKeys(appContext);
  filteredKeys.forEach((name) => {
    const configDef = configDefinitions[name];
    const hasDefault = configDef.defaultValue !== undefined; // A default could be null

    // Only allow certain values in the browser extension context
    if (!configDef.allowInBrowserExt) {
      // If the value is not allowed here, then set to the default if provided, otherwise ignore
      // the key:value pair
      if (hasDefault) {
        config[name] = configDef.defaultValue;
      }
      return;
    }
  });

  return config;
}

function initSidebar() {
  const eventBus = new EventBus();
  const sidebar = new Sidebar(document.body, eventBus, contentState);
  setTimeout(() => {
    // sidebar.open();
    console.log("sidebar was just opened now");
  }, 1000);
}
