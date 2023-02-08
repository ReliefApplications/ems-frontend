import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FeatureCollection } from 'geojson';
import { isEqual } from 'lodash';
import { SafeSnackBarService } from '../../services/snackbar/snackbar.service';

// Leaflet
declare let L: any;

/** Available languages in the geoman library */
const GEOMAN_LANGUAGES = [
  'cz',
  'da',
  'de',
  'el',
  'en',
  'es',
  'fa',
  'fi',
  'fr',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'nl',
  'no',
  'pl',
  'pt_br',
  'ro',
  'ru',
  'sv',
  'tr',
  'ua',
  'zh',
  'zh_tw',
];

/**
 * Creates custom marker icon for the Leaflet map.
 *
 * @param color Color of the marker
 * @param opacity Opacity of the marker
 * @returns Custom marker icon
 */
const createCustomMarker = (color: string, opacity: number) => {
  const markerHtmlStyles = `
  background-color: ${color};
  opacity: ${opacity};
  width: 2em;
  height: 2em;
  display: block;
  left: -0.5em;
  top: -0.5em;
  position: relative;
  border-radius: 2em 2em 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;`;

  const icon = L.divIcon({
    className: 'custom-marker',
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span data-attr="${color},${opacity}" style="${markerHtmlStyles}">
      <div style="width: 0.7em; height: 0.7em; background-color: white; border-radius:100%"/>
    </span>`,
  });

  return icon;
};

/**
 * The type for the object get from the reverseGeocode and geosearch
 * operation, used to save in the GeoJSON the address info
 */
export interface ReverseGeocodeResult {
  latlng: { lat: number; lng: number };
  address: {
    City: string;
    CntryName: string;
    District: string;
    Region: string;
    ShortLabel: string; // Street Info
    [key: string]: string;
  };
}

/**
 * Component for displaying the input map
 * of the geospatial type question.
 */
@Component({
  selector: 'safe-geospatial-map',
  templateUrl: './geospatial-map.component.html',
  styleUrls: ['./geospatial-map.component.scss'],
})
export class SafeGeospatialMapComponent implements AfterViewInit {
  @Input() data: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  // Map
  public map: any;
  public mapID = `map-${Math.random().toString(36)}`;

  // Geocoding
  private esriApiKey: string;
  public geocodingResults: ReverseGeocodeResult[] = [];
  @Input() useGeocoding = true;
  @Input() geoFields: string[] = [];

  // Layer to edit
  public selectedLayer: any;

  // output
  private timeout: ReturnType<typeof setTimeout> | null = null;
  @Output() mapChange = new EventEmitter<FeatureCollection>();

  /**
   * Component for displaying the input map
   * of the geospatial type question.
   *
   * @param environment platform environment
   * @param snackbarService Shared snackbar service
   * @param translate the translation service
   */
  constructor(
    @Inject('environment') environment: any,
    private snackbarService: SafeSnackBarService,
    private translate: TranslateService
  ) {
    this.esriApiKey = environment.esriApiKey;
  }

  ngAfterViewInit(): void {
    this.drawMap();

    // set language
    const setLang = (lang: string) => {
      if (GEOMAN_LANGUAGES.includes(lang)) {
        this.map.pm.setLang(lang);
      } else {
        console.warn(`Language "${lang}" not supported by geoman`);
        this.map.pm.setLang('en');
      }
    };
    setLang(this.translate.currentLang || 'en');
    this.translate.onLangChange.subscribe((event) => {
      setLang(event.lang);
    });
  }

  /** Creates map */
  private drawMap(): void {
    // creates layer
    const layer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    // creates map, adds it to the container
    // and created layer to it
    this.map = L.map(this.mapID, {
      // fullscreenControl: true,
      center: [0, 0],
      zoom: 2,
      pmIgnore: false,
      worldCopyJump: true,
    }).addLayer(layer);

    // Add search address control
    this.getSearchbarControl().addTo(this.map);

    // init layers from question value
    if (this.data.features.length > 0) {
      const newLayer = L.geoJSON(this.data, {
        // Circles are not supported by geojson
        // We abstract them as markers with a radius property
        pointToLayer: (feature: any, latlng: any) => {
          if (feature.properties.radius) {
            return new L.Circle(latlng, feature.properties.radius);
          } else {
            if (feature.properties.geocoding) {
              // If geocoding info exists in the geojson: add it in the geocodingResults
              this.geocodingResults.push({
                latlng,
                address: feature.properties.geocoding,
              });
            }
            const color = feature.properties.color || '#3388ff';
            const opacity = feature.properties.opacity || 1;
            const icon = createCustomMarker(color, opacity);
            return new L.Marker(latlng).setIcon(icon);
          }
        },
      })
        .addTo(this.map)
        .eachLayer((l: any) => {
          if (l.setStyle) {
            l.setStyle(l.feature.options);
          }
          l.on('pm:change', this.onMapChange.bind(this));
        });

      const selectLayer = (l: any) => (this.selectedLayer = l);
      newLayer.on('click', (e: any) => {
        selectLayer(e.layer);
      });
    }

    // add geoman tools
    this.map.pm.addControls({
      position: 'topright',
      drawText: false,
      drawCircleMarker: false,
    });

    // updates question value on adding new shape
    this.map.on('pm:create', async (l: any) => {
      if (l.shape === 'Marker') {
        l.layer.setIcon(createCustomMarker('#3388ff', 1));
        if (this.useGeocoding) {
          // eslint-disable-next-line no-underscore-dangle
          await this.getAddressOnClick(l.marker._latlng);
        }
      }

      this.onMapChange();

      // subscribe to changes on the created layers
      l.layer.on('pm:change', this.onMapChange.bind(this));

      const selectLayer = (x: any) => (this.selectedLayer = x);
      l.layer.on('click', (e: any) => {
        selectLayer(e.target);
      });
    });

    // updates question value on removing shapes
    this.map.on('pm:remove', (l: any) => {
      if (l.shape === 'Marker' && this.useGeocoding) {
        // If geocoding active remove address info from the deleted marker from geocodingResults
        this.geocodingResults = this.geocodingResults.filter(
          // eslint-disable-next-line no-underscore-dangle
          (r) => !isEqual(r.latlng, l.layer._latlng)
        );
      }
      this.onMapChange.bind(this);
    });
  }

  /**
   * Gets the map features as a GeoJSON FeatureCollection.
   *
   * @returns GeoJSON FeatureCollection
   */
  private getMapFeatures(): FeatureCollection {
    return {
      type: 'FeatureCollection',
      features: this.map.pm.getGeomanLayers().map((l: any) => {
        // The false param is used to skip the processing of rounding coordinates with X precision
        // to avoid round-off errors when comparing coordinates
        const json = l.toGeoJSON(false);
        json.options = l.options;
        // Adds radius property to circles,
        // as they are not supported by geojson
        if (l instanceof L.Circle) {
          json.properties.radius = l.getRadius();
        }
        if (l instanceof L.Marker) {
          const html = l.options.icon.options.html;
          // save marker style info to geojson
          if (html) {
            const attributes = html.match(/data-attr="(.*\d)"/)[1];
            const [color, opacity] = attributes.split(',');
            json.properties = { color, opacity };
          }
          if (this.useGeocoding) {
            // If using geocoding retrieves the point address info
            // (only markers added when useGeocoding = true have address info)
            const geocodingResult = this.geocodingResults.find((result) =>
              // eslint-disable-next-line no-underscore-dangle
              isEqual(result.latlng, l._latlng)
            );
            json.properties.geocoding = geocodingResult?.address ?? {};
          }
        }
        return json;
      }),
    };
  }

  /** Emits event with new map geoJSON value */
  private onMapChange(): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.mapChange.emit(this.getMapFeatures());
    }, 500);
  }

  /**
   * Updates the selected layer with the given options.
   *
   * @param options the options to update the layer with
   */
  public updateLayer(options: any) {
    if (this.selectedLayer instanceof L.Marker) {
      const icon = createCustomMarker(options.color, options.opacity);
      this.selectedLayer.setIcon(icon);
    } else {
      this.selectedLayer.setStyle(options);
    }
    this.mapChange.emit(this.getMapFeatures());
  }

  /**
   * Get the address of a given point on the map using the API
   *
   * @param {{lat: number, lng: number}} latlng coordinates of the point
   * @param latlng.lat latitude
   * @param latlng.lng longitude
   * @returns A promise that resolves to void.
   */
  private getAddressOnClick(latlng: {
    lat: number;
    lng: number;
  }): Promise<void> {
    return new Promise((resolve) => {
      L.esri.Geocoding.reverseGeocode({
        apikey: this.esriApiKey,
      })
        .latlng(latlng)
        .run((error: any, result: any) => {
          if (error) {
            this.snackbarService.openSnackBar(
              this.translate.instant(
                'components.widget.settings.map.geospatial.geocodingError'
              ),
              { error: true }
            );
            resolve();
            return;
          }
          result.latlng.lat = latlng.lat;
          result.latlng.lng = latlng.lng;
          this.geocodingResults.push(result);
          resolve();
        });
    });
  }

  /**
   * Creates a custom searchbar control with esri geocoding
   *
   * @returns Returns the custom control
   */
  private getSearchbarControl(): any {
    const searchControl = L.esri.Geocoding.geosearch({
      position: 'topleft',
      placeholder: 'Enter an address or place e.g. 1 York St',
      useMapBounds: false,
      providers: [
        L.esri.Geocoding.arcgisOnlineProvider({
          apikey: this.esriApiKey,
          nearby: {
            lat: -33.8688,
            lng: 151.2093,
          },
        }),
      ],
    });

    searchControl.on('results', (data: any) => {
      for (let i = data.results.length - 1; i >= 0; i--) {
        const coordinates = L.latLng(data.results[i].latlng);
        const marker = L.marker(coordinates).setIcon(
          createCustomMarker('#3388ff', 1)
        );
        marker.addTo(this.map);

        const geocodingResult = {
          address: data.results[i].properties,
          latlng: coordinates,
        };
        this.geocodingResults.push(geocodingResult);
        this.onMapChange();
      }
    });

    return searchControl;
  }
}
