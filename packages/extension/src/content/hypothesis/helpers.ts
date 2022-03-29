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
export function preloadURL(doc, type, url) {
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

export const preloadContentStyles = () => {
  const styleSheetsToLoad = [
    "/static/css/annotator.css",
    "/static/css/styles.css",
    "/static/css/bootstrap-termit.css",
  ];

  styleSheetsToLoad.forEach((stylesheetPath) =>
    preloadURL(document, "style", chrome.runtime.getURL(stylesheetPath))
  );
};
