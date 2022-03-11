import React from "react";
import ReactDOM from "react-dom";
import { loadStyles } from './adder';
import SidebarApp from "./components/SidebarApp";

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
  /**
   * @param {HTMLElement} container - Element into which the toolbar is rendered
   * @param {ToolbarOptions} options
   */
  constructor(container, state) {
    this._container = container;
    this._state = state;
    this.render();
  }

  getWidth() {
    const content = /** @type {HTMLElement} */ this._container.firstChild;
    return content.getBoundingClientRect().width;
  }

  render() {
    ReactDOM.render(<SidebarApp state={this._state} />, this._container, () => {
      loadStyles(this._container, "annotator");
      loadStyles(this._container, "styles");
      loadStyles(this._container, "bootstrap-termit");
    });
  }
}
