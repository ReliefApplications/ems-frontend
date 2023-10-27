import {
  EventEmitter,
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MARKER_OPTIONS } from '../../components/ui/map/const/marker-options';
import { MapDownloadComponent } from '../../components/ui/map/map-download/map-download.component';
import { DomService } from '../dom/dom.service';
// import { GeoJsonObject } from 'geojson';
/// <reference path="../../../../typings/leaflet/index.d.ts" />
import * as L from 'leaflet';
import 'esri-leaflet';
import 'leaflet-fullscreen';
import 'leaflet-measure';
import * as Geocoding from 'esri-leaflet-geocoder';
import { AVAILABLE_MEASURE_LANGUAGES } from '../../components/ui/map/const/language';
import { MapSidenavControlsComponent } from '../../components/ui/map/map-sidenav-controls/map-sidenav-controls.component';
import { legendControl } from '../../components/ui/map/controls/legend.control';
import { MapZoomComponent } from '../../components/ui/map/map-zoom/map-zoom.component';
import { MapEvent } from '../../components/ui/map/interfaces/map.interface';
import { MapComponent } from '../../components/ui/map';
import { createFontAwesomeIcon } from '../../components/ui/map/utils/create-div-icon';
import { DOCUMENT } from '@angular/common';

/**
 * Shared map control service.
 */
@Injectable()
export class MapControlsService {
  public addressMarker: any;
  public measureControls: any = {};
  public fullscreenControl!: L.Control;
  public lang!: any;
  // === THEME ===
  private primaryColor = '';
  // === Time Dimension ===
  // private timeDimensionLayer!: any | null;
  // private timeDimensionControl!: L.Control | null;
  // === Map controls ===
  private downloadControl!: L.Control | null;
  private legendControl!: L.Control | null;

  // === Listeners ===
  private renderer!: Renderer2;
  private sidenavControlClickListener!: any;
  private sidenavControlWheelListener!: any;
  private downloadControlClickListener!: any;
  private downloadControlWheelListener!: any;

  /**
   * Shared map control service
   *
   * @param {Document} document current document
   * @param environment environment
   * @param translate Angular translate service
   * @param domService Shared dom service
   * @param _renderer RendererFactory2
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject('environment') environment: any,
    private translate: TranslateService,
    private domService: DomService,
    private _renderer: RendererFactory2
  ) {
    this.renderer = _renderer.createRenderer(null, null);
    this.lang = this.translate.currentLang;
    this.primaryColor = environment.theme.primary;
  }

  /**
   * Creates the layer control.
   *
   * @param mapComponent map component
   * @param basemaps basemaps of the map
   * @param layers layers used to create the layers tree
   * @returns A button to activate/deactivate the layers
   */
  public getLayerControl(
    mapComponent: MapComponent,
    basemaps: L.Control.Layers.TreeObject[],
    layers: L.Control.Layers.TreeObject[]
  ): void {
    const layerControl = new L.Control({ position: 'topright' });
    layerControl.onAdd = () => {
      const container = L.DomUtil.create('div');
      const mapSidenavControlsComponent = this.domService.appendComponentToBody(
        MapSidenavControlsComponent,
        container
      );
      mapSidenavControlsComponent.instance.layersTree = layers;
      mapSidenavControlsComponent.instance.mapComponent = mapComponent;
      mapSidenavControlsComponent.instance.basemaps = basemaps;
      return container;
    };
    layerControl.onRemove = () => {
      if (this.sidenavControlClickListener) {
        this.sidenavControlClickListener();
        this.sidenavControlClickListener = null;
      }
      if (this.sidenavControlWheelListener) {
        this.sidenavControlWheelListener();
        this.sidenavControlWheelListener = null;
      }
    };
    const container = layerControl.getContainer();
    if (container) {
      if (this.sidenavControlClickListener) {
        this.sidenavControlClickListener();
      }
      // prevent click events from propagating to the map
      this.sidenavControlClickListener = this.renderer.listen(
        container,
        'click',
        (e: any) => {
          L.DomEvent.stopPropagation(e);
        }
      );
      if (this.sidenavControlWheelListener) {
        this.sidenavControlWheelListener();
      }
      // prevent mouse wheel events from propagating to the map
      this.sidenavControlWheelListener = this.renderer.listen(
        container,
        'wheel',
        (e: any) => {
          L.DomEvent.stopPropagation(e);
        }
      );
    }
    return (layerControl as any)?.addTo(mapComponent.map);
  }

