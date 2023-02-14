/// <reference path="../../../../typings/leaflet/index.d.ts" />
import {
  Component,
  AfterViewInit,
  Input,
  Inject,
  Output,
  EventEmitter,
} from '@angular/core';
import get from 'lodash/get';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
// Leaflet plugins
import 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.control.layers.tree';
import 'leaflet-fullscreen';
import 'esri-leaflet';
import * as Vector from 'esri-leaflet-vector';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LayerTree } from './interfaces/map-layers.interface';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from './interfaces/map.interface';
import { BASEMAPS, BASEMAP_LAYERS } from './const/baseMaps';
import { merge } from 'lodash';
import { generateClusterLayer } from './test/cluster-test';
import {
  complexGeoJSON,
  cornerGeoJSON,
  pointGeoJSON,
} from './test/geojson-test';
import {
  geoJsonLayer,
  randomFeatureCollection,
} from './test/feature-collection-test';
import { generateHeatMap } from './test/heatmap-test';
import { SafeMapLayersService } from '../../../services/maps/map-layers.service';
import { SafeMapControlsService } from '../../../services/maps/map-controls.service';
import { AVAILABLE_GEOMAN_LANGUAGES } from './const/languages';

// import 'leaflet';
import * as L from 'leaflet';

/**
 * Cleans the settings object from null values
 *
 * @param settings Settings needed to create/edit map
 */
const cleanSettingsFromNulls = (settings: MapConstructorSettings) => {
  const mapSettingsKeys: (keyof MapConstructorSettings)[] = Object.keys(
    settings
  ) as (keyof MapConstructorSettings)[];

  mapSettingsKeys.forEach((k) => {
    if (settings[k] === null) {
      delete settings[k];
    }
  });
};

