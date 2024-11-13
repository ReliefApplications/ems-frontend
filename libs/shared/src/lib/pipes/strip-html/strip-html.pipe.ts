import { Pipe, PipeTransform } from '@angular/core';

/**
 * Clean up given html from all elements that are not a paragraph, an span or a text element by getting just their text content.
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
    // Create a temporary DOM element to navigate through all nodes in the given html string
    const helperDiv = document.createElement('div');
    helperDiv.innerHTML = (value || '').trim();
    const nodes = helperDiv.childNodes;
    const cleanNodes = Array.from(nodes)
      .map((node) => {
        // Get text content of any other element that is not a paragraph, an span or a text element
        if (
          !(
            node instanceof HTMLParagraphElement ||
            node instanceof HTMLSpanElement ||
            node.nodeName === '#text'
          )
        ) {
          return (node as HTMLElement).textContent;
        }
        // Get text content if text element, or the html if is paragraph or span
        return node.nodeName === '#text'
          ? (node as HTMLElement).textContent
          : (node as HTMLElement).innerHTML;
      })
      .join('');
    return cleanNodes; // Return the plain text
  }
}