  /**
   * Create a custom searchbar control with esri geocoding
   *
   * @param map current map
   * @param apiKey arcgis api key
   * @returns searchbar control
   */
  public getSearchbarControl(map: L.Map, apiKey: string) {
    const control = Geocoding.geosearch({
      position: 'topleft',
      // todo: translate
      placeholder: this.translate.instant('common.placeholder.address'), // 'Enter an address or place e.g. 1 York St'
      useMapBounds: false,
      providers: [
        Geocoding.arcgisOnlineProvider({
          apikey: apiKey,
          nearby: {
            lat: -33.8688,
            lng: 151.2093,
          },
        }),
      ],
    });
    (control as any)?.on('results', (data: any) => {
      // results.clearLayers();
      if ((data.results || []).length > 0) {
        for (let i = data.results.length - 1; i >= 0; i--) {
          // if (this.useGeomanTools) {
          //   updateGeoManLayerPosition(map, data.results[i]);
          // }
          const coordinates = L.latLng(data.results[i].latlng);
          const circle = L.circleMarker(coordinates, MARKER_OPTIONS);
          circle.addTo(map);
          const popup = L.popup()
            .setLatLng(coordinates)
            .setContent(
              `
                  <p>${data.results[i].properties.ShortLabel}</br>
                  <b>${'latitude: '}</b>${coordinates.lat}</br>
                  <b>${'longitude: '}</b>${coordinates.lng}</p>`
            );
          circle.bindPopup(popup);
          popup.on('remove', () => map.removeLayer(circle));
          circle.openPopup();
          // Use setTimeout to prevent the marker to be removed while
          // the map moves to the searched address and is re-centred
          setTimeout(() => {
            this.addressMarker = circle;
          }, 1000);
        }
      }
    });
    (control as any)?.addTo(map);
    return control;
  }

  /**
   * Create a fullscreen control and add it to map.
   * Support translation.
   *
   * @param map current map
   */
  public getFullScreenControl(map: L.Map): void {
    if (this.fullscreenControl) {
      map.removeControl(this.fullscreenControl);
    }
    this.fullscreenControl = new (L.Control as any).Fullscreen({
      title: {
        false: this.translate.instant('common.viewFullscreen'),
        true: this.translate.instant('common.exitFullscreen'),
      },
    });
    this.fullscreenControl?.addTo(map);
  }

  /**
   * Create a custom measure control with leaflet-measure and adds it to the map
   *
   * @param map current map
   * @param addControl flag that indicates if should add or remove the control
   */
  public getMeasureControl(map: L.Map, addControl = true): void {
    if (addControl) {
      // Get lang from translate service, and use default one if no match provided by plugin
      const lang = AVAILABLE_MEASURE_LANGUAGES.includes(
        this.translate.currentLang
      )
        ? this.translate.currentLang
        : 'en';
      // Check if one control was already added for the lang
      if (!this.measureControls[lang]) {
        // import related file, and build control
        import(`leaflet-measure/dist/leaflet-measure.${lang}.js`).then(() => {
          (L.Control as any).Measure.include({
            // set icon on the capture marker
            /**
             * Function to replace for the Measure plugin
             * (https://github.com/ljagis/leaflet-measure/issues/171)
             */
            // eslint-disable-next-line object-shorthand
            _setCaptureMarkerIcon: function () {
              // disable autopan
              // eslint-disable-next-line no-underscore-dangle
              this._captureMarker.options.autoPanOnFocus = false;

              // default function
              // eslint-disable-next-line no-underscore-dangle
              this._captureMarker.setIcon(
                L.divIcon({
                  // eslint-disable-next-line no-underscore-dangle
                  iconSize: this._map.getSize().multiplyBy(2),
                })
              );
            },
          });
          const control = new (L.Control as any).Measure({
            position: 'bottomleft',
            primaryLengthUnit: 'kilometers',
            primaryAreaUnit: 'sqmeters',
            activeColor: this.primaryColor,
            completedColor: this.primaryColor,
          });

          this.measureControls[lang] = control;
          // Remove previous control if exists
          if (this.measureControls[this.lang]) {
            map.removeControl(this.measureControls[this.lang]);
          }
          control.addTo(map);
          this.lang = lang;
        });
      } else {
        // Else, load control and remove previous one
        map.removeControl(this.measureControls[this.lang]);
        this.measureControls[lang].addTo(map);
        this.lang = lang;
      }
    } else {
      if (this.measureControls[this.lang]) {
        map.removeControl(this.measureControls[this.lang]);
      }
    }
  }

