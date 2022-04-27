import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import { ContentActions, ContentState } from "../..";
import cs from "../../../cs.locale";
import { loadStyles } from "../../hypothesis/ContentPopupContainer";
import SidebarApp from "./SidebarApp";

/**
 * @typedef ToolbarOptions
 * @prop {() => any} createAnnotation
 * @prop {(open: boolean) => any} setSidebarOpen
 * @prop {(visible: boolean) => any} setHighlightsVisible
 */

/**
 * Controller for the toolbar on the edge of the sidebar.
 *
 * This toolbar provides controls for opening and closing the sidebar, toggling
 * highlight visibility etc.
 */
export default class SidebarContainer {
  _container: any;
  _state: ContentState;
  private handleAnnotatePage: any;
  _loadedStyles: boolean;
  /**
   * @param {HTMLElement} container - Element into which the toolbar is rendered
   * @param {ToolbarOptions} options
   */
  constructor(container, state, handleAnnotatePage) {
    this._container = container;
    this._state = state;
    this.handleAnnotatePage = handleAnnotatePage;
    this._loadedStyles = false;
    this.render();
  }

  getWidth() {
    const content = /** @type {HTMLElement} */ this._container.firstChild;
    return content.getBoundingClientRect().width;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this._container);
  }

  render() {
    ReactDOM.render(
      <IntlProvider locale="cs-CZ" defaultLocale="en" messages={cs}>
        <SidebarApp
          handleAnnotatePage={this.handleAnnotatePage}
          handleDeletePage={ContentActions.removeWebsiteAnnotations}
          state={this._state}
        />
      </IntlProvider>,
      this._container,
      () => {
        if (!this._loadedStyles) {
          loadStyles(this._container, "annotator");
          loadStyles(this._container, "styles");
          loadStyles(this._container, "bootstrap-termit");
          this._loadedStyles = true;
        }
      }
    );
  }
}
