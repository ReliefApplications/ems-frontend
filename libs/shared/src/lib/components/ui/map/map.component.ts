// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../typings/leaflet/index.d.ts" />
import {
  Component,
  AfterViewInit,
  Input,
  Inject,
  Output,
  EventEmitter,
  OnDestroy,
  Injector,
} from '@angular/core';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
// Leaflet plugins
import 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.control.layers.tree';
import 'leaflet-fullscreen';
import 'esri-leaflet';
import * as Vector from 'esri-leaflet-vector';
import { TranslateService } from '@ngx-translate/core';
//import { takeUntil } from 'rxjs';
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
// import { timeDimensionGeoJSON } from './test/timedimension-test';
import { MapControlsService } from '../../../services/map/map-controls.service';
import * as L from 'leaflet';
import { Layer } from './layer';
// import { GeoJsonObject } from 'geojson';
import {
  ArcgisService,
  TreeObject,
} from '../../../services/map/arcgis.service';
import { MapLayersService } from '../../../services/map/map-layers.service';
import {
  flatten,
  isNil,
  omitBy,
  get,
  difference,
  isEqual,
  flatMapDeep,
} from 'lodash';
import {
  BehaviorSubject,
  concatMap,
  debounceTime,
  filter,
  takeUntil,
} from 'rxjs';
import { MapPopupService } from './map-popup/map-popup.service';
import { Platform } from '@angular/cdk/platform';
import { ContextService } from '../../../services/context/context.service';
import { DOCUMENT } from '@angular/common';

