import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

/**
 * HTML Widget content component
 *
 * Allows to render HTML with custom styles without interfering with the rest of the application.
 */
@Component({
  selector: 'safe-html-widget-content',
  templateUrl: './html-widget-content.component.html',
  styleUrls: ['./html-widget-content.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class HtmlWidgetContentComponent implements OnInit {
  @Input() html: SafeHtml = '';
  @Input() style?: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const style = document.createElement('style');
    style.innerHTML = this.style || '';
    this.elementRef.nativeElement.shadowRoot?.appendChild(style);
  }
}
