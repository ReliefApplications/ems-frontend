import { Pipe, PipeTransform } from '@angular/core';
import { get, set } from 'lodash';
import { SanitizeHtmlPipe } from '../sanitize-html/sanitize-html.pipe';
import { SafeHtml } from '@angular/platform-browser';

/**
 * Basic text format styles to take in account for the given content
 * source: https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals
 */
const TEXT_FORMAT_STYLE_PROPERTIES = [
  'color',
  'backgroundColor',
  // 'fontSize',
  'textDecoration',
  'textTransform',
  'textAlign',
  'fontFamily',
  'fontStyle',
  'fontWeight',
  'lineHeight',
];

/**
 * Clean up given html from all elements that are not a paragraph, an span or a text element by getting just their text content.
 */
@Pipe({
  name: 'sharedStripHtml',
  standalone: true,
})
export class StripHtmlPipe extends SanitizeHtmlPipe implements PipeTransform {
  /**
   * Transform html into text.
   *
   * @param value html value
   * @returns text
   */
  override transform(value: string): SafeHtml {
    // Create a temporary DOM element to navigate through all nodes in the given html string
    const helperDiv = document.createElement('div');
    helperDiv.innerHTML = (value || '').trim();
    const transformedDiv = this.transformNode(helperDiv);
    transformedDiv.style.display = 'inline';
    transformedDiv.style.whiteSpace = 'nowrap';
    return super.transform(transformedDiv.outerHTML);
  }

  /**
   * Applies to html copy all inline styles we want to keep
   *
   * @param original Original html element
   * @param copy Copied html element
   */
  private setStyle(original: HTMLElement, copy: HTMLElement): void {
    const virtual = original.cloneNode(true);
    document.body.appendChild(virtual);
    const virtualStyle = window.getComputedStyle(virtual as HTMLElement);
    if (virtualStyle) {
      const defaultElement = document.createElement('span');
      document.body.appendChild(defaultElement);
      const defaultStyle = window.getComputedStyle(defaultElement);

      TEXT_FORMAT_STYLE_PROPERTIES.forEach((property) => {
        const value = get(virtualStyle, property);
        const defaultValue = get(defaultStyle, property);
        if (value !== defaultValue) {
          set(copy.style, property, value);
        }
      });
      // Clean up
      document.body.removeChild(defaultElement);
    }
    // Clean up
    document.body.removeChild(virtual);
  }

  /**
   * Remove any element fetching the text content of elements that are not paragraphs, spans or text elements
   *
   * @param node HTML element to transform
   * @returns transformed html
   */
  private transformNode(node: HTMLElement): HTMLElement {
    const span = document.createElement('span');
    if (node.hasChildNodes()) {
      node.childNodes.forEach((subNode) => {
        if (subNode.nodeType === Node.TEXT_NODE) {
          const child = document.createElement('span');
          child.innerText = subNode.textContent || '';
          child.style.display = 'inline';
          child.style.whiteSpace = 'nowrap';
          span.appendChild(child);
        } else if (subNode.nodeType === Node.ELEMENT_NODE) {
          const child = this.transformNode(subNode as HTMLElement);
          this.setStyle(subNode as HTMLElement, child);
          child.style.display = 'inline';
          child.style.whiteSpace = 'nowrap';
          span.appendChild(child);
        }
      });
    } else if (node.nodeType === Node.TEXT_NODE) {
      span.innerHTML = node.textContent || '';
    }
    span.style.display = 'inline';
    span.style.whiteSpace = 'nowrap';
    const brElements = span.querySelectorAll('br');
    brElements.forEach((br) => br.remove());
    return span;
  }
}
