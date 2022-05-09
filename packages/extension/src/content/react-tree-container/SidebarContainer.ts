import Vocabulary from '../../termit-ui-common/model/Vocabulary';

import { createShadowRoot } from './AnnotationPopupContainer';
import SidebarContainer from '../component/sidebar/SidebarContainer';
import ToolbarContainer from './ToolbarContainer';
import { ContentState } from '../ContentController';
import Annotation from '../Annotation';
import ExtensionMessage from '../../shared/ExtensionMessage';

export default class Sidebar {
  private sidebarComponent: SidebarContainer;

  private container: HTMLDivElement;

  private hypothesisSidebar: HTMLElement;

  private toolbar: ToolbarContainer;

  private shadowRoot: ShadowRoot;

  constructor(
    element: HTMLElement,
    state: ContentState,
    handleAnnotatePage: (vocabulary: Vocabulary) => void,
    handleDeleteAnnotation: (annotation: Annotation) => void
  ) {
    this.container = document.createElement('div');
    this.container.className =
      'annotator-frame annotator-collapsed termit-sidebar-container';
    this.container.style.marginLeft = '';

    // Wrap up the 'container' element into a shadow DOM so it is not affected by host CSS styles
    this.hypothesisSidebar = document.createElement('hypothesis-sidebar');
    this.shadowRoot = createShadowRoot(this.hypothesisSidebar);
    this.shadowRoot.appendChild(this.container);

    element.appendChild(this.hypothesisSidebar);

    const sidebarContainer = document.createElement(
      'hypothesis-sidebar-container'
    );
    sidebarContainer.style.width = '100%';
    sidebarContainer.style.height = '100%';
    sidebarContainer.style.position = 'relative';
    sidebarContainer.style['z-index'] = 3;

    this.container.appendChild(sidebarContainer);
    this.sidebarComponent = new SidebarContainer(
      sidebarContainer,
      state,
      handleAnnotatePage,
      handleDeleteAnnotation
    );

    // Set up the toolbar on the left edge of the sidebar.
    const toolbarContainer = document.createElement('div');
    this.toolbar = new ToolbarContainer(
      toolbarContainer,
      (open) => (open ? this.open() : this.close()),
      state
    );

    chrome.runtime.onMessage.addListener((message) => {
      // eslint-disable-next-line default-case
      switch (message.type) {
        case ExtensionMessage.OpenToolbar: {
          if (this.toolbar.sidebarOpen) {
            this.close();
          } else {
            this.open();
          }
          break;
        }
      }
    });

    this.container.prepend(toolbarContainer);

    this.close();
  }

  destroy() {
    if (this.hypothesisSidebar) {
      this.hypothesisSidebar.remove();
    }
    this.sidebarComponent?.destroy();
  }

  open() {
    if (this.container) {
      const { width } = this.container.getBoundingClientRect();
      this.container.style.marginLeft = `${-1 * width}px`;
      this.container.classList.remove('annotator-collapsed');
    }

    this.toolbar.sidebarOpen = true;
  }

  close() {
    if (this.container) {
      this.container.style.marginLeft = '';
      this.container.classList.add('annotator-collapsed');
    }

    this.toolbar.sidebarOpen = false;
  }

  render() {
    this.sidebarComponent.render();
    this.toolbar.render();
  }

  public getShadowRoot() {
    return this.shadowRoot;
  }
}
