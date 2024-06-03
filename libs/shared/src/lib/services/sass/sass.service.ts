import { Injectable } from '@angular/core';

/**
 * Sass service.
 * Transforms sass to css, using web worker.
 */
@Injectable({
  providedIn: 'root',
})
export class SassService {
  /** Service worker instance */
  worker?: Worker;
  /** Id of request */
  private requestId = 0;
  /** Pending requests. Enable to match requests with service worker's responses */
  private pendingRequests = new Map<number, (value: string) => void>();

  /**
   * Sass service.
   * Transforms sass to css, using web worker.
   */
  constructor() {
    if (typeof Worker !== 'undefined') {
      // Create a new worker instance
      this.worker = new Worker(
        new URL('./sass-worker.worker', import.meta.url)
      );
      console.log('Worker initialized:', this.worker);
      // Listen for messages from the worker
      this.worker.onmessage = ({ data }) => {
        console.log('> on message <');
        const { id, css } = data;
        const resolve = this.pendingRequests.get(id);
        if (resolve) {
          resolve(css);
          this.pendingRequests.delete(id);
        }
      };
      this.worker.onerror = function (event) {
        console.log(event.message, event);
      };
      this.worker.postMessage({ id: 0, sass: '{}' });
    } else {
      console.error('Web Workers are not supported in this environment.');
    }
  }

  /**
   * Converts sass to css
   *
   * @param sass sass style as string
   * @returns sass style as css
   */
  convertToCss(sass: string): Promise<any> {
    return new Promise((resolve) => {
      if (this.worker) {
        console.log('> send message <');
        // Generate a unique request ID
        const id = this.requestId++;
        // Store the resolve function with the request ID
        this.pendingRequests.set(id, resolve);
        // Send data to the worker along with the request ID
        this.worker.postMessage({ id, sass });
      } else {
        // Fallback in case web workers are not supported
        resolve(sass);
      }
    });
  }
}
