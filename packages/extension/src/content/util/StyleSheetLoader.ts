const styleSheetsToLoad = [
  '/static/css/annotator.css',
  '/static/css/styles.css',
  '/static/css/bootstrap-termit.css',
];

const internals = {
  loadStyleSheet(container: HTMLElement, filePath: string) {
    // Find the preloaded stylesheet added by 'preloadContentStylesheets'.
    const url: string | undefined = (document.querySelector(
      `link[rel="preload"][href*="${filePath}"]`
    ) as any)!.href;

    if (!url) {
      return;
    }

    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = url;
    container.appendChild(linkEl);
  },
  //  Preload a URL using a <link> tag with the "preload" attribute
  preloadStyleSheetURL(doc: Document, type: string, url: string) {
    const link = doc.createElement('link');
    link.rel = 'preload';
    link.as = type;
    link.href = url;

    doc.head.appendChild(link);
  },
};

const StyleSheetLoader = {
  preloadContentStylesheets() {
    styleSheetsToLoad.forEach((stylesheetPath) =>
      internals.preloadStyleSheetURL(
        document,
        'style',
        chrome.runtime.getURL(stylesheetPath)
      )
    );
  },
  loadContentStylesSheets(container: HTMLElement) {
    styleSheetsToLoad.forEach((stylesheetPath) =>
      internals.loadStyleSheet(container, stylesheetPath)
    );
  },
};

export default StyleSheetLoader;
