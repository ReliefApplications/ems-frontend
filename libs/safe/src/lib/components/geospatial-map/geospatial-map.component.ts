import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { BehaviorSubject } from 'rxjs';
import {
  BaseLayerTree,
  LayerActionOnMap,
} from '../ui/map/interfaces/map-layers.interface';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../ui/map/interfaces/map.interface';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/public-api';

// Leaflet
import '@geoman-io/leaflet-geoman-free';
import * as L from 'leaflet';
// import { FeatureProperties } from '../ui/map/interfaces/layer-settings.type';
// import { IconName } from '../ui/map/const/fa-icons';
// import { LayerStylingComponent } from './layer-styling/layer-styling.component';
// import { createCustomDivIcon } from '../ui/map/utils/create-div-icon';
import { CommonModule } from '@angular/common';
import { MapModule } from '../ui/map/map.module';
import { SafeSnackBarService } from '../../services/snackbar/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { SafeGeoFieldsModule } from './geo-fields/geo-fields.module';
import { createCustomDivIcon } from '../ui/map/utils/create-div-icon';
import { IconName } from '../icon-picker/icon-picker.const';

// type StyleChange =
//   typeof LayerStylingComponent.prototype.edit extends EventEmitter<infer T>
//     ? T
//     : never;
/**
 * The type for the object get from the reverseGeocode and geosearch
 * operation, used to save in the GeoJSON the address info
 */
export interface ReverseGeocodeResult {
  Coordinates: { lat: number; lng: number };
  City: string;
  Country: string;
  District: string;
  Region: string;
  Street: string;
}

/**
 * Component for displaying the input map
 * of the geo spatial type question.
 */
@Component({
  standalone: true,
  selector: 'safe-geospatial-map',
  templateUrl: './geospatial-map.component.html',
  styleUrls: ['./geospatial-map.component.scss'],
  imports: [CommonModule, MapModule, SafeGeoFieldsModule],
  providers: [SafeSnackBarService, TranslateService],
})
export class GeospatialMapComponent
  extends SafeUnsubscribeComponent
  implements AfterViewInit
{
  @Input() data?: any;
  @Input() geometry = 'Point';

  // === MAP ===
  public mapSettings!: MapConstructorSettings;
  private addOrDeleteLayer: BehaviorSubject<LayerActionOnMap | null> =
    new BehaviorSubject<LayerActionOnMap | null>(null);
  public layerToAddOrDelete$ = this.addOrDeleteLayer.asObservable();
  private updateLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public updateLayer$ = this.updateLayer.asObservable();

  // Layer to edit
  public selectedLayer: any;
  public controls: any = {
    position: 'topright',
    drawText: false,
    drawCircleMarker: false,
    drawPolyline: false,
    drawCircle: false,
    drawRectangle: false,
    drawPolygon: false,
  };

  // Geocoding
  @Input() useGeocoding = false;
  @Input() geoFields: (keyof ReverseGeocodeResult)[] = [];
  public geocodingResult: ReverseGeocodeResult = {
    Coordinates: { lat: 0, lng: 0 },
    City: '',
    Country: '',
    District: '',
    Region: '',
    Street: '',
  };

  // output
  private timeout: ReturnType<typeof setTimeout> | null = null;
  @Output() mapChange = new EventEmitter<Feature | FeatureCollection>();

  /**
   * Component for displaying the input map
   * of the geospatial type question.
   */
  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.mapSettings = {
      initialState: {
        viewpoint: {
          center: {
            latitude: 0,
            longitude: 0,
          },
          zoom: 2,
        },
      },
      pmIgnore: false,
      worldCopyJump: true,
      controls: {
        timedimension: false,
        download: false,
        legend: false,
        measure: true,
        layer: false,
        search: true,
      },
    };
    const layer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    const baseLayer: BaseLayerTree = {
      label: '',
      layer,
    };
    this.addOrDeleteLayer.next({ layerData: baseLayer, isDelete: false });
    this.setDataLayers();
  }

  /**
   * Draw the question default value
   */
  private setDataLayers(): void {
    console.log(this.data);
    //init layers from question value
    if (this.data) {
      this.geocodingResult = this.data.geocoding;
      const newLayer = L.geoJSON(this.data, {
        // Circles are not supported by geojson
        // We abstract them as markers with a radius property
        pointToLayer: (feature, latlng) => {
          // Update geocoding result
          if (feature.properties.radius) {
            return new L.Circle(latlng, feature.properties.radius);
          } else {
            const icon = createCustomDivIcon({
              color: feature.properties.style?.fillColor || '#3388ff',
              opacity: feature.properties.style?.fillOpacity || 1,
              icon:
                (feature.properties.style?.icon as IconName) ||
                'leaflet_default',
              size: feature.properties.style?.iconSize || 24,
            });
            return new L.Marker(latlng).setIcon(icon);
          }
        },
      });
      const baseLayer: BaseLayerTree = {
        label: '',
        layer: newLayer,
      };
      this.addOrDeleteLayer.next({ layerData: baseLayer, isDelete: false });
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
  // public updateLayerOptions(options: StyleChange) {
  //   options = { ...options, visible: true };
  //   if ('color' in options && 'opacity' in options) {
  //     // Layers with geoman tools are visible by default
  //     // We make sure to add that option by default in each update
  //     if (this.selectedLayer instanceof L.Marker) {
  //       const icon = createCustomDivIcon({
  //         color: options.color as string,
  //         opacity: options.opacity as number,
  //         icon: 'leaflet_default',
  //         size: 24,
  //       });

  //       this.updateLayer.next({ layer: this.selectedLayer, options, icon });
  //     } else {
  //       this.updateLayer.next({ layer: this.selectedLayer, options });
  //     }
  //   }
  // }

  /**
   * Handle leaflet map event
   *
   * @param event leaflet map event
   */
  public handleMapEvent(event: MapEvent) {
    // console.log(this.selectedLayer);
    switch (event.type) {
      case MapEventType.SELECTED_LAYER:
        this.selectedLayer = event.content.layer;
        break;
      case MapEventType.MAP_CHANGE:
        this.onMapChange(event.content);
        break;
      case MapEventType.GEOMAN_ADD:
        this.geocodingResult = event.content.geocoding;
        this.onMapChange(event.content);
        break;
      case MapEventType.GEOMAN_REMOVE:
        {
          // Reset geocodingResult on layer removal
          this.geocodingResult = {
            Coordinates: { lat: 0, lng: 0 },
            City: '',
            Country: '',
            District: '',
            Region: '',
            Street: '',
          };
          // Update our layer object with the geocoding each time changes
          this.onMapChange(event.content);
        }
        break;
      default:
        break;
    }
  }
}
