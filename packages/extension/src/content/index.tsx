/* global chrome */
/* src/content.js */
import { MessageType } from "../types";
import AnnotatorGuest from "./annotatorGuest";
import Mark from "../markjs";

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

/**
 * @param {SidebarAppConfig|AnnotatorConfig} config
 * @param {string} path
 */
function assetURL(config, path) {
  return config.assetRoot + "build/" + config.manifest[path];
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
      const { data: { termOccurrencesSelectors: data }, error } = response;
      console.log('response: ', data);

      if (error || !data) {
        console.error("There was an error annotationg this page: ", error);
        return;
      }

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
    }
  );
};

window.addEventListener("load", () => {
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

  new AnnotatorGuest(document.body);
  annotate();
});
