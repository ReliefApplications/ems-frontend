import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transform html into text Angular pipe.
 */
@Pipe({
  name: 'sharedStripHtml',
  standalone: true,
})
export class StripHtmlPipe implements PipeTransform {
  /**
   * Transform html into text.
   *
   * @param value html value
   * @returns text
   */
  transform(value: string): string {
    // Create a temporary DOM element to leverage the browser's parsing
    const tempElement = document.createElement('div');
    tempElement.innerHTML = value;
    return tempElement.innerText; // Return the plain text
  }
}
