import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { SafeApplicationService } from '../../../services/application/application.service';
import { SafeDashboardService } from '../../../services/dashboard/dashboard.service';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { firstValueFrom, takeUntil } from 'rxjs';

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
export class HtmlWidgetContentComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() html: SafeHtml = '';
  @Input() style?: string;
  @Input() widgetID = -1;

  /**
   * HTML Widget content component
   * Allows to render HTML with custom styles without interfering with the rest of the application.
   *
   * @param elementRef The element reference
   * @param applicationService Shared application service
   * @param dashboardService Shared dashboard service
   */
  constructor(
    private elementRef: ElementRef,
    private applicationService: SafeApplicationService,
    private dashboardService: SafeDashboardService
  ) {
    super();
  }

  ngOnInit(): void {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = this.style || '';
    this.elementRef.nativeElement.shadowRoot?.appendChild(styleElement);

    // Appends application custom styles to the shadow root
    const appStyles = document.createElement('style');
    appStyles.innerHTML = this.applicationService.css.getValue();
    this.elementRef.nativeElement.shadowRoot?.appendChild(appStyles);
    this.applicationService.css$
      .pipe(takeUntil(this.destroy$))
      .subscribe((css) => {
        appStyles.innerHTML = css;
      });

    // Appends widget custom styles to the shadow root
    const widgetStyle = document.createElement('style');
    const widgetStyle$ = this.dashboardService.getWidgetStyleAsObserver(
      this.widgetID
    );
    firstValueFrom(widgetStyle$).then((style) => {
      widgetStyle.innerHTML = style;
    });
    widgetStyle$.pipe(takeUntil(this.destroy$)).subscribe((style) => {
      // Remove the id selector for the widget div
      const regex = new RegExp(
        '#widget-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}',
        'g'
      );
      widgetStyle.innerHTML = style.replace(regex, '');
    });
    this.elementRef.nativeElement.shadowRoot?.appendChild(widgetStyle);
  }
}
