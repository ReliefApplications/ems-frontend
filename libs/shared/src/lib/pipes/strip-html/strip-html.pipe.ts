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
    const cleanNodes = this.cleanUpNodes(nodes);
    return cleanNodes; // Return the plain text
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
          const parentForInnerHTML = document.createElement('div');
          const span = document.createElement('span');
          if ((node as HTMLElement).style?.cssText) {
            span.setAttribute('style', (node as HTMLElement).style.cssText);
            (node as HTMLElement).setAttribute('style', '');
          }
          /** Could happen that current node is a text format tag, like strong tag */
          /** We keep it using the outerHTML and moving styles back to the span wrapper (step above) */
          span.innerHTML = (node as HTMLElement).outerHTML.trim();
          if (span.innerHTML) {
            parentForInnerHTML.appendChild(span);
            return parentForInnerHTML.innerHTML;
          } else {
            return '';
          }
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
