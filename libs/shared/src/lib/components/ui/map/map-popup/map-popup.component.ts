import {
  AfterContentInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Feature, Geometry } from 'geojson';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DividerModule, TooltipModule } from '@oort-front/ui';
import { LatLng } from 'leaflet';
import get from 'lodash/get';
import { isNil } from 'lodash';
import { ButtonModule as KendoButtonModule } from '@progress/kendo-angular-buttons';
import { Router } from '@angular/router';

/** Component for a popup that has information on multiple points */
@Component({
  selector: 'shared-map-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DividerModule,
    TooltipModule,
    ButtonModule,
    KendoButtonModule,
  ],
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss'],
})
export class MapPopupComponent
  extends UnsubscribeComponent
  implements AfterContentInit
{
  /** Coordinates of the point */
  @Input() coordinates!: LatLng;
  /** Features */
  @Input() feature: Feature<Geometry>[] = [];
  /** Template for the popup */
  @Input() template = '';
  /** Current zoom level */
  @Input() currZoom = 13;

  /** Event emitter for the close event */
  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();
  /** Event emitter for the zoom to event */
  @Output() zoomTo: EventEmitter<LatLng> = new EventEmitter<LatLng>();
  /** Current html */
  public currentHtml: SafeHtml = '';
  /** Current point */
  public current = new BehaviorSubject<number>(0);

  /** Current environment */
  private environment: any;

  /** Navigation info */
  public navigateToPage = false;
  /** Navigation settings */
  public navigateSettings = {
    field: '',
    pageUrl: '',
  };

  /** @returns current as an observable */
  get current$() {
    return this.current.asObservable();
  }

  /** @returns the current value */
  get currValue() {
    return this.current.value;
  }

  /**
   * Component for a popup that has information on multiple points
   *
   * @param environment platform environment
   * @param router Angular Router
   * @param sanitizer The dom sanitizer, to sanitize the template
   */
  constructor(
    @Inject('environment') environment: any,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.environment = environment;
  }

  ngAfterContentInit(): void {
    this.setInnerHtml();
    this.current$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setInnerHtml();
    });
  }

  /** Updates the html for the current point */
  public setInnerHtml() {
    const properties = this.feature[this.currValue].properties;
    const regex = /{{(.*?)}}/g;
    // if no properties, return the template replacing all matches with empty string
    // if there are properties, replace the matches with the corresponding property
    const html = properties
      ? this.template.replace(regex, (match) => {
          const key = match.replace(/{{|}}/g, '');
          let value;
          if (!key.includes('coordinates')) {
            value = get(properties, key);
          } else {
            value = this.coordinates;
          }

          return isNil(value) ? '' : value;
        })
      : this.template.replace(regex, '');
    const scriptRegex = /<script>(.*?)<\/script>/g;
    // remove all script tags
    const sanitizedHtml = html.replace(scriptRegex, '');
    this.currentHtml = this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }

  /**
   * Emit event with current point coordinates
   */
  public zoomToCurrentFeature() {
    this.zoomTo.emit(this.coordinates);
  }

  /**
   * Create and navigate to the specified url
   *
   * @param navigateSettings navigation settings
   */
  public navigate(navigateSettings: any) {
    // Closing the popup manually, otherwise, the tooltip isn't destroyed properly
    this.closePopup.emit();
    let fullUrl = this.getPageUrl(navigateSettings.pageUrl as string);
    if (navigateSettings.field) {
      const field = get(navigateSettings, 'field', '');
      const value = get(this.feature[this.currValue].properties, field);
      fullUrl = `${fullUrl}?${navigateSettings.field}=${value}`;
    }
    this.router.navigateByUrl(fullUrl);
  }

  /**
   * Get page url full link taking into account the environment.
   *
   * @param pageUrlParams page url params
   * @returns url of the page
   */
  private getPageUrl(pageUrlParams: string): string {
    return this.environment.module === 'backoffice'
      ? `applications/${pageUrlParams}`
      : `${pageUrlParams}`;
  }
}
