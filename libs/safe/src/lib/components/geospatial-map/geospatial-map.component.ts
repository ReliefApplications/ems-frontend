import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
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

import { IconName } from '../icon-picker/icon-picker.const';
// import { LayerStylingComponent } from './layer-styling/layer-styling.component';
import { createCustomDivIcon } from '../ui/map/utils/create-div-icon';
import { CommonModule } from '@angular/common';
import { MapModule } from '../ui/map/map.module';

import { MapComponent } from '../ui/map';
import { AVAILABLE_GEOMAN_LANGUAGES } from '../ui/map/const/language';
import { getMapFeature } from '../ui/map/utils/get-map-features';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';

// type StyleChange =
//   typeof LayerStylingComponent.prototype.edit extends EventEmitter<infer T>
//     ? T
//     : never;

/**
 * Component for displaying the input map
 * of the geo spatial type question.
 */
@Component({
  standalone: true,
  selector: 'safe-geospatial-map',
  templateUrl: './geospatial-map.component.html',
  styleUrls: ['./geospatial-map.component.scss'],
  imports: [CommonModule, MapModule],
})
export class GeospatialMapComponent
  extends SafeUnsubscribeComponent
  implements AfterViewInit
{
  @Input() data?: Feature | FeatureCollection;
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

  // output
  private timeout: ReturnType<typeof setTimeout> | null = null;
  @Output() mapChange = new EventEmitter<Feature | FeatureCollection>();

  @ViewChild(MapComponent) mapComponent?: MapComponent;

  /**
   * Component for displaying the input map
   * of the geospatial type question.
   *
   * @param translate
   */
  constructor(private translate: TranslateService) {
    super();
  }

  /** Set geoman listeners */
  private setUpPmListeners() {
    // By default all drawn layer types have this property to false except for markers and circleMarkers
    // https://github.com/geoman-io/leaflet-geoman#draw-mode
    // We will enable this one for all layer types(including Markers) in order to auto blur when one marker is set
    this.mapComponent?.map.pm.setGlobalOptions({ continueDrawing: false });
    // updates question value on adding new shape
    this.mapComponent?.map.on('pm:create', (l: any) => {
      if (l.shape === 'Marker') {
        l.layer.setIcon(
          createCustomDivIcon({
            icon: 'leaflet_default',
            color: '#3388ff',
            opacity: 1,
            size: 24,
          })
        );
        // If we add a Marker, we will disable the control to set new markers(currently we want to add just one)
        this.mapComponent?.map.pm.Toolbar.setButtonDisabled('drawMarker', true);
      }

      // subscribe to changes on the created layers
      l.layer.on(
        'pm:change',
        this.handleMapEvent({
          type: MapEventType.MAP_CHANGE,
          content: getMapFeature(this.mapComponent?.map),
        })
      );

      l.layer.on('click', (e: any) => {
        this.handleMapEvent({
          type: MapEventType.SELECTED_LAYER,
          content: { layer: e.target },
        });
      });
    });

    // updates question value on removing shapes
    this.mapComponent?.map.on('pm:remove', () => {
      const containsPointMarker = (feature: any) =>
        feature.geometry.type === 'Point';
      const content = getMapFeature(this.mapComponent?.map);
      // If no markers, we enable the point marker control again
      if (!content || !containsPointMarker(content)) {
        this.mapComponent?.map.pm.Toolbar.setButtonDisabled(
          'drawMarker',
          false
        );
      }
      this.handleMapEvent({
        type: MapEventType.MAP_CHANGE,
        content,
      });
    });

    // set language
    const setLang = (lang: string) => {
      if (AVAILABLE_GEOMAN_LANGUAGES.includes(lang)) {
        this.mapComponent?.map.pm.setLang(lang);
      } else {
        console.warn(`Language "${lang}" not supported by geoman`);
        this.mapComponent?.map.pm.setLang('en');
      }
    };

    setLang(this.translate.currentLang || 'en');

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        setLang(event.lang);
      });
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
    this.setUpPmListeners();
    this.addOrDeleteLayer.next({ layerData: baseLayer, isDelete: false });
    this.setDataLayers();
  }

  /** Creates map */
  private setDataLayers(): void {
    //init layers from question value
    const geospatialData = this.data as any;
    if (geospatialData.geometry.coordinates.length > 0) {
      const newLayer = L.geoJSON(this.data, {
        // Circles are not supported by geojson
        // We abstract them as markers with a radius property
        pointToLayer: (feature, latlng) => {
          if (feature.properties.radius) {
            return new L.Circle(latlng, feature.properties.radius);
          } else {
            const icon = createCustomDivIcon({
              color: feature.properties.style?.fillColor || '#3388ff',
              opacity: feature.properties.style?.fillOpacity || 1,
              icon:
                (feature.properties.style?.icon as IconName) ||
                'leaflet_default',
              size: feature.properties.style?.iconSize || 12,
            });
            return new L.Marker(latlng).setIcon(icon);
          }
        },
      } as L.GeoJSONOptions);
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
    console.log(this.selectedLayer);
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

  /**
   * handle leaflet map ready event
   *
   * @param event controls
   */
  public handleDrawReadyEvent(event: any) {
    this.handleMapEvent({
      type: MapEventType.MAP_CHANGE,
      content: getMapFeature(this.mapComponent?.map),
    });
    this.mapComponent?.map.pm.addControls(event);
  }
}
