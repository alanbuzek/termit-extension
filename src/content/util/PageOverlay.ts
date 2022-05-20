const internals = {
  isInitiated: false,
  isActive: false,
  init() {
    if (this.isInitiated) {
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'termit-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.isInitiated = true;
  },
};

/**
 * Shows a semi transparent dark overlay over the page, e.g. when the page is loading or a popup is open
 */
const PageOverlay = {
  on() {
    internals.init();
    document.getElementById('termit-overlay')!.style.display = 'block';
    internals.isActive = true;
  },
  off() {
    if (!internals.isInitiated) {
      return;
    }
    document.getElementById('termit-overlay')!.style.display = 'none';
    internals.isActive = false;
  },
  destroy() {
    const element = document.getElementById('termit-overlay')!;

    document.body.removeChild(element);
    internals.isInitiated = false;
  },
};

export default PageOverlay;
