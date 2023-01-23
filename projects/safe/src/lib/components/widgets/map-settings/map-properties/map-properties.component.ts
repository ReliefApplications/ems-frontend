import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SafeMapComponent } from '../../map/map.component';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/** List of basemap that can be used by the widget */
const BASEMAPS: string[] = [
  'Sreets',
  'Navigation',
  'Topographic',
  'Light Gray',
  'Dark Gray',
  'Streets Relief',
  'Imagery',
  'ChartedTerritory',
  'ColoredPencil',
  'Nova',
  'Midcentury',
  'OSM',
  'OSM:Streets',
];

/**
 * Map Properties of Map widget.
 */
@Component({
  selector: 'safe-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss'],
})
export class MapPropertiesComponent
  extends SafeUnsubscribeComponent
  implements OnInit, AfterViewInit
{
  @Input() form!: FormGroup;

  @ViewChild(SafeMapComponent) previewMap!: SafeMapComponent;

  public basemaps = BASEMAPS;
  public map: any;

  public mapSettings!: {
    basemap: string;
    zoom: number;
    centerLat: number;
    centerLong: number;
  };

  /**
   * Map Properties of Map widget.
   */
  constructor() {
    super();
  }

  /**
   * Subscribe to settings changes to update map.
   */
  ngOnInit(): void {
    this.mapSettings = {
      basemap: this.form.value.basemap,
      zoom: this.form.value.zoom,
      centerLat: this.form.value.centerLat,
      centerLong: this.form.value.centerLong,
    };
    this.form
      .get('zoom')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.previewMap.map.setZoom(value);
      });
    this.form
      .get('centerLat')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const map = this.previewMap.map;
        map.setView([value, map.getCenter().lng], map.getZoom());
      });
    this.form
      .get('centerLong')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const map = this.previewMap.map;
        map.setView([map.getCenter().lat, value], map.getZoom());
      });
    this.form
      .get('basemap')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.previewMap.setBasemap(value);
      });
  }

  /**
   * Subscribe to map events to update settings
   */
  ngAfterViewInit(): void {
    this.map = this.previewMap.map;
    this.map.on('zoomend', () => {
      this.form.get('zoom')?.setValue(this.map.getZoom(), { emitEvent: false });
    });
  }

  /**
   * Set the latitude and longitude of the center of the map using the one in the preview map.
   */
  onSetByMap(): void {
    const center = this.map.getCenter();
    this.form.get('centerLat')?.setValue(center.lat, { emitEvent: false });
    this.form.get('centerLong')?.setValue(center.lng, { emitEvent: false });
  }
}
