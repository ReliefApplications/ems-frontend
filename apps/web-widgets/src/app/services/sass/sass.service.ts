import { Injectable } from '@angular/core';
import { compileString } from 'sass';

/**
 * Sass service.
 * Transforms sass to css, using web worker.
 * Replace default service using web worker.
 */
@Injectable({
  providedIn: 'root',
})
export class SassService {
  /**
   * Converts sass to css
   *
   * @param sass sass style as string
   * @returns sass style as css
   */
  convertToCss(sass: string): Promise<any> {
    return new Promise((resolve) => {
      try {
        const css = compileString(sass);
        resolve(css);
      } catch {
        resolve(sass);
      }
    });
  }
}
