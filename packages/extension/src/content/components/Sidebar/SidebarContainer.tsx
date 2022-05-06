import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import { ContentActions, ContentState } from "../..";
import cs from "../../../cs.locale";
import { loadStyles } from "../../hypothesis/ContentPopupContainer";
import SidebarApp from "./SidebarApp";

export default class SidebarContainer {
  private container: HTMLElement;
  private state: ContentState;
  private handleAnnotatePage;
  private handleDeleteAnnotation;
  private loadedStyles: boolean;
  /**
   * @param {HTMLElement} container - Element into which the toolbar is rendered
   * @param {ToolbarOptions} options
   */
  constructor(container, state, handleAnnotatePage, handleDeleteAnnotation) {
    this.container = container;
    this.state = state;
    this.handleAnnotatePage = handleAnnotatePage;
    this.handleDeleteAnnotation = handleDeleteAnnotation;
    this.loadedStyles = false;
    this.render();
  }

  getWidth() {
    const content: any = this.container.firstChild;
    return content.getBoundingClientRect().width;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.container);
  }

  render() {
    ReactDOM.render(
      <IntlProvider locale="cs-CZ" defaultLocale="en" messages={cs}>
        <SidebarApp
          handleDeleteAnnotation={this.handleDeleteAnnotation}
          handleAnnotatePage={this.handleAnnotatePage}
          handleDeletePage={ContentActions.removeWebsiteAnnotations}
          handleDeleteSuggestions={ContentActions.removeSuggestedAnnotations}
          state={this.state}
        />
      </IntlProvider>,
      this.container,
      () => {
        if (!this.loadedStyles) {
          loadStyles(this.container, "annotator");
          loadStyles(this.container, "styles");
          loadStyles(this.container, "bootstrap-termit");
          this.loadedStyles = true;
        }
      }
    );
  }
}