  /**
   * Build legend control on map
   * Control is automated to listen to map layers changes
   *
   * @param map leaflet map
   * @param addControl flag that indicates if should add or remove the control
   */
  public getLegendControl(map: L.Map, addControl: boolean): void {
    if (addControl) {
      if (!this.legendControl) {
        // const updateControl = (instance: MapLegendComponent) => {
        //   // Add legends to the map
        //   const layerLegends: {
        //     layer: string;
        //     legend: LegendDefinition;
        //   }[] = [];
        //   layers.forEach((layer) => {
        //     // check if layer is visible
        //     if (!map.hasLayer(layer.getLayer())) return;

        //     const legend = (layer.getLayer() as any).legend;
        //     if (legend) {
        //       layerLegends.push({
        //         layer: layer.name,
        //         legend,
        //       });
        //     }
        //   });
        //   instance.layerLegends = layerLegends;
        // };
        this.legendControl = legendControl();
        // this.legendControl.onAdd = () => {
        //   const div = L.DomUtil.create('div', 'info legend');
        //   const component = this.domService.appendComponentToBody(
        //     MapLegendComponent,
        //     div
        //   );
        //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //   const instance: MapLegendComponent = component.instance;
        //   updateControl(instance);
        //   map.on('overlayadd', () => {
        //     updateControl(instance);
        //   });

        //   map.on('overlayremove', () => {
        //     updateControl(instance);
        //   });
        //   return div;
        // };
        this.legendControl.addTo(map);

        // const container = this.legendControl.getContainer();
        // if (container) {
        //   // prevent click events from propagating to the map
        //   container.addEventListener('click', (e: any) => {
        //     L.DomEvent.stopPropagation(e);
        //   });

        //   // prevent mouse wheel events from propagating to the map
        //   container.addEventListener('wheel', (e: any) => {
        //     L.DomEvent.stopPropagation(e);
        //   });
        // }
      }
    } else {
      if (this.legendControl) {
        this.legendControl.remove();
        this.legendControl = null;
      }
    }
  }

  /**
   * Add a download control on the bottom right of the map. Click propagation and scroll propagation are disabled so they do not propagate to the map when clicking or scrolling on the button
   *
   * @param map map widget
   * @param addControl flag that indicates if should add or remove the control
   */
  public getDownloadControl(map: any, addControl: boolean): any {
    if (addControl) {
      if (!this.downloadControl) {
        this.downloadControl = new L.Control({ position: 'bottomright' });
        this.downloadControl.onAdd = () => {
          const div = L.DomUtil.create('div', 'info legend');
          const component = this.domService.appendComponentToBody(
            MapDownloadComponent,
            div
          );
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const instance: MapDownloadComponent = component.instance;
          return div;
        };
        this.downloadControl.onRemove = () => {
          if (this.downloadControlClickListener) {
            this.downloadControlClickListener();
            this.downloadControlClickListener = null;
          }
          if (this.downloadControlWheelListener) {
            this.downloadControlWheelListener();
            this.downloadControlWheelListener = null;
          }
        };
        this.downloadControl.addTo(map);

        const container = this.downloadControl.getContainer();
        if (container) {
          if (this.downloadControlClickListener) {
            this.downloadControlClickListener();
          }
          // prevent click events from propagating to the map
          this.downloadControlClickListener = this.renderer.listen(
            container,
            'click',
            (e: any) => {
              L.DomEvent.stopPropagation(e);
            }
          );
          if (this.downloadControlWheelListener) {
            this.downloadControlWheelListener();
          }
          // prevent mouse wheel events from propagating to the map
          this.downloadControlWheelListener = this.renderer.listen(
            container,
            'wheel',
            (e: any) => {
              L.DomEvent.stopPropagation(e);
            }
          );
        }
      }
    } else {
      if (this.downloadControl) {
        this.downloadControl.remove();
        this.downloadControl = null;
      }
    }
  }

  /**
   * Add a zoom slider to control the zoom level of the map
   *
   * @param map map widget
   * @param maxZoom maximum zoom for the map
   * @param minZoom minimum zoom for the map
   * @param currentZoom currentZoom of the map
   * @param mapEvent listen to map events to get correct zoom
   * @returns zoomControl
   */
  public getZoomControl(
    map: L.Map,
    maxZoom: number,
    minZoom: number,
    currentZoom: number,
    mapEvent: EventEmitter<MapEvent>
  ) {
    const customZoomControl = new L.Control(<any>{
      position: 'verticalcenterright',
    });
    customZoomControl.onAdd = () => {
      const div = L.DomUtil.create('div');
      const component = this.domService.appendComponentToBody(
        MapZoomComponent,
        div
      );
      const instance: MapZoomComponent = component.instance;
      instance.maxZoom = maxZoom;
      instance.minZoom = minZoom;
      instance.currentZoom = currentZoom;
      instance.map = map;
      instance.mapEvent = mapEvent;
      L.DomEvent.addListener(div, 'mousedown', L.DomEvent.stopPropagation);
      L.DomEvent.addListener(div, 'click', L.DomEvent.stopPropagation);
      L.DomEvent.addListener(div, 'wheel', L.DomEvent.stopPropagation);
      return div;
    };
    map.addControl(customZoomControl);
    return customZoomControl;
  }

