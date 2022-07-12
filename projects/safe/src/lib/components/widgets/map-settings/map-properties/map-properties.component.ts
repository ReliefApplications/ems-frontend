import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SafeMapComponent } from '../../map/map.component';

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
export class MapPropertiesComponent implements OnInit, AfterViewInit {
  @Input() form!: FormGroup;

  @ViewChild(SafeMapComponent) previewMap!: SafeMapComponent;

  public basemaps = BASEMAPS;

  public mapSettings!: {
    basemap: string;
    zoom: number;
    centerLat: number;
    centerLong: number;
  };

  /**
   * Map Properties of Map widget.
   */
  constructor() {}

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
    this.form.get('zoom')?.valueChanges.subscribe((value) => {
      this.previewMap.map.setZoom(value);
    });
    this.form.get('centerLat')?.valueChanges.subscribe((value) => {
      const map = this.previewMap.map;
      map.setView([value, map.getCenter().lng], map.getZoom());
    });
    this.form.get('centerLong')?.valueChanges.subscribe((value) => {
      const map = this.previewMap.map;
      map.setView([map.getCenter().lat, value], map.getZoom());
    });
    this.form.get('basemap')?.valueChanges.subscribe((value) => {
      this.previewMap.changeBasemap(value);
    });
  }

  /**
   * Subscribe to map events to update settings
   */
  ngAfterViewInit(): void {
    const map = this.previewMap.map;
    map.on('zoomend', (e: any) => {
      this.form.get('zoom')?.setValue(map.getZoom(), { emitEvent: false });
    });
    map.on('moveend', () => {
      const center = map.getCenter();
      this.form.get('centerLat')?.setValue(center.lat, { emitEvent: false });
      this.form.get('centerLong')?.setValue(center.lng, { emitEvent: false });
    });
  }
}
