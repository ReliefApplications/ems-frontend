import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Feature, Point } from 'geojson';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DividerModule } from '@oort-front/ui';

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
  @Input() points: Feature<Point>[] = [];
  @Input() template = '';
  @Input() currZoom = 13;

  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();
  @Output() zoomTo: EventEmitter<{ coordinates: number[] }> = new EventEmitter<{
    coordinates: number[];
  }>();
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
    const properties = this.points[this.currValue].properties;
    const coordinates = this.points[this.currValue].geometry.coordinates;
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
            // Popup service sets the coordinates as coordinates${index}
            // This regex extracts the ${index} to set the related value from coordinates
            const coordinateIndex = Number(
              key.match(/[^(?<=coordinates)]*$/gi)?.[0]
            );
            value = coordinates[coordinateIndex ?? 0];
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
    this.zoomTo.emit({
      coordinates: this.points[this.currValue].geometry.coordinates,
    });
  }
}
