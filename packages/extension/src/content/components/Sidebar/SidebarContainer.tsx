import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import { ContentActions, ContentState } from "../..";
import cs from "../../../common/i18n/cs";
import en from "../../../common/i18n/en";
import StyleSheetLoader from "../../hypothesis/StyleSheetLoader";
import SidebarApp from "./SidebarApp";

export default class SidebarContainer {
  private container: HTMLElement;
  private state: ContentState;
  private handleAnnotatePage;
  private handleDeleteAnnotation;
  private stylesHaveBeenLoaded: boolean;
  /**
   * @param {HTMLElement} container - Element into which the toolbar is rendered
   * @param {ToolbarOptions} options
   */
  constructor(container, state, handleAnnotatePage, handleDeleteAnnotation) {
    this.container = container;
    this.state = state;
    this.handleAnnotatePage = handleAnnotatePage;
    this.handleDeleteAnnotation = handleDeleteAnnotation;
    this.stylesHaveBeenLoaded = false;
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
      <IntlProvider
        locale={this.state.locale}
        defaultLocale="en"
        messages={this.state.locale === "en" ? en.messages : cs.messages}
      >
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
        if (!this.stylesHaveBeenLoaded) {
          this.stylesHaveBeenLoaded = true;
          StyleSheetLoader.loadContentStylesSheets(this.container);
        }
      }
    );
  }
}
