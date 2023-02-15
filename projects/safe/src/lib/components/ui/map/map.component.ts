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
import 'leaflet.markercluster';
import 'leaflet.control.layers.tree';
import 'leaflet-fullscreen';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {
  IMarkersLayerValue,
  OverlayLayerTree,
  BaseLayerTree,
  LayerActionOnMap,
} from './interfaces/map-layers.interface';
import { flatDeep } from './utils/array-flatter';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from './interfaces/map.interface';
import { BASEMAPS, BASEMAP_LAYERS } from './const/baseMaps';
import { merge } from 'lodash';
import { generateClusterLayer } from './cluster-test';
import { complexGeoJSON, cornerGeoJSON, pointGeoJSON } from './geojson-test';
import { randomFeatureCollection } from './generateFeatureCollection';
import { generateHeatMap } from './heatmap-test';
import { SafeMapLayersService } from '../../../services/maps/map-layers.service';
import { SafeMapControlsService } from '../../../services/maps/map-controls.service';
import { AVAILABLE_GEOMAN_LANGUAGES } from './const/languages';

// Declares L to be able to use Leaflet from CDN
declare let L: any;

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
  @Input() header = true;
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
  /** Add or delete layer setter */
  @Input() set addOrDeleteLayer(layerAction: LayerActionOnMap | null) {
    if (layerAction?.layerData) {
      this.updateLayerTreeOfMap(
        layerAction.layerData,
        layerAction.isDelete,
        false
      );
    }
  }
  /** Update layer options setters */
  @Input() set updateLayerOptions(layerWithOptions: {
    layer: any;
    options: any;
    icon?: any;
  }) {
    if (layerWithOptions) {
      this.safeMapLayersService.applyOptionsToLayer(
        this.map,
        layerWithOptions.layer,
        layerWithOptions.options,
        layerWithOptions.icon
      );
      // When using geoman tools we update the map status and it's layers always for each change
      if (this.useGeomanTools) {
        this.mapEvent.emit({
          type: MapEventType.MAP_CHANGE,
          content: this.safeMapLayersService.getMapFeatures(this.map),
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
  private markersCategories: IMarkersLayerValue = [];
  private overlaysTree: OverlayLayerTree = {} as OverlayLayerTree;
  private layerControl: any;

  // === Controls ===
  private legendControl?: L.Control;
  private layerTreeCloned!: any;

  // === QUERY UPDATE INFO ===
  public lastUpdate = '';

  /**
   * Constructor of the map widget component
   *
   * @param environment platform environment
   * @param translate The translate service
   * @param safeMapLayersService The map layer handler service
   * @param safeMapControlsService The map controls handler service
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService,
    private safeMapLayersService: SafeMapLayersService,
    private safeMapControlsService: SafeMapControlsService
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
      if (this.safeMapControlsService.addressMarker) {
        this.map.removeLayer(this.safeMapControlsService.addressMarker);
        this.safeMapControlsService.addressMarker = null;
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
        if (event.lang !== this.safeMapControlsService.lang) {
          this.safeMapControlsService.getMeasureControl(this.map);
          this.safeMapControlsService.getFullScreenControl(this.map);
        }
      });
  }

  /** Set geoman listeners */
  private setUpPmListeners() {
    // updates question value on adding new shape
    this.map.on('pm:create', (l: any) => {
      if (l.shape === 'Marker') {
        const divIcon = this.safeMapLayersService.createCustomDivIcon(
          undefined,
          {
            color: '#3388ff',
            opacity: 1,
          }
        );
        l.layer.setIcon(divIcon);
      }

      // subscribe to changes on the created layers
      l.layer.on(
        'pm:change',
        this.mapEvent.emit({
          type: MapEventType.MAP_CHANGE,
          content: this.safeMapLayersService.getMapFeatures(this.map),
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
        content: this.safeMapLayersService.getMapFeatures(this.map),
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
          content: this.safeMapLayersService.getMapFeatures(this.map),
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
   * Get list of query fields from settings
   *
   * @param fields list of fields
   * @param prefix prefix to add to field name
   * @returns flat list of fields
   */
  private getFields(
    fields: any[],
    prefix?: string
  ): { name: string; label: string }[] {
    return flatDeep(
      fields
        .filter((x) => x.kind !== 'LIST')
        .map((f) => {
          switch (f.kind) {
            case 'OBJECT': {
              return this.getFields(f.fields, f.name);
            }
            default: {
              return {
                name: prefix ? `${prefix}.${f.name}` : f.name,
                label: f.label,
              };
            }
          }
        })
    );
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
    const maxBounds = get(
      this.settingsConfig,
      'maxBounds',
      L.latLngBounds(L.latLng(-90, -1000), L.latLng(90, 1000))
    );
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
      maxBounds,
      basemap,
      maxZoom,
      minZoom,
      worldCopyJump,
      zoomControl,
      zoom,
      // layers,
    } = this.extractSettings();
    // Create leaflet map
    console.log('zoom: ', zoom);
    this.map = L.map(this.mapId, {
      zoomControl,
      maxBounds,
      minZoom,
      maxZoom,
      worldCopyJump,
      zoom,
    }).setView(new L.latLng(centerLat, centerLong), zoom);

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
      this.safeMapControlsService.getMeasureControl(this.map);

      // Add leaflet geosearch control
      this.safeMapControlsService.getSearchbarControl(
        this.map,
        this.esriApiKey
      );

      // Add leaflet fullscreen control
      this.safeMapControlsService.getFullScreenControl(this.map);
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
      this.map.setView(new L.latLng(centerLat, centerLong), zoom);
    }
  }
  /**
   * Draw layers on map.
   */
  private drawLayers(): void {
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
    const clusterGroup = generateClusterLayer(
      this.map,
      L,
      this.safeMapLayersService
    );
    this.map.addLayer(clusterGroup);
    this.overlaysTree = {
      label: 'GeoJSON layers',
      selectAllCheckbox: 'Un/select all',
      children: [
        {
          label: 'Simple',
          layer: pointGeoJSON,
          options: options2,
        },
        {
          label: 'Complex',
          layer: complexGeoJSON,
          options: options1,
        },
        {
          label: 'Corner',
          layer: cornerGeoJSON,
          options: options2,
        },
        {
          label: 'Random',
          layer: randomFeatureCollection,
        },
      ],
    };

    //Heatmap
    generateHeatMap(this.map);
    this.updateLayerTreeOfMap(this.overlaysTree);
  }

  /**
   * Update layer control tree and layer display in the map
   *
   * @param overlaysTree Information regarding the layer/control that is going to be updated
   * @param mockedData If mocked data has to be displayed,
   * @param isDelete If is a delete operation
   */
  private updateLayerTreeOfMap(
    overlaysTree: OverlayLayerTree,
    isDelete: boolean = false,
    mockedData: boolean = true
  ): void {
    if (isDelete) {
      this.layerTreeCloned = overlaysTree;
      if (!this.useGeomanTools && this.layerControl) {
        this.map.removeControl(this.layerControl);
      }
      const layers = get(this.layerTreeCloned, '_layers', []);
      for (const layerKey in layers) {
        if (layers[layerKey]) {
          this.map.removeLayer(layers[layerKey]);
        }
      }
      this.layerControl = null;
    } else {
      if (mockedData) {
        this.layerTreeCloned = this.addTreeToMap(overlaysTree);
      } else {
        this.layerTreeCloned = overlaysTree;
      }
      this.applyOptions(this.map.getZoom(), this.layerTreeCloned);
      if (!this.useGeomanTools) {
        this.layerControl = L.control.layers
          .tree(undefined, this.layerTreeCloned)
          .addTo(this.map);
      }
    }
  }

  /**
   * Create a new layer tree with duplicated layers
   *
   * @param layerTree The layers tree.
   * @returns A tree with each layer duplicated to have a 'left' and 'right' clones
   */
  private addTreeToMap(layerTree: OverlayLayerTree): any {
    if (layerTree.children) {
      layerTree.children.map((child: any) => {
        const newLayer = this.addTreeToMap(child);
        child.layer = L.geoJSON(newLayer.layer, {
          // Check for icon property
          pointToLayer: (feature: any, latlng: any) => {
            const marker = L.marker(latlng);
            if (feature.properties?.icon) {
              const icon = this.safeMapLayersService.createCustomDivIcon(
                feature.properties.icon
              );
              return marker.setIcon(icon);
            }
            return marker;
          },
        }).addTo(this.map);
      });
    } else {
      let layerFeature: any[];
      if (layerTree.layer.type === 'Feature') {
        layerFeature = [layerTree.layer];
      } else {
        layerFeature = layerTree.layer.features;
      }

      const features: any[] = [];
      for (const feature of layerFeature) {
        features.push(feature);

        const left = {
          type: feature.type,
          properties: feature.properties,
          geometry: {
            coordinates: [] as any[],
            type: feature.geometry.type,
          },
        };
        const right = {
          type: feature.type,
          properties: feature.properties,
          geometry: {
            coordinates: [] as any[],
            type: feature.geometry.type,
          },
        };

        if (feature.geometry.type === 'Point') {
          const coordinate = feature.geometry.coordinates;
          left.geometry.coordinates = [coordinate[0] - 360, coordinate[1]];
          right.geometry.coordinates = [coordinate[0] + 360, coordinate[1]];
        } else {
          const leftCoordinates: any[] = [];
          const rightCoordinates: any[] = [];
          for (const coordinate of feature.geometry.coordinates[0]) {
            leftCoordinates.push([coordinate[0] - 360, coordinate[1]]);
            rightCoordinates.push([coordinate[0] + 360, coordinate[1]]);
          }
          left.geometry.coordinates.push(leftCoordinates);
          right.geometry.coordinates.push(rightCoordinates);
        }

        features.push(left);
        features.push(right);
      }

      layerTree.layer = {
        type: 'FeatureCollection',
        features,
      };
    }
    return layerTree;
  }

  /**
   * Function used to apply options
   *
   * @param zoom The current zoom of the map
   * @param layerTree The layer tree, used recursively.
   */
  private applyOptions(
    zoom: number,
    layerTree: BaseLayerTree | OverlayLayerTree
  ) {
    if (layerTree.children) {
      for (const child of layerTree.children) {
        this.applyOptions(zoom, child);
      }
    } else if (layerTree.options) {
      const options = {
        ...layerTree.options,
        ...(layerTree.options.style && layerTree.options.style),
      };
      this.safeMapLayersService.applyOptionsToLayer(
        this.map,
        layerTree.layer,
        options
      );
    }
  }

  /** Load the data, using widget parameters. */
  private getData(): void {
    this.map.closePopup(this.popupMarker);

    // this.dataQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
    //   const today = new Date();
    //   this.lastUpdate =
    //     ('0' + today.getHours()).slice(-2) +
    //     ':' +
    //     ('0' + today.getMinutes()).slice(-2);
    // });
  }

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
    this.basemap = L.esri.Vector.vectorBasemapLayer(basemapName, {
      apiKey: this.esriApiKey,
    }).addTo(this.map);
  }
}
