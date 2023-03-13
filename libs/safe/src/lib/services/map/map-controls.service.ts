import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MARKER_OPTIONS } from '../../components/ui/map/const/marker-options';
import { MapDownloadComponent } from '../../components/ui/map/map-download/map-download.component';
import { MapLegendComponent } from '../../components/ui/map/map-legend/map-legend.component';
import { DomService } from '../dom/dom.service';
import { GeoJsonObject } from 'geojson';

/// <reference path="../../../../typings/leaflet/index.d.ts" />
import * as L from 'leaflet';
import 'esri-leaflet';
import 'leaflet-fullscreen';
import 'leaflet-measure';
import 'leaflet-timedimension';
import * as Geocoding from 'esri-leaflet-geocoder';
import { LegendDefinition } from '../../components/ui/map/interfaces/layer-legend.type';
import { Layer } from '../../components/ui/map/layer';
import { AVAILABLE_MEASURE_LANGUAGES } from '../../components/ui/map/const/language';

/**
 * Shared map control service.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeMapControlsService {
  public addressMarker: any;
  public measureControls: any = {};
  public fullscreenControl!: L.Control;
  public lang!: any;
  // === THEME ===
  private primaryColor = '';
  // === Time Dimension ===
  private timeDimensionLayer!: any | null;
  private timeDimensionControl!: L.Control | null;

  /**
   * Shared map control service
   *
   * @param environment environment
   * @param translate Angular translate service
   * @param domService Shared dom service
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService,
    private domService: DomService
  ) {
    this.lang = this.translate.currentLang;
    this.primaryColor = environment.theme.primary;
  }

  /**
   * Creates a custom searchbar control with esri geocoding
   *
   * @param map current map
   * @param apiKey arcgis api key
   */
  public getSearchbarControl(map: L.Map, apiKey: string): void {
    const searchControl = Geocoding.geosearch({
      position: 'topleft',
      placeholder: 'Enter an address or place e.g. 1 York St',
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

    searchControl.on('results', (data: any) => {
      // results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
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
    });
    searchControl.addTo(map);
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
   */
  public getMeasureControl(map: L.Map): void {
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
  }

  /**
   * Build legend control on map
   * Control is automated to listen to map layers changes
   *
   * @param map leaflet map
   * @param layers layers
   */
  public getLegendControl(map: L.Map, layers: Layer[]): void {
    const updateControl = (instance: MapLegendComponent) => {
      // Add legends to the map
      const layerLegends: {
        layer: string;
        legend: LegendDefinition;
      }[] = [];
      layers.forEach((layer) => {
        // check if layer is visible
        if (!map.hasLayer(layer.getLayer())) return;

        const legend = layer.getLegend();
        if (legend) {
          layerLegends.push({
            layer: layer.name,
            legend,
          });
        }
      });
      instance.layerLegends = layerLegends;
    };
    const control = new L.Control({ position: 'bottomright' });
    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const component = this.domService.appendComponentToBody(
        MapLegendComponent,
        div
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const instance: MapLegendComponent = component.instance;
      updateControl(instance);
      map.on('overlayadd', () => {
        updateControl(instance);
      });

      map.on('overlayremove', () => {
        updateControl(instance);
      });
      return div;
    };
    control.addTo(map);

    const container = control.getContainer();
    if (container) {
      // prevent click events from propagating to the map
      container.addEventListener('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
      });

      // prevent mouse wheel events from propagating to the map
      container.addEventListener('wheel', (e: any) => {
        L.DomEvent.stopPropagation(e);
      });
    }
  }

  /**
   * Add a download control on the bottom right of the map. Click propagation and scroll propagation are disabled so they do not propagate to the map when clicking or scrolling on the button
   *
   * @param map map widget
   */
  public getDownloadControl(map: any): any {
    const control = new L.Control({ position: 'bottomright' });
    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const component = this.domService.appendComponentToBody(
        MapDownloadComponent,
        div
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const instance: MapDownloadComponent = component.instance;
      return div;
    };
    control.addTo(map);

    const container = control.getContainer();
    if (container) {
      // prevent click events from propagating to the map
      container.addEventListener('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
      });

      // prevent mouse wheel events from propagating to the map
      container.addEventListener('wheel', (e: any) => {
        L.DomEvent.stopPropagation(e);
      });
    }
  }

  /**
   * Add or remove the TimeDimension in the map
   * todo(gis): only for mockups
   *
   * @param {L.Map} map map where to add or remove the timeDimension feature
   * @param {boolean} addTimeDimension boolean to indicates if should add or remove TimeDimension control
   * @param {GeoJsonObject | GeoJsonObject[]} timeDimensionGeoJSON Geojson object for the time dimension
   */
  public setTimeDimension(
    map: L.Map,
    addTimeDimension: boolean,
    timeDimensionGeoJSON: GeoJsonObject | GeoJsonObject[]
  ): void {
    if (addTimeDimension) {
      if (!this.timeDimensionControl) {
        this.createTimeDimensionControl(map);
      }
      const geoJSON = L.geoJson(timeDimensionGeoJSON);
      this.timeDimensionLayer = (L as any).timeDimension.layer
        .geoJson(geoJSON)
        .addTo(map);
    } else {
      if (this.timeDimensionControl) {
        this.timeDimensionControl.remove();
        this.timeDimensionLayer.remove();
        this.timeDimensionControl = null;
        this.timeDimensionLayer = null;
      }
    }
  }

  /**
   * Creates the TimeDimension Control
   *
   * @param {L.Map} map map where to add or remove the timeDimension control
   */
  private createTimeDimensionControl(map: L.Map): void {
    const timeDimension = (map as any).timeDimension;
    timeDimension.options = {
      period: 'PT1H', // todo(gis): should be part of time settings
      timeInterval: '2017-06-01/2017-09-01', // todo(gis): should be part of time settings
      currentTime: '2017-06-01', // todo(gis): should be part of time settings
    };

    const player = new (L as any).TimeDimension.Player(
      { transitionTime: 1000, startOver: true },
      timeDimension
    );

    const timeDimensionControlOptions = {
      player,
      timeDimension,
      position: 'bottomleft',
      autoPlay: false,
      timeSliderDragUpdate: true,
    };

    this.timeDimensionControl = new (L.Control as any).TimeDimension(
      timeDimensionControlOptions
    );

    if (this.timeDimensionControl) {
      map.addControl(this.timeDimensionControl);
    }
  }
}
