import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'lodash';
import { SanitizeHtmlPipe } from '../sanitize-html/sanitize-html.pipe';
import { SafeHtml } from '@angular/platform-browser';

/**
 * Text format tags that should be kept
 * source: https://www.w3docs.com/learn-html/html-tags-for-text-formatting.html
 */
const TEXT_FORMAT_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'b',
  'strong',
  'i',
  'em',
  'mark',
  'small',
  'del',
  'ins',
  'u',
  'sub',
  'sup',
  'pre',
  's',
  'dfn',
  'br',
  'hr',
];

/**
 * Basic text format styles to take in account for the given content
 * source: https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals
 */
const TEXT_FORMAT_STYLE_PROPERTIES = [
  'color',
  'background-color',
  'font-size',
  'text-decoration',
  'text-transform',
  'text-align',
  'font-family',
  'font-style',
  'font-weight',
  'line-height',
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
    const nodes = helperDiv.childNodes;
    const cleanNodes = this.cleanUpNodes(nodes);
    return super.transform(cleanNodes);
    // return cleanNodes; // Return the plain text
  }

  /**
   * Extract base text format styles from the given node
   *
   * @param node Node from where to fetch styles
   * @returns Styles for basic text formatting
   */
  private getTextFormatStyling(node: HTMLElement): string {
    const styles: string[] = [];
    const style = node.getAttribute('style');
    if (style) {
      TEXT_FORMAT_STYLE_PROPERTIES.forEach((property) => {
        const regex = new RegExp(`${property}:s*[^;]+;`, 'gi');
        const styleAux = style.match(regex);
        if (!isNil(styleAux)) {
          styles.push(...styleAux);
        }
      });
      return styles.join('');
    }
    return '';
  }

  /**
   * Remove any element fetching the text content of elements that are not paragraphs, spans or text elements
   *
   * @param nodes Nodes to search and clean
   * @returns clean html string
   */
  private cleanUpNodes(nodes: NodeListOf<ChildNode>): string {
    return Array.from(nodes)
      .map((node) => {
        // If node contains inner children that are not plain text, keep going deeper in the nodes
        if (
          node.hasChildNodes() &&
          !Array.from(node.childNodes).every(
            (node) => node.nodeName === '#text'
          )
        ) {
          (node as HTMLElement).innerHTML = this.cleanUpNodes(node.childNodes);
          /** Could happen that current node is a text format tag, like strong tag */
          /** We keep it using the outerHTML and moving styles back to the span wrapper */
          const textFormatStyling = this.getTextFormatStyling(
            node as HTMLElement
          );
          if (
            TEXT_FORMAT_TAGS.includes(
              (node as HTMLElement).tagName?.toLowerCase()
            ) ||
            textFormatStyling
          ) {
            if (textFormatStyling) {
              (node as HTMLElement).setAttribute('style', textFormatStyling);
            }
            if ((node as HTMLElement).outerHTML) {
              return (node as HTMLElement).outerHTML.trim();
            } else {
              return '';
            }
          }
          return (node as HTMLElement).innerHTML;
        } else {
          const parentForInnerHTML = document.createElement('div');
          const span = document.createElement('span');
          if ((node as HTMLElement).style?.cssText) {
            span.setAttribute('style', (node as HTMLElement).style.cssText);
          }
          span.textContent = (node as HTMLElement).textContent;
          if (span.textContent) {
            parentForInnerHTML.appendChild(span);
            return parentForInnerHTML.innerHTML;
          }
          return '';
        }
      })
      .join('');
  }
}