/** Component for the map widget */
@Component({
  selector: 'shared-map',
  templateUrl: './map.component.html',
  styleUrls: ['../../../style/map.scss', './map.component.scss'],
  providers: [MapControlsService, MapPopupService],
})
export class MapComponent
  extends UnsubscribeComponent
  implements AfterViewInit, OnDestroy
{
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

  @Output() mapEvent: EventEmitter<MapEvent> = new EventEmitter<MapEvent>();

  // === MAP ===
  public mapId: string;
  public map!: L.Map;
  private basemap: any;
  private currentBasemapKey!: string;
  private esriApiKey!: string;

  /**
   * Update map settings and redraw it with those
   */
  @Input() set mapSettings(settings: MapConstructorSettings) {
    if (settings) {
      this.mapSettingsValue = settings;
      if (this.map) {
        this.drawMap(false);
      }
    }
  }

  private mapSettingsValue: MapConstructorSettings = {
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
  };

  /**
   * Get current map settings without the layers
   *
   * @returns <MapConstructorSettings,'layers'>
   */
  get mapSettingsWithoutLayers() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { layers, ...rest } = this.mapSettingsValue;
    return { settings: rest };
  }

  private arcGisWebMap: any;

  // === ZOOM ===
  public currentZoom = 2;
  public zoomControl: any = undefined;

  // === MARKERS ===
  // private baseTree!: L.Control.Layers.TreeObject;
  private layerControlButtons: any;

  // === Controls ===
  // Search
  public searchControl?: L.Control;
  @Output() search = new EventEmitter();

  /** Last update control */
  public lastUpdateControl?: L.Control;

  /** query Update info */
  public lastUpdate = '';
  private appliedDashboardFilters: Record<string, any>;

  /** Layers */
  layers: Layer[] = [];
  private layerIds: string[] = [];

  private resizeObserver?: ResizeObserver;

  private basemapTree: L.Control.Layers.TreeObject[][] = [];
  private overlaysTree: L.Control.Layers.TreeObject[][] = [];

  /** Refreshing layers. When true, should prevent layers to be duplicated  */
  private refreshingLayers = new BehaviorSubject<boolean>(true);

  /** Timeout listeners */
  firstLoadEmitTimeoutListener!: NodeJS.Timeout;

  /**
   * Map widget component
   *
   * @param environment platform environment
   * @param translate Angular translate service
   * @param mapControlsService Map controls handler service
   * @param arcgisService Shared arcgis service
   * @param mapLayersService MapLayersService
   * @param mapPopupService The map popup handler service
   * @param contextService The context service
   * @param platform Platform
   * @param injector Injector containing all needed providers
   * @param document document
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService,
    private mapControlsService: MapControlsService,
    private arcgisService: ArcgisService,
    public mapLayersService: MapLayersService,
    public mapPopupService: MapPopupService,
    private contextService: ContextService,
    private platform: Platform,
    public injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
    this.esriApiKey = environment.esriApiKey;
    this.mapId = uuidv4();
    this.appliedDashboardFilters = this.contextService.filter.getValue();
  }

  /** Set map listeners */
  private setUpMapListeners() {
    this.resizeObserver = new ResizeObserver(() => {
      this.map.invalidateSize();
    });
    this.resizeObserver.observe(this.map.getContainer());

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
      this.currentZoom = this.map.getZoom();
      this.mapEvent.emit({
        type: MapEventType.ZOOM_END,
        content: { zoom: this.map.getZoom() },
      });
    });

    // The scroll jump issue only happens on chrome client browser
    // The following line would overwrite default behavior(preventDefault does not work for this purpose in chrome)
    if (this.platform.WEBKIT || this.platform.BLINK) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.map.getContainer().focus = () => {};
    }

    // Listen for language change
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        // Update controls that use translation
        if (event.lang !== this.mapControlsService.lang) {
          this.mapControlsService.getMeasureControl(
            this.map,
            this.extractSettings().controls.measure
          );
          this.mapControlsService.getFullScreenControl(this.map);
        }
      });
  }

  /** Once template is ready, build the map. */
  ngAfterViewInit(): void {
    // Creates the map and adds all the controls we use.
    this.drawMap();

    this.setUpMapListeners();

    if (this.firstLoadEmitTimeoutListener) {
      clearTimeout(this.firstLoadEmitTimeoutListener);
    }
    this.firstLoadEmitTimeoutListener = setTimeout(() => {
      this.map.invalidateSize();
      this.mapEvent.emit({
        type: MapEventType.FIRST_LOAD,
        content: {
          bounds: this.map.getBounds(),
          center: this.map.getCenter(),
          zoom: this.map.getZoom(),
        },
      });
      //}
    }, 1000);

    /**
     * Keep checking until filters are applied in order to apply next one
     */
    let filterCheckTimeoutListener: NodeJS.Timeout;
    const loadNextFilters = (): Promise<void> => {
      const checkAgain = (resolve: () => void) => {
        if (this.refreshingLayers.getValue()) {
          if (filterCheckTimeoutListener) {
            clearTimeout(filterCheckTimeoutListener);
          }
          resolve();
        } else {
          if (filterCheckTimeoutListener) {
            clearTimeout(filterCheckTimeoutListener);
          }
          filterCheckTimeoutListener = setTimeout(
            () => checkAgain(resolve),
            100
          );
        }
      };
      return new Promise(checkAgain);
    };

    // Listen to dashboard filters changes
    this.contextService.filter$
      .pipe(
        debounceTime(500),
        filter(() => {
          const filters = this.contextService.filter.getValue();
          return !isEqual(filters, this.appliedDashboardFilters);
        }),
        concatMap(() => loadNextFilters()),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.filterLayers();
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.firstLoadEmitTimeoutListener) {
      clearTimeout(this.firstLoadEmitTimeoutListener);
    }
    this.resizeObserver?.disconnect();
  }

  /**
   * Extract settings
   *
   * @returns cleaned settings
   */
  private extractSettings(): MapConstructorSettings {
    const mapSettings = omitBy(this.mapSettingsValue, isNil);
    // Settings initialization
    const initialState = get(mapSettings, 'initialState', {
      viewpoint: {
        center: {
          latitude: 0,
          longitude: 0,
        },
        zoom: 3,
      },
    });
    const maxBounds = get(mapSettings, 'maxBounds', [
      [-90, -180],
      [90, 180],
    ]);
    const basemap = get(mapSettings, 'basemap', 'OSM');
    const maxZoom = get(mapSettings, 'maxZoom', 18);
    const minZoom = get(mapSettings, 'minZoom', 2);
    const worldCopyJump = get(mapSettings, 'worldCopyJump', true);
    const zoomControl = get(mapSettings, 'zoomControl', false);
    const controls = get(mapSettings, 'controls', DefaultMapControls);
    const arcGisWebMap = get(mapSettings, 'arcGisWebMap', undefined);
    const layers = get(mapSettings, 'layers', []);

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

  /**
   * Creates the map and adds all the controls we use
   *
   * @param initMap Does the map need to be reloaded
   */
  private drawMap(initMap: boolean = true): void {
    const {
      initialState,
      maxBounds,
      basemap,
      maxZoom,
      minZoom,
      worldCopyJump,
      zoomControl,
      arcGisWebMap,
      layers,
      controls,
    } = this.extractSettings();

    if (initMap) {
      // Create leaflet map
      this.map = L.map(this.mapId, {
        zoomControl,
        maxBounds: maxBounds
          ? L.latLngBounds(
              L.latLng(maxBounds[0][0], maxBounds[0][1]),
              L.latLng(maxBounds[1][0], maxBounds[1][1])
            )
          : undefined,
        minZoom,
        maxZoom,
        worldCopyJump,
        // timeDimension: true,
        disableAutoPan: true,
      } as any).setView(
        L.latLng(
          initialState.viewpoint.center.latitude,
          initialState.viewpoint.center.longitude
        ),
        initialState.viewpoint.zoom
      );

      this.currentZoom = initialState.viewpoint.zoom;
      this.mapControlsService.addControlPlaceholders(this.map);

      // Set the needed map instance for it's popup service instance
      this.mapPopupService.setMap = this.map;
    } else {
      // If value changes for the map we would change in order to not trigger map events unnecessarily
      if (this.map.getMaxZoom() !== maxZoom) {
        this.map.setMaxZoom(maxZoom as number);
      }
      if (this.map.getMinZoom() !== minZoom) {
        this.map.setMinZoom(minZoom as number);
      }
      if (maxBounds) {
        this.map.setMaxBounds(maxBounds as L.LatLngBoundsExpression);
      }
      if (this.map.getZoom() !== initialState.viewpoint.zoom) {
        this.map.setZoom(initialState.viewpoint.zoom);
      }
      // Could ask the map to do some unwanted movements
      // const currentCenter = this.map.getCenter();
      // if (
      //   initialState.viewpoint.center.latitude !== currentCenter.lat ||
      //   initialState.viewpoint.center.longitude !== currentCenter.lng
      // ) {
      //   console.log([
      //     initialState.viewpoint.center.latitude,
      //     initialState.viewpoint.center.longitude,
      //   ]);
      //   this.map.setView(
      //     L.latLng(
      //       initialState.viewpoint.center.latitude,
      //       initialState.viewpoint.center.longitude
      //     ),
      //     initialState.viewpoint.zoom
      //   );
      // }
    }

    // Close layers/bookmarks menu
    this.document.getElementById('layer-control-button-close')?.click();

    this.setupMapLayers({ layers, controls, arcGisWebMap, basemap });
    this.setMapControls(controls, initMap);
  }

  /**
   * Setup the map layers from the settings
   *
   * @param settings map settings
   * @param settings.layers list of layers ids
   * @param settings.controls available map controls
   * @param settings.arcGisWebMap arcgis webmap
   * @param settings.basemap arcgis basemap
   * @param reset reset the layers
   */
  setupMapLayers(
    settings: {
      layers: string[] | undefined;
      controls: MapControls;
      arcGisWebMap: string | undefined;
      basemap: string | undefined;
    },
    reset = false
  ) {
    // Get layers
    const promises: Promise<{
      basemaps?: L.Control.Layers.TreeObject[];
      layers?: L.Control.Layers.TreeObject[];
    }>[] = [];
    // Flag to set again basemap or webmap in map even if no basemap or webmap change is done
    // For layer change case trigger(on layer change all layers, including basemap and webmaps, are deleted by default)
    let layersRemoved = false;

    if (
      this.layerIds.length !== settings.layers?.length ||
      difference(settings.layers, this.layerIds).length ||
      reset
    ) {
      this.map.eachLayer((layer) => {
        this.map.removeLayer(layer);
      });
      layersRemoved = true;
      this.layerIds = settings.layers ?? [];
      if (settings.layers?.length || reset) {
        this.resetLayers();
        if (settings.layers?.length) {
          promises.push(this.getLayers(settings.layers));
        }
      }
    }

    if (
      (!settings.arcGisWebMap &&
        settings.basemap &&
        settings.basemap !== this.currentBasemapKey) ||
      (settings.arcGisWebMap && settings.arcGisWebMap !== this.arcGisWebMap) ||
      (this.arcGisWebMap && !settings.arcGisWebMap) ||
      layersRemoved
    ) {
      if (this.basemap) {
        this.basemap.removeFrom(this.map);
      }
      // Get arcgis layers
      if (settings.arcGisWebMap) {
        // Load arcgis webmap
        promises.push(this.setWebmap(settings.arcGisWebMap));
      } else {
        this.arcGisWebMap = undefined;
        // else, load basemap ( default to osm )
        promises.push(this.setBasemap(this.map, settings.basemap));
      }
    }

    // We need to fetch new layers
    if (promises.length) {
      Promise.all(promises).then((trees) => {
        this.basemapTree = [];
        this.overlaysTree = [];
        for (const tree of trees) {
          tree.basemaps && this.basemapTree.push(tree.basemaps);
          tree.layers && this.overlaysTree.push(tree.layers);
        }
        if (settings.controls.layer) {
          this.setLayersControl(
            flatten(this.basemapTree),
            flatten(this.overlaysTree)
          );
        } else {
          if (this.layerControlButtons) {
            this.layerControlButtons.remove();
          }
        }
      });
    } else {
      // No update on the layers, we only update the controls
      if (settings.controls.layer) {
        this.setLayersControl(
          flatten(this.basemapTree),
          flatten(this.overlaysTree)
        );
      } else {
        if (this.layerControlButtons) {
          this.layerControlButtons.remove();
        }
      }
    }
  }

  /**
   * Add / remove map controls according to the settings
   *
   * @param {MapControls} controls map controls values
   * @param {boolean} initMap if initializing map to add the fixed controls
   */
  private setMapControls(controls: MapControls, initMap = false) {
    // Add leaflet measure control
    this.mapControlsService.getMeasureControl(
      this.map,
      controls.measure ?? false
    );

    // Add TimeDimension control
    // this.mapControlsService.setTimeDimension(
    //   this.map,
    //   controls.timedimension ?? false,
    //   timeDimensionGeoJSON as GeoJsonObject
    // );
    // Add download button and download menu
    this.mapControlsService.getDownloadControl(
      this.map,
      controls.download ?? true
    );
    // Add zoom control
    if (!this.zoomControl && !this.map.zoomControl) {
      this.zoomControl = this.mapControlsService.getZoomControl(
        this.map,
        this.map.getMaxZoom(),
        this.map.getMinZoom(),
        this.map.getZoom(),
        this.mapEvent
      );
    }
    // Add legend control
    this.mapControlsService.getLegendControl(this.map, controls.legend ?? true);
    // If initializing map: add fixed controls
    if (initMap) {
      // Add leaflet fullscreen control
      this.mapControlsService.getFullScreenControl(this.map);
    }
    // Add leaflet geosearch control
    if (controls.search) {
      if (!this.searchControl) {
        this.searchControl = this.mapControlsService.getSearchbarControl(
          this.map,
          this.esriApiKey
        );
        (this.searchControl as any)?.on('results', (data: any) => {
          if ((data.results || []).length > 0) {
            this.search.emit(data.results[0]);
          }
        });
      }
    } else {
      this.searchControl?.remove();
      this.searchControl = undefined;
    }
    this.refreshLastUpdate();
  }

  /**
   * Setup layers control from loaded basemaps and layers
   *
   * @param basemaps loaded basemaps
   * @param layers loaded layers
   */
  private setLayersControl(
    basemaps: L.Control.Layers.TreeObject[],
    layers: L.Control.Layers.TreeObject[]
  ) {
    if (!this.layerControlButtons || !this.layerControlButtons._map) {
      this.layerControlButtons = this.mapControlsService.getLayerControl(
        this,
        basemaps,
        layers
      );
    }
    // this.baseTree = {
    //   label: 'Base Maps',
    //   children: basemaps,
    //   collapsed: true,
    // };
  }

  /**
   * Setup and draw layers on map and sets the baseTree.
   *
   * @param layerIds layerIds from saved edit layer info
   * @returns layers
   */
  private async getLayers(layerIds: string[]) {
    /**
     * Parses a layer into a tree node
     *
     * @param layer The layer to create the tree node from
     * @param leafletLayer The leaflet layer previously created by the parent layer, if any
     * @returns The tree node
     */
    const parseTreeNode = async (
      layer: Layer,
      leafletLayer?: L.Layer
    ): Promise<OverlayLayerTree> => {
      // Add to the layers array if not already added
      if (!this.layers.find((l) => l.id === layer.id)) {
        this.layers.push(layer);
      }

      // Gets the leaflet layer. Either the one passed as parameter
      // (from parent) or the one created by the layer itself (if no parent)
      const featureLayer = leafletLayer ?? (await layer.getLayer());

      // Adds the layer to the map if not already added
      // note: group layers are of type L.LayerGroup
      // so we should check if the layer is not already added
      if (!this.map.hasLayer(featureLayer)) {
        this.map.addLayer(featureLayer);
      }

      const children = await layer.getChildren();

      if (layer.type === 'GroupLayer') {
        // It is a group, it should not have any layer but it should be able to check/uncheck its children
        return {
          label: layer.name,
          selectAllCheckbox: true,
          children:
            children.length > 0
              ? await Promise.all(
                  children.map(async (sublayer) => {
                    const layer = await sublayer.getLayer();
                    return parseTreeNode(sublayer, layer);
                  })
                )
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

    return new Promise<{ layers: L.Control.Layers.TreeObject[] }>((resolve) => {
      this.mapLayersService
        .createLayersFromIds(layerIds, this.injector)
        .then((layers) => {
          const layersTree: any[] = [];
          // Add each layer to the tree
          layers.forEach((layer) => {
            layersTree.push(parseTreeNode(layer));
          });
          Promise.all(layersTree).then((layersTree) => {
            this.refreshLastUpdate();
            resolve({ layers: layersTree });
          });
        });
    });
  }

  /**
   * Adds a layer to the map
   *
   * @param layer layer to be added to the map
   */
  public async addLayer(layer: Layer): Promise<void> {
    (await layer.getLayer()).addTo(this.map);
  }

  /**
   * Draw given layers and adds the related controls
   *
   * @param layers Layers to draw
   */
  private drawLayers(layers: any) {
    const drawLayer = (layer: any): any => {
      if (layer.sublayers) {
        for (const child of layer.sublayers) {
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
        if (layer.layer) {
          this.map.removeLayer(layer.layer);
        }
      }
    };

    if (layers instanceof Array) {
      for (const layer of layers) {
        deleteLayer(layer);
      }
    } else {
      deleteLayer(layers);
    }
    // Reset related properties
    this.resetLayers();
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
   * @param map Leaflet map
   * @param basemap String containing the id (name) of the basemap
   * @returns basemaps as promise
   */
  public setBasemap(
    map: L.Map,
    basemap: any
  ): Promise<{ basemaps: L.Control.Layers.TreeObject[] }> {
    this.currentBasemapKey = basemap as string;
    const basemapName = get(BASEMAP_LAYERS, basemap, BASEMAP_LAYERS.OSM);
    this.basemap = Vector.vectorBasemapLayer(basemapName, {
      apiKey: this.esriApiKey,
    });
    return Promise.resolve({
      basemaps: [
        {
          label: basemapName,
          layer: this.basemap.addTo(map),
        },
      ],
    });
  }

  /**
   * Set the webmap.
   *
   * @param webmap String containing the id (name) of the webmap
   * @returns loaded basemaps and layers as Promise
   */
  public setWebmap(webmap: any): Promise<{
    basemaps: TreeObject[];
    layers: TreeObject[];
  }> {
    this.arcGisWebMap = webmap;
    return this.arcgisService.loadWebMap(this.map, this.arcGisWebMap);
  }

  /** Set the new layers based on the filter value */
  private async filterLayers() {
    this.document.getElementById('layer-control-button-close')?.click();
    const filters = this.contextService.filter.getValue();
    this.refreshingLayers.next(false);
    this.appliedDashboardFilters = filters;
    const { layers: layersToGet, controls } = this.extractSettings();

    const shouldDisplayStatuses: Record<string, boolean> = {};

    const flattenOverlaysTree = (tree: L.Control.Layers.TreeObject): any => {
      return [tree, flatMapDeep(tree.children, flattenOverlaysTree)];
    };

    // remove zoom listeners from old layers
    flatMapDeep(this.overlaysTree.flat(), flattenOverlaysTree)
      .filter((x) => x.layer && (x.layer as any).origin === 'app-builder')
      .forEach((x) => {
        // Store visibility status of the layer
        const shouldDisplay = (x.layer as any).shouldDisplay;
        if (!isNil(shouldDisplay)) {
          shouldDisplayStatuses[(x.layer as any).id] = shouldDisplay;
        }
        (x.layer as any).deleted = true;
        (x.layer as L.Layer).remove();
      });

    // get new layers, with filters applied
    this.resetLayers();
    const l = await this.getLayers(layersToGet ?? []);
    this.overlaysTree = [l.layers];

    flatMapDeep(this.overlaysTree.flat(), flattenOverlaysTree).forEach((x) => {
      if (x.layer) {
        const id = (x.layer as any).id;
        if (!isNil(shouldDisplayStatuses[id])) {
          (x.layer as any).shouldDisplay = shouldDisplayStatuses[id];
          if (!shouldDisplayStatuses[id]) {
            x.layer.remove();
          }
        }
      }
    });

    if (controls.layer) {
      // remove current layer controls
      this.layerControlButtons.remove();
      this.layerControlButtons = null;

      // create new layer controls, from newly created layers
      this.setLayersControl(
        flatten(this.basemapTree),
        flatten(this.overlaysTree)
      );
    }

    this.refreshingLayers.next(true);
  }

  /**
   * Reset current saved layers and remove all attached listeners of those Layer instances
   */
  resetLayers() {
    this.layers.forEach(async (layer) => {
      await layer.removeAllListeners(this.map);
    });
    this.layers = [];
  }

  /**
   * Enable/Disable all handlers in the leaflet map
   *
   * @param disable If handlers must be disabled or not
   */
  disableMapHandlers(disable: boolean) {
    (this.map as any)['_handlers']?.forEach((handler: L.Handler) => {
      disable ? handler.disable() : handler.enable();
    });
  }

  /**
   * Updates the last update control with the latest map refresh time
   */
  private refreshLastUpdate(): void {
    const controls = this.extractSettings().controls;
    if (!isNil(controls.lastUpdate)) {
      if (!this.lastUpdateControl) {
        this.lastUpdateControl = this.mapControlsService.getLastUpdateControl(
          this.map,
          this.extractSettings().controls.lastUpdate as L.ControlPosition
        );
      } else {
        this.lastUpdateControl.remove();
        this.lastUpdateControl = this.mapControlsService.getLastUpdateControl(
          this.map,
          this.extractSettings().controls.lastUpdate as L.ControlPosition
        );
      }
    } else {
      this.lastUpdateControl?.remove();
      this.lastUpdateControl = undefined;
    }
  }
}
