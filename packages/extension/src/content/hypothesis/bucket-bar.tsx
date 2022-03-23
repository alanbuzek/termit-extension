import React from "react";
import ReactDOM from "react-dom";
import { loadStyles } from "./ContentPopup";
import Buckets from "../components/Buckets";
import { computeBuckets } from "./utils/buckets";

/**
 * @typedef {import('../types/annotator').AnchorPosition} AnchorPosition
 * @typedef {import('../types/annotator').Destroyable} Destroyable
 */

/**
 * Controller for the "bucket bar" shown alongside the sidebar indicating where
 * annotations are in the document.
 *
 * @implements {Destroyable}
 */
export class BucketBar {
  _bucketsContainer: HTMLDivElement;
  _onFocusAnnotations: any;
  _onScrollToClosestOffScreenAnchor: any;
  _onSelectAnnotations: any;
  /**
   * @param {HTMLElement} container
   * @param {object} options
   *   @param {(tags: string[]) => void} options.onFocusAnnotations
   *   @param {(tags: string[], direction: 'down'|'up') => void} options.onScrollToClosestOffScreenAnchor
   *   @param {(tags: string[], toggle: boolean) => void} options.onSelectAnnotations
   */
  constructor(
    container,
    {
      onFocusAnnotations,
      onScrollToClosestOffScreenAnchor,
      onSelectAnnotations,
    }
  ) {
    this._bucketsContainer = document.createElement("div");
    container.appendChild(this._bucketsContainer);

    this._onFocusAnnotations = onFocusAnnotations;
    this._onScrollToClosestOffScreenAnchor = onScrollToClosestOffScreenAnchor;
    this._onSelectAnnotations = onSelectAnnotations;

    // Immediately render the bucket bar
    this.update([]);
  }

  destroy() {
    ReactDOM.render(null, this._bucketsContainer);
    this._bucketsContainer.remove();
  }

  /**
   * @param {AnchorPosition[]} positions
   */
  update(positions) {
    const buckets = computeBuckets(positions);
    ReactDOM.render(
      <Buckets
        above={buckets.above}
        below={buckets.below}
        buckets={buckets.buckets}
        onFocusAnnotations={(tags) => this._onFocusAnnotations(tags)}
        onScrollToClosestOffScreenAnchor={(tags, direction) =>
          this._onScrollToClosestOffScreenAnchor(tags, direction)
        }
        onSelectAnnotations={(tags, toogle) =>
          this._onSelectAnnotations(tags, toogle)
        }
      />,
      this._bucketsContainer,
      () => {
        loadStyles(this._bucketsContainer, "annotator");
        loadStyles(this._bucketsContainer, "styles");
        loadStyles(this._bucketsContainer, "bootstrap-termit");
      }
    );
  }
}
