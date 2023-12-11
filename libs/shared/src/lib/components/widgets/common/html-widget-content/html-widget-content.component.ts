import { Component, Input } from '@angular/core';
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
  @Input() html: SafeHtml = '';
  @Input() style?: string;
}
