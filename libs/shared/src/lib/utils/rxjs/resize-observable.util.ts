import { Observable } from 'rxjs';

/**
 * Resize observer as observable.
 * Allow to use debounceTime before calling callback.
 */
export class ResizeObservable extends Observable<ResizeObserverEntry[]> {
  /**
   * Resize observer as observable.
   * Allow to use debounceTime before calling callback.
   *
   * @param elem HTML element to observe
   */
  constructor(elem: HTMLElement) {
    super((subscriber) => {
      const ro = new ResizeObserver((entries) => {
        subscriber.next(entries);
      });

      // Observe one or multiple elements
      ro.observe(elem);

      return function unsubscribe() {
        ro.unobserve(elem);
        ro.disconnect();
      };
    });
  }
}