  /**
   * Adds a control for the last time the map was refreshed
   *
   * @param map Leaflet map
   * @param position position of the control
   * @returns last updated control
   */
  public getLastUpdateControl(map: any, position: L.ControlPosition) {
    const customLastUpdatedControl = new L.Control(<any>{ position });
    const modifiedAt = new Date();
    const lastUpdateText = this.translate.instant(
      'components.widget.settings.map.properties.controls.lastUpdate'
    );
    const lastUpdateError = this.translate.instant(
      'components.widget.settings.map.properties.controls.lastUpdateError'
    );
    customLastUpdatedControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-control');
      const innerIcon = createFontAwesomeIcon(
        {
          icon: 'circle-info',
          color: 'none',
          opacity: 1,
          size: 16,
        },
        this.document
      );
      const spanText = modifiedAt
        ? `${lastUpdateText} ${new Date(
            modifiedAt
          ).toLocaleDateString()} at ${new Date(
            modifiedAt
          ).toLocaleTimeString()}`
        : `${lastUpdateError}`;
      const innerSpan = `<span class="pl-1 whitespace-nowrap hidden group-hover:inline"> ${spanText} </span>`;
      const innerDiv = `<div class="flex bg-white p-1 rounded-md overflow-hidden w-6 h-6 transition-all hover:w-[250px] group">${innerIcon.innerHTML} ${innerSpan} </div>`;
      div.innerHTML = innerDiv;
      return div;
    };
    map.addControl(customLastUpdatedControl);
    return customLastUpdatedControl;
  }

  /**
   * Adds custom zoom control (different from the leaflet default one
   *
   * @param map Leaflet map
   */
  public addControlPlaceholders(map: any) {
    const corners = map._controlCorners,
      l = 'leaflet-',
      container = map._controlContainer;

    /**
     * Creates new corner for the map
     *
     * @param vSide vertical side
     * @param hSide horizontal side
     */
    function createCorner(vSide: string, hSide: string) {
      const className = l + vSide + ' ' + l + hSide;

      corners[vSide + hSide] = L.DomUtil.create('div', className, container);
    }
    createCorner('verticalcenter', 'right');
  }

  // /**
  //  * Add or remove the TimeDimension in the map
  //  * todo(gis): only for mockups
  //  *
  //  * @param {L.Map} map map where to add or remove the timeDimension feature
  //  * @param {boolean} addTimeDimension boolean to indicates if should add or remove TimeDimension control
  //  * @param {GeoJsonObject | GeoJsonObject[]} timeDimensionGeoJSON Geojson object for the time dimension
  //  */
  // public setTimeDimension(
  //   map: L.Map,
  //   addTimeDimension: boolean,
  //   timeDimensionGeoJSON: GeoJsonObject | GeoJsonObject[]
  // ): void {
  //   if (addTimeDimension) {
  //     if (!this.timeDimensionControl) {
  //       this.createTimeDimensionControl(map);
  //       const geoJSON = L.geoJson(timeDimensionGeoJSON);
  //       this.timeDimensionLayer = (L as any).timeDimension.layer
  //         .geoJson(geoJSON)
  //         .addTo(map);
  //     }
  //   } else {
  //     if (this.timeDimensionControl) {
  //       this.timeDimensionControl.remove();
  //       this.timeDimensionLayer.remove();
  //       this.timeDimensionControl = null;
  //       this.timeDimensionLayer = null;
  //     }
  //   }
  // }

  // /**
  //  * Creates the TimeDimension Control
  //  *
  //  * @param {L.Map} map map where to add or remove the timeDimension control
  //  */
  // private createTimeDimensionControl(map: L.Map): void {
  //   const timeDimension = (map as any).timeDimension;
  //   timeDimension.options = {
  //     period: 'PT1H', // todo(gis): should be part of time settings
  //     timeInterval: '2017-06-01/2017-09-01', // todo(gis): should be part of time settings
  //     currentTime: '2017-06-01', // todo(gis): should be part of time settings
  //   };

  //   const player = new (L as any).TimeDimension.Player(
  //     { transitionTime: 1000, startOver: true },
  //     timeDimension
  //   );

  //   const timeDimensionControlOptions = {
  //     player,
  //     timeDimension,
  //     position: 'bottomleft',
  //     autoPlay: false,
  //     timeSliderDragUpdate: true,
  //   };

  //   this.timeDimensionControl = new (L.Control as any).TimeDimension(
  //     timeDimensionControlOptions
  //   );

  //   if (this.timeDimensionControl) {
  //     map.addControl(this.timeDimensionControl);
  //   }
  // }
}
