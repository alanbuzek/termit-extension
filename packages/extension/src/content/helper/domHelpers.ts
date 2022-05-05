// ad-hoc check for Chrome's embedded pdf viewer
export const isPagePDFViewer = () => {
  const pdfViewer = document.querySelector('embed[type="application/pdf"]');

  if (!pdfViewer) {
    return;
  }

  const widthDiff = Math.abs(
    document.documentElement.clientWidth -
      pdfViewer.getBoundingClientRect().width
  );

  const heightDiff = Math.abs(
    document.documentElement.clientHeight -
      pdfViewer.getBoundingClientRect().height
  );

  // can be slightly off (usually by just a few decimals)
  return widthDiff + heightDiff < 100;
};

export default {
  isPagePDFViewer,
};
