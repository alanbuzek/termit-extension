/**
 * @typedef Listener
 * @prop {EventTarget} eventTarget
 * @prop {string} eventType
 * @prop {(event: Event) => void} listener
 */

/**
 * Utility that provides a way to conveniently remove a set of DOM event
 * listeners when they are no longer needed.
 */
export default class ListenerCollection {
  private listeners: Map<symbol, any>;

  constructor() {
    /** @type {Map<Symbol, Listener>} */
    this.listeners = new Map();
  }

  /**
   * Add a listener and return an ID that can be used to remove it later
   *
   * @param {Listener['eventTarget']} eventTarget
   * @param {Listener['eventType']} eventType
   * @param {Listener['listener']} listener
   * @param {AddEventListenerOptions} [options]
   */
  add(eventTarget, eventType, listener, options) {
    eventTarget.addEventListener(eventType, listener, options);
    // eslint-disable-next-line symbol-description
    const symbol = Symbol();
    this.listeners.set(symbol, { eventTarget, eventType, listener });
    return symbol;
  }

  /**
   * Remove a listener using a listenerId
   *
   * @param {Symbol} listenerId
   */
  remove(listenerId) {
    const event = this.listeners.get(listenerId);
    if (event) {
      const { eventTarget, eventType, listener } = event;
      eventTarget.removeEventListener(eventType, listener);
      this.listeners.delete(listenerId);
    }
  }

  removeAll() {
    this.listeners.forEach(({ eventTarget, eventType, listener }) => {
      eventTarget.removeEventListener(eventType, listener);
    });
    this.listeners.clear();
  }
}
