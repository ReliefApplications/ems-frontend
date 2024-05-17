import { Injectable } from '@angular/core';

/**
 * Sass service.
 * Transforms sass to css, using web worker.
 */
@Injectable({
  providedIn: 'root',
})
export class SassService {
  /**
   * Sass service.
   * Transforms sass to css, using web worker.
   */
  constructor() {
    if (typeof Worker !== 'undefined') {
      // Create a new worker instance
      console.log(import.meta.url);
    } else {
      console.log('Web Workers are not supported in this environment.');
    }
  }

  /**
   * Converts sass to css
   *
   * @param sass sass style as string
   * @returns sass style as css
   */
  convertToCss(sass: string) {
    const worker = new Worker(new URL('./sass-worker.worker', import.meta.url));

    let css = '';

    // Listen for messages from the worker
    worker.onmessage = ({ data }) => {
      worker.terminate();
      css = data;
      console.log(css);
    };

    // Send data to the worker
    worker.postMessage(sass);

    return css;
  }
}
