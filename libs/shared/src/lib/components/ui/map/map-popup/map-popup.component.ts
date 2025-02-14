import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DividerModule, TooltipModule } from '@oort-front/ui';
import { LatLng } from 'leaflet';
import { get, isNil } from 'lodash';
import { getFlatFields } from '../../../../services/html-parser/html-parser-helper';
import { HtmlParserService } from '../../../../services/html-parser/html-parser.service';

/** Component for a popup that has information on multiple points */
@Component({
  selector: 'shared-map-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DividerModule,
    TooltipModule,
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
  /** Metadata */
  @Input() metadata: any[] = [];

  /** Event emitter for the close event */
  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();
  /** Event emitter for the zoom to event */
  @Output() zoomTo: EventEmitter<LatLng> = new EventEmitter<LatLng>();
  /** Current html */
  public currentHtml: SafeHtml = '';
  /** Current point */
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
   * @param sanitizer Dom Sanitizer
   * @param htmlParserService  Shared HTML parser service
   */
  constructor(
    private sanitizer: DomSanitizer,
    private htmlParserService: HtmlParserService
  ) {
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
    const fields = getFlatFields(this.metadata);
    const regex = /{{(.*?)}}/g;
    // if no properties, return the template replacing all matches with empty string
    // if there are properties, replace the matches with the corresponding property
    const html = properties
      ? this.template.replace(regex, (match) => {
          const key = match.replace(/{{|}}/g, '');
          return this.replacePlaceholder(properties, fields, key);
        })
      : this.template.replace(regex, '');
    const scriptRegex = /<script>(.*?)<\/script>/g;
    // remove all script tags
    const sanitizedHtml = html.replace(scriptRegex, '');
    this.currentHtml = this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }

  /**
   * Replace placeholder by value from geojson properties
   *
   * @param properties feature properties
   * @param fields metadata fields ( can be empty )
   * @param placeholder placeholder
   * @returns value to inject
   */
  private replacePlaceholder(
    properties: GeoJsonProperties,
    fields: any[],
    placeholder: string
  ) {
    let value;
    if (!placeholder.includes('coordinates')) {
      const field = fields.find((m) => m.name === placeholder);
      if (field) {
        // If metadata provided, get value using metadata
        const fieldValue = this.htmlParserService.getFieldValue(
          properties,
          field
        );
        if (!isNil(fieldValue)) {
          value = this.htmlParserService.placeholderToValue(field, fieldValue);
        }
      } else {
        // Else, get value from properties directly
        value = get(properties, placeholder);
      }
    } else {
      value = this.coordinates.toString();
    }

    return isNil(value) ? '' : value;
  }

  /**
   * Emit event with current point coordinates
   */
  public zoomToCurrentFeature() {
    this.zoomTo.emit(this.coordinates);
  }
}
