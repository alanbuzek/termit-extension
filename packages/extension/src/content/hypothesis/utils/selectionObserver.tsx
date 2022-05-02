import ListenerCollection from "./listenerCollection";

/**
 * Return the current selection or `null` if there is no selection or it is empty.
 *
 * @param {Document} document
 * @return {Range|null}
 */
function selectedRange(document) {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (range.collapsed) {
    return null;
  }
  return range;
}

/**
 * An observer that watches for and buffers changes to the document's current selection.
 */
export default class SelectionObserver {
  private pendingCallback: any;
  private eventHandler: (event: any) => void;
  private document: Document;
  private listeners: ListenerCollection;
  private events: string[];

  /**
   * Start observing changes to the current selection in the document.
   *
   * @param {(range: Range|null, event: any) => any} callback -
   *   Callback invoked with the selected region of the document when it has
   *   changed.
   * @param {Document} document_ - Test seam
   */
  constructor(callback, document_ = document) {
    let isMouseDown = false;

    this.pendingCallback = null;

    const scheduleCallback = (delay = 10, event?) => {
      this.pendingCallback = setTimeout(() => {
        callback(selectedRange(document_), event);
      }, delay);
    };

    this.eventHandler = (event) => {
      if (event.type === "mousedown" || event.type === "mouseup") {
        isMouseDown = event.type === "mousedown";
        return;
      }

      // If the user makes a selection with the mouse, wait until they release
      // it before reporting a selection change.
      if (isMouseDown) {
        return;
      }

      this._cancelPendingCallback();

      // Schedule a notification after a short delay.
      const delay = 10;
      scheduleCallback(delay, event);
    };

    this.document = document_;
    this.listeners = new ListenerCollection();
    this.events = ["mousedown", "mouseup", "selectionchange", "click"];
    for (let event of this.events) {
      this.listeners.add(document_, event, this.eventHandler, undefined);
    }

    // Report the initial selection.
    scheduleCallback(1);
  }

  disconnect() {
    this.listeners.removeAll();
    this._cancelPendingCallback();
  }

  _cancelPendingCallback() {
    if (this.pendingCallback) {
      clearTimeout(this.pendingCallback);
      this.pendingCallback = null;
    }
  }
}
