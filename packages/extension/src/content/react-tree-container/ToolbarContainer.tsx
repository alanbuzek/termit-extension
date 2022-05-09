import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from '../component/sidebar/Toolbar';
import { ContentState } from '../ContentController';
import StyleSheetLoader from '../util/StyleSheetLoader';

class ToolbarContainer {
  private container: HTMLElement;

  private sidebarToggleButton;

  private isSidebarOpen: boolean;

  private state: ContentState;

  private toggleSidebar: () => any;

  private stylesHaveBeenLoaded = false;

  constructor(container, setSidebarOpen, state) {
    this.container = container;
    this.state = state;

    this.isSidebarOpen = false;

    this.toggleSidebar = () => setSidebarOpen(!this.sidebarOpen);

    /** Reference to the sidebar toggle button. */
    this.sidebarToggleButton = React.createRef();

    this.render();
  }

  getWidth() {
    const content = this.container.firstChild as any;
    return content.getBoundingClientRect().width;
  }

  set sidebarOpen(open) {
    this.isSidebarOpen = open;
    this.render();
  }

  get sidebarOpen() {
    return this.isSidebarOpen;
  }

  render() {
    ReactDOM.render(
      <Toolbar
        isSidebarOpen={this.isSidebarOpen}
        toggleSidebar={this.toggleSidebar}
        toggleSidebarRef={this.sidebarToggleButton.current}
        loading={this.state.globalLoading}
      />,
      this.container,
      () => {
        if (!this.stylesHaveBeenLoaded) {
          this.stylesHaveBeenLoaded = true;
          StyleSheetLoader.loadContentStylesSheets(this.container as any);
        }
      }
    );
  }
}

export default ToolbarContainer;
