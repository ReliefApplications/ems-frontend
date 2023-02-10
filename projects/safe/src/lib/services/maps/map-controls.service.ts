import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AVAILABLE_MEASURE_LANGUAGES } from '../../components/ui/map/const/languages';
import { MARKER_OPTIONS } from '../../components/ui/map/const/marker-options';

// Declares L to be able to use Leaflet from CDN
declare let L: any;

/**
 * Shared map control service.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeMapControlsService {
  public addressMarker: any;
  public measureControls: any = {};
  public fullscreenControl?: L.Control;
  public lang!: any;
  // === THEME ===
  private primaryColor = '';

  /**
   * Shared map control service
   *
   * @param environment environment
   * @param translate Angular translate service
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService
  ) {
    this.lang = this.translate.currentLang;
    this.primaryColor = environment.theme.primary;
  }

  /**
   * Creates a custom searchbar control with esri geocoding
   *
   * @param map current map
   * @param apikey arcgis api key
   */
  public getSearchbarControl(map: any, apikey: string): void {
    const searchControl = L.esri.Geocoding.geosearch({
      position: 'topleft',
      placeholder: 'Enter an address or place e.g. 1 York St',
      useMapBounds: false,
      providers: [
        L.esri.Geocoding.arcgisOnlineProvider({
          apikey,
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
        console.log(coordinates);
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
  public getFullScreenControl(map: any): void {
    if (this.fullscreenControl) {
      map.removeControl(this.fullscreenControl);
    }
    this.fullscreenControl = new L.Control.Fullscreen({
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
  public getMeasureControl(map: any): any {
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
        const control = new L.Control.Measure({
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
}
