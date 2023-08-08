import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

/**
 * Isolated HTML component
 *
 * Allows to render HTML with custom styles without interfering with the rest of the application.
 */
@Component({
  selector: 'safe-html-widget-content',
  templateUrl: './html-widget-content.component.html',
  styleUrls: ['./html-widget-content.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class HtmlWidgetContentComponent {
  @Input() html: SafeHtml = '';
  @Input() style?: string;
}
