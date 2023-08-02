import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

/**
 * Isolated HTML component
 *
 * Allows to render HTML with custom styles without interfering with the rest of the application.
 */
@Component({
  selector: 'safe-isolated-html',
  templateUrl: './isolated-html.component.html',
  styleUrls: ['./isolated-html.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class IsolatedHtmlComponent {
  @Input() html: SafeHtml = '';
  @Input() style?: string;
}