/** Component for the map widget */
@Component({
  selector: 'safe-map',
  templateUrl: './map.component.html',
  styleUrls: ['../../../style/map.scss', './map.component.scss'],
  providers: [SafeMapControlsService],
})
export class SafeMapComponent
  extends SafeUnsubscribeComponent
  implements AfterViewInit
{
  @Input() controls!: any;
  @Input() useGeomanTools = false;
  // Temporary input in order to display the mocked layers as we want
  @Input() displayMockedLayers = true;
  /** Map settings setter */
  @Input() set mapSettings(settings: MapConstructorSettings) {
    if (settings) {
      cleanSettingsFromNulls(settings);
      this.updateMapSettings(settings);
    }
  }
  /** Delete layer setter */
  @Input() set deleteLayer(layer: any) {
    if (layer) {
      this.map.removeLayer(layer);
    }
  }
  /** Add layer setter */
  @Input() set addLayer(layerData: any) {
    if (layerData) {
      // When using geoman tools no layer control is shown
      if (!this.useGeomanTools) {
        const control: any = L.control.layers.tree(this.baseTree, layerData);
        control.addTo(this.map);
      }
      this.map.addLayer(layerData.layer);
    }
  }
  /** Update layer options setters */
  @Input() set updateLayerOptions(layerWithOptions: {
    layer: any;
    options: any;
    icon?: any;
  }) {
    if (layerWithOptions) {
      this.mapLayersService.applyOptionsToLayer(
        this.map,
        layerWithOptions.layer,
        layerWithOptions.options,
        layerWithOptions.icon
      );
      // When using geoman tools we update the map status and it's layers always for each change
      if (this.useGeomanTools) {
        this.mapEvent.emit({
          type: MapEventType.MAP_CHANGE,
          content: this.mapLayersService.getMapFeatures(this.map),
        });
      }
    }
  }

  @Output() mapEvent: EventEmitter<MapEvent> = new EventEmitter<MapEvent>();

  // === MAP ===
  public mapId: string;
  public map: any;
  private basemap: any;
  private esriApiKey!: string;
  public settingsConfig: MapConstructorSettings = {
    basemap: 'OSM',
    centerLat: 0,
    centerLong: 0,
  };

  // === MARKERS ===
  private popupMarker: any;
  private baseTree: any;
  private layers: LayerTree[] = [];
  private layerControl: any;
  private layerTreeCloned!: any;

  // === QUERY UPDATE INFO ===
  public lastUpdate = '';

  /**
   * Constructor of the map widget component
   *
   * @param environment platform environment
   * @param translate The translate service
   * @param mapLayersService The map layer handler service
   * @param mapControlsService The map controls handler service
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService,
    private mapLayersService: SafeMapLayersService,
    private mapControlsService: SafeMapControlsService
  ) {
    super();
    this.esriApiKey = environment.esriApiKey;
    this.mapId = uuidv4();
  }

  /** Set map listeners */
  private setUpMapListeners() {
    // Set event listener to log map bounds when zooming, moving and resizing screen.
    this.map.on('moveend', () => {
      // If searched address marker exists, if we move, the item should disappear
      if (this.mapControlsService.addressMarker) {
        this.map.removeLayer(this.mapControlsService.addressMarker);
        this.mapControlsService.addressMarker = null;
      }
      this.mapEvent.emit({
        type: MapEventType.MOVE_END,
        content: { bounds: this.map.getBounds(), center: this.map.getCenter() },
      });
    });

    this.map.on('zoomend', () => {
      this.mapEvent.emit({
        type: MapEventType.ZOOM_END,
        content: { zoom: this.map.getZoom() },
      });
    });

    // Listen for language change
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event.lang !== this.mapControlsService.lang) {
          this.mapControlsService.getMeasureControl(this.map);
          this.mapControlsService.getFullScreenControl(this.map);
        }
      });
  }

  /** Set geoman listeners */
  private setUpPmListeners() {
    // updates question value on adding new shape
    this.map.on('pm:create', (l: any) => {
      if (l.shape === 'Marker')
        l.layer.setIcon(this.mapLayersService.createCustomMarker('#3388ff', 1));

      // subscribe to changes on the created layers
      l.layer.on(
        'pm:change',
        this.mapEvent.emit({
          type: MapEventType.MAP_CHANGE,
          content: this.mapLayersService.getMapFeatures(this.map),
        })
      );

      l.layer.on('click', (e: any) => {
        console.log(e);
        this.mapEvent.emit({
          type: MapEventType.SELECTED_LAYER,
          content: { layer: e.target },
        });
      });
    });

    // updates question value on removing shapes
    this.map.on(
      'pm:remove',
      this.mapEvent.emit({
        type: MapEventType.MAP_CHANGE,
        content: this.mapLayersService.getMapFeatures(this.map),
      })
    );

    // set language
    const setLang = (lang: string) => {
      if (AVAILABLE_GEOMAN_LANGUAGES.includes(lang)) {
        this.map.pm.setLang(lang);
      } else {
        console.warn(`Language "${lang}" not supported by geoman`);
        this.map.pm.setLang('en');
      }
    };

    setLang(this.translate.currentLang || 'en');

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        setLang(event.lang);
      });
  }
  /** Once template is ready, build the map. */
  ngAfterViewInit(): void {
    // Creates the map and adds all the controls we use.
    this.drawMap();
    /**
     * If Geoman tools are going to be used we will set up related listeners
     * Otherwise the map listeners for the user interaction with it
     */
    if (this.useGeomanTools) {
      this.setUpPmListeners();
    } else {
      this.setUpMapListeners();
    }

    setTimeout(() => {
      this.map.invalidateSize();
      if (this.displayMockedLayers) {
        this.drawLayers();
      }
      if (this.useGeomanTools) {
        this.mapEvent.emit({
          type: MapEventType.MAP_CHANGE,
          content: this.mapLayersService.getMapFeatures(this.map),
        });
      } else {
        this.mapEvent.emit({
          type: MapEventType.FIRST_LOAD,
          content: {
            bounds: this.map.getBounds(),
            center: this.map.getCenter(),
            zoom: this.map.getZoom(),
          },
        });
      }
    }, 100);
  }

  /**
   * Extract settings
   *
   * @returns cleaned settings
   */
  private extractSettings(): MapConstructorSettings {
    // Settings initialization
    const centerLong = Number(get(this.settingsConfig, 'centerLong', 0));
    const centerLat = Number(get(this.settingsConfig, 'centerLat', 0));
    const maxBounds = get(this.settingsConfig, 'maxBounds', [
      [-90, -180],
      [90, 180],
    ]);
    const basemap = get(this.settingsConfig, 'basemap', 'OSM');
    const maxZoom = get(this.settingsConfig, 'maxZoom', 18);
    const minZoom = get(this.settingsConfig, 'minZoom', 2);
    const worldCopyJump = get(this.settingsConfig, 'worldCopyJump', true);
    const zoomControl = get(this.settingsConfig, 'zoomControl', false);
    const zoom = get(this.settingsConfig, 'zoom', 3);
    /**
     * TODO implement layer loading for the layers returned from the settings
     *
     * For now the following structure returned from a layer added to a map widget is
     *
     * {
     *    defaultVisibility: boolean,
     *    name: string,
     *    opacity: number,
     *    visibilityRange: number (this would be fixed after we fix the visibilityRange  control)
     * }
     *
     */
    const layers = get(this.settingsConfig, 'layers', []);

    console.log(layers);

    return {
      centerLong,
      centerLat,
      maxBounds,
      basemap,
      maxZoom,
      minZoom,
      worldCopyJump,
      zoomControl,
      zoom,
      layers,
    };
  }

  /** Creates the map and adds all the controls we use */
  private drawMap(): void {
    const {
      centerLong,
      centerLat,
      maxBounds: maxBoundArray,
      basemap,
      maxZoom,
      minZoom,
      worldCopyJump,
      zoomControl,
      zoom,
      // layers,
    } = this.extractSettings();

    // Create leaflet map
    this.map = L.map(this.mapId, {
      zoomControl,
      maxBounds: maxBoundArray
        ? L.latLngBounds(
            L.latLng(maxBoundArray[0][0], maxBoundArray[0][1]),
            L.latLng(maxBoundArray[1][0], maxBoundArray[1][1])
          )
        : undefined,
      minZoom,
      maxZoom,
      worldCopyJump,
      zoom,
    }).setView(L.latLng(centerLat, centerLong), zoom);

    // TODO: see if fixable, issue is that it does not work if leaflet not put in html imports
    this.setBasemap(basemap);

    // Add zoom control
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

    if (this.controls) {
      if (this.useGeomanTools) {
        this.map.pm.addControls(this.controls);
      } else {
        this.controls.forEach((control: any) => this.map.addControl(control));
      }
    }
    if (!this.useGeomanTools) {
      // Add leaflet measure control
      this.mapControlsService.getMeasureControl(this.map);

      // Add leaflet geosearch control
      this.mapControlsService.getSearchbarControl(this.map, this.esriApiKey);

      // Add leaflet fullscreen control
      this.mapControlsService.getFullScreenControl(this.map);

      // Add legend control
      this.mapControlsService.getLegendControl(this.map);

      // Add download button and download menu
      this.mapControlsService.getDownloadControl(this.map);
    }
  }

  /**
   * Update map settings
   *
   * @param settingsValue new settings
   */
  private updateMapSettings(settingsValue: MapConstructorSettings) {
    merge(this.settingsConfig, settingsValue);
    if (this.map) {
      const {
        centerLong,
        centerLat,
        maxBounds,
        basemap,
        maxZoom,
        minZoom,
        zoom,
      } = this.extractSettings();
      this.map.setMaxZoom(maxZoom);
      this.map.setMinZoom(minZoom);
      this.map.setMaxBounds(maxBounds);
      this.map.setZoom(zoom);
      this.setBasemap(basemap);
      this.map.setView(L.latLng(centerLat, centerLong), zoom);
    }
  }
  /**
   * Draw layers on map and sets the baseTree.
   */
  private drawLayers(): void {
    this.baseTree = {
      label: this.basemap.options.key,
      layer: this.basemap,
    };
    const options1 = {
      style: {
        opacity: 0.2,
      },
      visible: false,
      visibilityRange: {
        min: 6,
        max: 12,
      },
    };
    const options2 = {
      style: {
        opacity: 0.5,
      },
    };
    const clusterGroup = generateClusterLayer(this.map, L);
    // this.map.addLayer(clusterGroup);
    this.layers = [
      {
        label: 'GeoJSON layers',
        selectAllCheckbox: 'Un/select all',
        children: [
          {
            label: 'Simple',
            layer: geoJsonLayer(pointGeoJSON),
            options: options2,
          },
          {
            label: 'Complex',
            layer: geoJsonLayer(complexGeoJSON),
            options: options1,
          },
          {
            label: 'Corner',
            layer: geoJsonLayer(cornerGeoJSON),
            options: options2,
          },
          {
            label: 'Random',
            layer: geoJsonLayer(randomFeatureCollection),
          },
        ],
      },
      {
        label: 'Clusters',
        layer: clusterGroup,
      },
      {
        label: 'Heatmap',
        layer: generateHeatMap(this.map),
      },
    ];
    // this.updateLayerTreeOfMap(this.layers);
    const drawLayer = (layer: any) => {
      if (layer.children) {
        for (const child of layer.children) {
          drawLayer(child);
        }
      } else {
        layer.layer.addTo(this.map);
      }
    };
    for (const layer of this.layers) {
      drawLayer(layer);
    }
    this.layerControl = L.control.layers
      .tree(this.baseTree, this.layers as any)
      .addTo(this.map);
  }

  /**
   * Update layer control
   *
   * @param overlays overlays
   */
  // private updateLayerTreeOfMap(overlays: any) {
  //   this.layerTreeCloned = this.addTreeToMap(overlays);
  //   this.applyOptions(this.map.getZoom(), this.layerTreeCloned, true);
  //   this.layerControl = L.control.layers.tree(undefined, this.layerTreeCloned);
  //   (this.layerControl as any).addTo(this.map);
  // }

  /**
   * Function used to apply options
   *
   * @param zoom The current zoom of the map
   * @param layerTree The layer tree, used recursively.
   * @param init Used to init the map or update layers, default false.
   */
  // private applyOptions(zoom: number, layerTree: LayerTree, init = false) {
  //   if (layerTree.children) {
  //     for (const child of layerTree.children) {
  //       this.applyOptions(zoom, child, init);
  //     }
  //   } else if (layerTree.options) {
  //     if (init && layerTree.options.style) {
  //       const layers = get(layerTree, 'layer._layers', {});
  //       for (const layer in layers) {
  //         if (layers[layer].options) {
  //           layers[layer].options.opacity = layerTree.options.style.opacity;
  //           layers[layer].options.fillOpacity = layerTree.options.style.opacity;
  //         }
  //       }
  //       this.map.removeLayer(layerTree.layer);
  //       this.map.addLayer(layerTree.layer);
  //     }
  //     if (init && layerTree.options.visible === false) {
  //       // avoid undefined case matched with !layerTree.options.visible
  //       // init with layer set at not visible by default.
  //       this.map.removeLayer(layerTree.layer);
  //     } else {
  //       if (layerTree.options.visibilityRange) {
  //         if (
  //           zoom > layerTree.options.visibilityRange.max ||
  //           zoom < layerTree.options.visibilityRange.min
  //         ) {
  //           this.map.removeLayer(layerTree.layer);
  //         } else {
  //           layerTree.layer.addTo(this.map);
  //         }
  //       }
  //     }
  //   }
  // }

  /**
   * Create a new layer tree with duplicated layers
   *
   * @param layerTree The layers tree.
   * @returns A tree with each layer duplicated to have a 'left' and 'right' clones
   */
  // private addTreeToMap(layerTree: LayerTree): any {
  //   if (layerTree.children) {
  //     layerTree.children.map((child: any) => {
  //       const newLayer = this.addTreeToMap(child);
  //       child.layer = L.geoJSON(newLayer.layer, {
  //         // Check for icon property
  //         pointToLayer: (feature: any, latlng: any) => {
  //           const marker = L.marker(latlng);
  //           if (feature.properties?.icon?.svg) {
  //             const color = feature.properties.icon.color;
  //             const width = feature.properties.icon.width;
  //             const height = feature.properties.icon.height;
  //             const svg = feature.properties.icon.svg;

  //             const icon = L.divIcon({
  //               className: 'svg-marker',
  //               iconSize: [width, height],
  //               iconAnchor: [0, 24],
  //               popupAnchor: [width / 2, -36],
  //               html: `<span style="--color:${color}">${svg}</span>`,
  //             });

  //             return marker.setIcon(icon);
  //           }
  //           return marker;
  //         },
  //       }).addTo(this.map);
  //     });
  //   } else {
  //     let layerFeature: any[];
  //     if (layerTree.layer.type === 'Feature') {
  //       layerFeature = [layerTree.layer];
  //     } else {
  //       layerFeature = layerTree.layer.features;
  //     }

  //     const features: any[] = [];
  //     for (const feature of layerFeature) {
  //       features.push(feature);

  //       const left = {
  //         type: feature.type,
  //         properties: feature.properties,
  //         geometry: {
  //           coordinates: [] as any[],
  //           type: feature.geometry.type,
  //         },
  //       };
  //       const right = {
  //         type: feature.type,
  //         properties: feature.properties,
  //         geometry: {
  //           coordinates: [] as any[],
  //           type: feature.geometry.type,
  //         },
  //       };

  //       if (feature.geometry.type === 'Point') {
  //         const coordinate = feature.geometry.coordinates;
  //         left.geometry.coordinates = [coordinate[0] - 360, coordinate[1]];
  //         right.geometry.coordinates = [coordinate[0] + 360, coordinate[1]];
  //       } else {
  //         const leftCoordinates: any[] = [];
  //         const rightCoordinates: any[] = [];
  //         for (const coordinate of feature.geometry.coordinates[0]) {
  //           leftCoordinates.push([coordinate[0] - 360, coordinate[1]]);
  //           rightCoordinates.push([coordinate[0] + 360, coordinate[1]]);
  //         }
  //         left.geometry.coordinates.push(leftCoordinates);
  //         right.geometry.coordinates.push(rightCoordinates);
  //       }

  //       features.push(left);
  //       features.push(right);
  //     }

  //     layerTree.layer = {
  //       type: 'FeatureCollection',
  //       features,
  //     };
  //   }
  //   return layerTree;
  // }

  /**
   * Set the basemap.
   *
   * @param basemap String containing the id (name) of the basemap
   */
  public setBasemap(basemap: any = BASEMAPS[BASEMAP_LAYERS.OSM]) {
    if (this.basemap) {
      this.basemap.remove();
    }
    const basemapName = get(BASEMAP_LAYERS, basemap, BASEMAP_LAYERS.OSM);
    this.basemap = Vector.vectorBasemapLayer(basemapName, {
      apiKey: this.esriApiKey,
    }).addTo(this.map);
  }
}
