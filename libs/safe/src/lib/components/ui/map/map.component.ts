// eslint-disable-next-line @typescript-eslint/triple-slash-reference
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
import {
  OverlayLayerTree,
  LayerActionOnMap,
} from './interfaces/map-layers.interface';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
  DefaultMapControls,
  MapControls,
} from './interfaces/map.interface';
import { BASEMAP_LAYERS } from './const/baseMaps';
import { merge } from 'lodash';
import { timeDimensionGeoJSON } from './test/timedimension-test';
import { SafeMapControlsService } from '../../../services/map/map-controls.service';

// import 'leaflet';
import * as L from 'leaflet';
import { Layer } from './layer';
import { MOCK_LAYER_SETTINGS } from './test/layer-settings-test';
import { getMapFeatures } from './utils/get-map-features';
import { LayerProperties } from './interfaces/layer-settings.type';
import { GeoJsonObject } from 'geojson';
import { createCustomDivIcon } from './utils/create-div-icon';
import { AVAILABLE_GEOMAN_LANGUAGES } from './const/language';
import { ArcgisService } from '../../../services/map/arcgis.service';

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
export class MapComponent
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
  /** Add or delete layer setter */
  @Input() set addOrDeleteLayer(layerAction: LayerActionOnMap | null) {
    if (layerAction?.layerData) {
      if (!layerAction.isDelete) {
        this.drawLayers(layerAction.layerData);
      } else {
        this.deleteLayers(layerAction.layerData);
      }
    }
  }
  /** Update layer options setters */
  @Input() set updateLayerOptions(layerWithOptions: {
    layer: any;
    options: LayerProperties;
    icon?: L.DivIcon;
  }) {
    if (layerWithOptions) {
      Layer.applyOptionsToLayer(
        this.map,
        layerWithOptions.layer,
        layerWithOptions.options,
        layerWithOptions.icon
      );
      // When using geoman tools we update the map status and it's layers always for each change
      if (this.useGeomanTools) {
        this.mapEvent.emit({
          type: MapEventType.MAP_CHANGE,
          content: getMapFeatures(this.map),
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
    initialState: {
      viewpoint: {
        center: {
          longitude: 0,
          latitude: 0,
        },
        zoom: 2,
      },
    },
    controls: DefaultMapControls,
    arcGisWebMap: 'e322b877a98847d79692a3c7bf45e5cf',
  };
  private arcGisWebMap: any;

  // === MARKERS ===
  private baseTree!: L.Control.Layers.TreeObject;
  private layersTree: L.Control.Layers.TreeObject[] = [];
  private layerControl: any;

  // === QUERY UPDATE INFO ===
  public lastUpdate = '';

  // === LAYERS ===
  private layers: Layer[] = [];

  /**
   * Map widget component
   *
   * @param environment platform environment
   * @param translate Angular translate service
   * @param mapControlsService Map controls handler service
   * @param arcgisService Shared arcgis service
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService,
    private mapControlsService: SafeMapControlsService,
    private arcgisService: ArcgisService
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
          this.mapControlsService.getMeasureControl(
            this.map,
            this.extractSettings().controls.measure
          );
          this.mapControlsService.getFullScreenControl(this.map);
        }
      });
  }

  /** Set geoman listeners */
  private setUpPmListeners() {
    // updates question value on adding new shape
    this.map.on('pm:create', (l: any) => {
      if (l.shape === 'Marker')
        l.layer.setIcon(
          createCustomDivIcon({
            icon: 'leaflet_default',
            color: '#3388ff',
            opacity: 1,
            size: 24,
          })
        );

      // subscribe to changes on the created layers
      l.layer.on(
        'pm:change',
        this.mapEvent.emit({
          type: MapEventType.MAP_CHANGE,
          content: getMapFeatures(this.map),
        })
      );

      l.layer.on('click', (e: any) => {
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
        content: getMapFeatures(this.map),
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
        this.setUpLayers();
        // Add legend control
        this.mapControlsService.getLegendControl(
          this.map,
          this.layers,
          this.extractSettings().controls.legend
        );
      }
      if (this.useGeomanTools) {
        this.mapEvent.emit({
          type: MapEventType.MAP_CHANGE,
          content: getMapFeatures(this.map),
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
    const initialState = get(this.settingsConfig, 'initialState', {
      viewpoint: {
        center: {
          latitude: 0,
          longitude: 0,
        },
        zoom: 3,
      },
    });

    const maxBounds = get(this.settingsConfig, 'maxBounds', [
      [-90, -180],
      [90, 180],
    ]);
    const basemap = get(this.settingsConfig, 'basemap', 'OSM');
    const maxZoom = get(this.settingsConfig, 'maxZoom', 18);
    const minZoom = get(this.settingsConfig, 'minZoom', 2);
    const worldCopyJump = get(this.settingsConfig, 'worldCopyJump', true);
    const zoomControl = get(this.settingsConfig, 'zoomControl', false);
    const controls = get(this.settingsConfig, 'controls', DefaultMapControls);
    const arcGisWebMap = get(
      this.settingsConfig,
      'arcGisWebMap',
      'e322b877a98847d79692a3c7bf45e5cf'
    );
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
      initialState,
      maxBounds,
      basemap,
      maxZoom,
      minZoom,
      worldCopyJump,
      zoomControl,
      layers,
      controls,
      arcGisWebMap,
    };
  }

  /** Creates the map and adds all the controls we use */
  private drawMap(): void {
    const {
      initialState,
      maxBounds: maxBoundArray,
      basemap,
      maxZoom,
      minZoom,
      worldCopyJump,
      zoomControl,
      arcGisWebMap,
      // layers,
      controls,
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
      timeDimension: true,
    } as any).setView(
      L.latLng(
        initialState.viewpoint.center.latitude,
        initialState.viewpoint.center.longitude
      ),
      initialState.viewpoint.zoom
    );

    //set webmap
    this.setWebmap(arcGisWebMap);

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
      this.setMapControls(controls, true);
    }
  }

  /**
   * Add / remove map controls according to the settings
   *
   * @param {MapControls} controls map controls values
   * @param {boolean} [initMap=false] if initializing map to add the fixed controls
   */
  private setMapControls(controls: MapControls, initMap = false) {
    // Add leaflet measure control
    this.mapControlsService.getMeasureControl(
      this.map,
      controls.measure ?? false
    );
    // Add leaflet geosearch control
    this.mapControlsService.getSearchbarControl(
      this.map,
      this.esriApiKey,
      controls.search ?? false
    );
    // Add TimeDimension control
    this.mapControlsService.setTimeDimension(
      this.map,
      controls.timedimension ?? false,
      timeDimensionGeoJSON as GeoJsonObject
    );
    // Add download button and download menu
    this.mapControlsService.getDownloadControl(
      this.map,
      controls.download ?? true
    );
    // Add legend contorl if layers ready
    if (this.layerControl) {
      this.mapControlsService.getLegendControl(
        this.map,
        this.layers,
        controls.legend ?? true
      );
    }
    // Add layer contorl
    if (controls.layer) {
      if (this.layerControl) {
        this.layerControl.addTo(this.map);
      }
    } else {
      if (this.layerControl) {
        this.layerControl.remove();
      }
    }
    // If initializing map: add fixed controls
    if (initMap) {
      // Add leaflet fullscreen control
      this.mapControlsService.getFullScreenControl(this.map);
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
        initialState,
        maxBounds,
        basemap,
        maxZoom,
        minZoom,
        controls,
        arcGisWebMap,
      } = this.extractSettings();

      // If value changes for the map we would change in order to not trigger map events unnecessarily
      if (this.map.getMaxZoom() !== maxZoom) {
        this.map.setMaxZoom(maxZoom);
      }
      if (this.map.getMinZoom() !== minZoom) {
        this.map.setMinZoom(minZoom);
      }

      this.map.setMaxBounds(maxBounds);

      if (this.map.getZoom() !== initialState.viewpoint.zoom) {
        this.map.setZoom(initialState.viewpoint.zoom);
      }

      if (basemap) {
        const currentBasemap = this.basemap?.options?.key;
        const newBaseMap = get(BASEMAP_LAYERS, basemap);
        if (newBaseMap !== currentBasemap) {
          this.setBasemap(basemap);
        }
      }

      if (arcGisWebMap) {
        const currentWebMap = this.arcGisWebMap;
        if (arcGisWebMap !== currentWebMap) {
          this.setWebmap(arcGisWebMap);
        }
      }

      const currentCenter = this.map.getCenter();
      if (
        initialState.viewpoint.center.latitude !== currentCenter.lat ||
        initialState.viewpoint.center.longitude !== currentCenter.lng
      ) {
        this.map.setView(
          L.latLng(
            initialState.viewpoint.center.latitude,
            initialState.viewpoint.center.longitude
          ),
          initialState.viewpoint.zoom
        );
      }

      this.setMapControls(controls);
    }
  }

  /**
   * Setup and draw layers on map and sets the baseTree.
   */
  private setUpLayers(): void {
    this.layersTree = [];

    this.basemap = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.map);
    this.baseTree = {
      label: 'Base Maps',
      children: [
        {
          label: 'OSM',
          layer: this.basemap,
        },
      ],
      collapsed: true,
    };

    /**
     * Parses a layer into a tree node
     *
     * @param layer The layer to create the tree node from
     * @param leafletLayer The leaflet layer previously created by the parent layer, if any
     * @returns The tree node
     */
    const parseTreeNode = (
      layer: Layer,
      leafletLayer?: L.Layer
    ): OverlayLayerTree => {
      // Add to the layers array
      this.layers.push(layer);

      // Gets the leaflet layer. Either the one passed as parameter
      // (from parent) or the one created by the layer itself (if no parent)
      const featureLayer = leafletLayer ?? layer.getLayer();

      // Adds the layer to the map if not already added
      // note: group layers are of type L.LayerGroup
      // so we should check if the layer is not already added
      if (!this.map.hasLayer(featureLayer)) this.map.addLayer(featureLayer);

      const children = layer.getChildren();
      if (layer.type === 'group') {
        // It is a group, it should not have any layer but it should be able to check/uncheck its children
        return {
          label: layer.name,
          selectAllCheckbox: true,
          children:
            children.length > 0
              ? children.map((c) => parseTreeNode(c.object, c.layer))
              : undefined,
        };
      } else {
        // It is a node, it does not have any children but it displays a layer
        return {
          label: layer.name,
          layer: featureLayer,
        };
      }
    };

    const layers = [new Layer(MOCK_LAYER_SETTINGS)];

    // Add each layer to the tree
    layers.forEach((layer) => {
      this.layersTree.push(parseTreeNode(layer));
    });

    // Add control to the map layers
    this.layerControl = L.control.layers.tree(
      this.baseTree,
      this.layersTree as any
    );

    if (this.extractSettings().controls.layer) {
      this.layerControl.addTo(this.map);
    }
  }

  /**
   * Draw given layers and adds the related controls
   *
   * @param layers Layers to draw
   */
  private drawLayers(layers: any) {
    const drawLayer = (layer: any): any => {
      if (layer.children) {
        for (const child of layer.children) {
          drawLayer(child);
        }
      } else {
        layer.layer.addTo(this.map);
      }
    };

    if (layers instanceof Array) {
      for (const layer of layers) {
        drawLayer(layer);
      }
    } else {
      drawLayer(layers);
    }

    this.layerControl = L.control.layers.tree(this.baseTree, layers as any);

    if (this.extractSettings().controls.layer) {
      this.layerControl.addTo(this.map);
    }
  }

  /**
   * Delete given layers and deletes the related controls
   *
   * @param layers Layers to delete
   */
  private deleteLayers(layers: any) {
    const deleteLayer = (layer: any) => {
      if (layer.children) {
        for (const child of layer.children) {
          deleteLayer(child);
        }
      } else {
        this.map.removeLayer(layer.layer);
      }
    };

    if (layers instanceof Array) {
      for (const layer of layers) {
        deleteLayer(layer);
      }
    } else {
      deleteLayer(layers);
    }

    this.map.removeControl(this.layerControl);
  }
  //   /**
  //  * Function used to apply options
  //  *
  //  * @param zoom The current zoom of the map
  //  * @param layerTree The layer tree, used recursively.
  //  */
  //   private applyOptions(
  //     zoom: number,
  //     layerTree: BaseLayerTree | OverlayLayerTree
  //   ) {
  //     if (layerTree.children) {
  //       for (const child of layerTree.children) {
  //         this.applyOptions(zoom, child);
  //       }
  //     } else if (layerTree.options) {
  //       const options = {
  //         ...layerTree.options,
  //         ...(layerTree.options.style && layerTree.options.style),
  //       };
  //       this.mapLayersService.applyOptionsToLayer(
  //         this.map,
  //         layerTree.layer,
  //         options
  //       );
  //     }
  //   }

  /**
   * Update layer control tree and layer display in the map
   *
   * @param overlaysTree Information regarding the layer/control that is going to be updated
   * @param mockedData If mocked data has to be displayed,
   * @param isDelete If is a delete operation
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
  public setBasemap(basemap: any) {
    // @TODO when switching between basemaps the related layers and controls to the previous map are there
    if (this.basemap) {
      this.basemap.remove();
    }
    const basemapName = get(BASEMAP_LAYERS, basemap, BASEMAP_LAYERS.OSM);
    this.basemap = Vector.vectorBasemapLayer(basemapName, {
      apiKey: this.esriApiKey,
    }).addTo(this.map);
  }

  /**
   * Set the webmap.
   *
   * @param webmap String containing the id (name) of the webmap
   */
  public setWebmap(webmap: any) {
    this.arcGisWebMap = webmap;
    this.arcgisService.loadWebMap(this.map, this.arcGisWebMap);
  }
}
