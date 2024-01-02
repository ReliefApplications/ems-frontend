import { Component, ElementRef, Input } from '@angular/core';
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
export class HtmlWidgetContentComponent {
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
}
