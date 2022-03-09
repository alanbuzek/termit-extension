import React from "react";
import ReactDOM from "react-dom";
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
  /**
   * @param {HTMLElement} container - Element into which the toolbar is rendered
   * @param {ToolbarOptions} options
   */
  constructor(container) {
    this._container = container;
    this.render();
  }

  getWidth() {
    const content = /** @type {HTMLElement} */ this._container.firstChild;
    return content.getBoundingClientRect().width;
  }

  render() {
    ReactDOM.render(
      <SidebarApp />,
      this._container
    );
  }
}
