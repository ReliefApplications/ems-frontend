import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Feature, Geometry } from 'geojson';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DividerModule } from '@oort-front/ui';
import { LatLng } from 'leaflet';

/** Component for a popup that has information on multiple points */
@Component({
  selector: 'safe-map-popup',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonModule, DividerModule],
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss'],
})
export class SafeMapPopupComponent
  extends SafeUnsubscribeComponent
  implements AfterContentInit
{
  @Input() coordinates!: LatLng;
  @Input() feature: Feature<Geometry>[] = [];
  @Input() template = '';
  @Input() currZoom = 13;

  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();
  @Output() zoomTo: EventEmitter<LatLng> = new EventEmitter<LatLng>();
  public currentHtml: SafeHtml = '';
  public current = new BehaviorSubject<number>(0);

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
   * @param sanitizer The dom sanitizer, to sanitize the template
   */
  constructor(private sanitizer: DomSanitizer) {
    super();
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
            value = properties[key];
          } else {
            value = this.coordinates;
          }

          return value ? value : '';
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
}
