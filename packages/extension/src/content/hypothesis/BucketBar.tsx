import React from "react";
import ReactDOM from "react-dom";
import { loadStyles } from "./ContentPopupContainer";
import Buckets from "../components/Buckets";
import { computeBuckets } from "./utils/buckets.ts";

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
  private bucketsContainer: HTMLDivElement;
  private onFocusAnnotations: any;
  private onScrollToClosestOffScreenAnchor: any;
  private onSelectAnnotations: any;
  
  constructor(
    container,
    {
      onFocusAnnotations,
      onScrollToClosestOffScreenAnchor,
      onSelectAnnotations,
    }
  ) {
    this.bucketsContainer = document.createElement("div");
    container.appendChild(this.bucketsContainer);

    this.onFocusAnnotations = onFocusAnnotations;
    this.onScrollToClosestOffScreenAnchor = onScrollToClosestOffScreenAnchor;
    this.onSelectAnnotations = onSelectAnnotations;

    // Immediately render the bucket bar
    this.update([]);
  }

  destroy() {
    ReactDOM.render(null, this.bucketsContainer);
    this.bucketsContainer.remove();
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
        onFocusAnnotations={(tags) => this.onFocusAnnotations(tags)}
        onScrollToClosestOffScreenAnchor={(tags, direction) =>
          this.onScrollToClosestOffScreenAnchor(tags, direction)
        }
        onSelectAnnotations={(tags, toogle) =>
          this.onSelectAnnotations(tags, toogle)
        }
      />,
      this.bucketsContainer,
      () => {
        // TODO
        loadStyles(this.bucketsContainer, "annotator");
        loadStyles(this.bucketsContainer, "styles");
        loadStyles(this.bucketsContainer, "bootstrap-termit");
      }
    );
  }
}
