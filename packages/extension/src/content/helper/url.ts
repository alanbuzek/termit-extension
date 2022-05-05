export function getPageUrl() {
  // ignore any query params
  return document.location.href
    .replace(document.location.search, "")
    .replace(document.location.hash, "");
}

export default {
  getPageUrl,
};
