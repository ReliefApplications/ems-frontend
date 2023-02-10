import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FeatureCollection } from 'geojson';
import { BehaviorSubject } from 'rxjs';
import { SafeMapLayersService } from '../../services/maps/map-layers.service';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../ui/map/interfaces/map.interface';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/public-api';

// Leaflet
declare let L: any;

/**
 * Component for displaying the input map
 * of the geospatial type question.
 */
@Component({
  selector: 'safe-geospatial-map',
  templateUrl: './geospatial-map.component.html',
  styleUrls: ['./geospatial-map.component.scss'],
})
export class SafeGeospatialMapComponent
  extends SafeUnsubscribeComponent
  implements AfterViewInit
{
  @Input() data: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  // === MAP ===
  public mapSettings!: MapConstructorSettings;
  private addLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public layerToAdd$ = this.addLayer.asObservable();
  private updateLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public updateLayer$ = this.updateLayer.asObservable();

  // Layer to edit
  public selectedLayer: any;
  public controls: any = {
    position: 'topright',
    drawText: false,
    drawCircleMarker: false,
  };

  // output
  private timeout: ReturnType<typeof setTimeout> | null = null;
  @Output() mapChange = new EventEmitter<FeatureCollection>();

  /**
   * Component for displaying the input map
   * of the geospatial type question.
   *
   * @param safeMapLayersService Shared map layer service
   */
  constructor(private safeMapLayersService: SafeMapLayersService) {
    super();
  }

  ngAfterViewInit(): void {
    this.mapSettings = {
      centerLat: 0,
      centerLong: 0,
      zoom: 2,
      pmIgnore: false,
      worldCopyJump: true,
    };
    const layer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    this.addLayer.next({ layer });
    this.setDataLayers();
  }

  /** Creates map */
  private setDataLayers(): void {
    // init layers from question value
    if (this.data.features.length > 0) {
      const newLayer = L.geoJSON(this.data, {
        // Circles are not supported by geojson
        // We abstract them as markers with a radius property
        pointToLayer: (feature: any, latlng: any) => {
          if (feature.properties.radius) {
            return new L.Circle(latlng, feature.properties.radius);
          } else {
            const color = feature.properties.color || '#3388ff';
            const opacity = feature.properties.opacity || 1;
            const icon = this.safeMapLayersService.createCustomMarker(
              color,
              opacity
            );
            return new L.Marker(latlng).setIcon(icon);
          }
        },
      });
      this.addLayer.next({ layer: newLayer });
    }
  }

  /**
   * Handle map change events
   *
   * @param mapChangeData map change event
   */
  private onMapChange(mapChangeData: any): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.mapChange.emit(mapChangeData);
    }, 500);
  }

  /**
   * Updates the selected layer with the given options.
   *
   * @param options the options to update the layer with
   */
  public updateLayerOptions(options: any) {
    // Layers with geoman tools are visible by default
    // We make sure to add that option by default in each update
    options = { ...options, visible: true };
    if (this.selectedLayer instanceof L.Marker) {
      const icon = this.safeMapLayersService.createCustomMarker(
        options.color,
        options.opacity
      );
      this.updateLayer.next({ layer: this.selectedLayer, options, icon });
    } else {
      this.updateLayer.next({ layer: this.selectedLayer, options });
    }
  }

  /**
   * Handle leaflet map event
   *
   * @param event leaflet map event
   */
  public handleMapEvent(event: MapEvent) {
    switch (event.type) {
      case MapEventType.SELECTED_LAYER:
        this.selectedLayer = event.content.layer;
        break;
      case MapEventType.MAP_CHANGE:
        this.onMapChange(event.content);
        break;
      default:
        break;
    }
  }
}
