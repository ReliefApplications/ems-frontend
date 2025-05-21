import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

/**
 * HTML Widget content component
 *
 * Allows to render HTML with custom styles without interfering with the rest of the application.
 */
@Component({
  selector: 'shared-html-widget-content',
  templateUrl: './html-widget-content.component.html',
  styleUrls: ['./html-widget-content.component.scss'],
  // todo: enable
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class HtmlWidgetContentComponent implements AfterViewInit {
  /**
   * HTML to render
   */
  @Input() html: SafeHtml = '';
  /**
   * Custom styles to apply to the HTML
   */
  @Input() style?: string;

  /**
   * HTML Widget content component
   *
   * @param {ElementRef} el Element reference
   */
  constructor(public el: ElementRef) {}

  /**
   * Script to fix bulletin and announcement text overlapping issue
   */
  ngAfterViewInit(): void {
    // Find the element with the class "text-overlapping-fix"
    const overlappedElement: HTMLElement | null =
      this.el.nativeElement.querySelector('.text-overlapping-fix');

    // If the element exists, remove all inline styles from its children
    if (overlappedElement) {
      // Find all elements with the "style" attribute
      const elementsWithStyle: NodeListOf<HTMLElement> =
        overlappedElement.querySelectorAll<HTMLElement>('[style]');

      // Iterate over the elements and remove the "style" attribute
      elementsWithStyle.forEach((element: HTMLElement) => {
        element.removeAttribute('style');
      });
    }
  }
}
