import React from "react";
import ReactDOM from "react-dom";
import { loadStyles } from "../hypothesis/adder";
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
export default class SidebarBox {
  _container: any;
  _state: any;
  _annotatePage: any;
  _loadedStyles: boolean;
  /**
   * @param {HTMLElement} container - Element into which the toolbar is rendered
   * @param {ToolbarOptions} options
   */
  constructor(container, state, annotatePage) {
    this._container = container;
    this._state = state;
    this._annotatePage = annotatePage;
    this._loadedStyles = false;
    this.render();
  }

  getWidth() {
    const content = /** @type {HTMLElement} */ this._container.firstChild;
    return content.getBoundingClientRect().width;
  }

  render() {
    ReactDOM.render(
      <SidebarApp annotatePage={this._annotatePage} state={this._state} />,
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
