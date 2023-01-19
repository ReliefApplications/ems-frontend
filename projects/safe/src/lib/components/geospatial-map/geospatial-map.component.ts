import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FeatureCollection } from 'geojson';

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

  // output
  private timeout: NodeJS.Timeout | null = null;
  @Output() mapChange = new EventEmitter<FeatureCollection>();

  /**
   * Component for displaying the input map
   * of the geospatial type question.
   *
   * @param translate the translation service
   */
  constructor(private translate: TranslateService) {}

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
      center: [0, 0],
      zoom: 2,
      pmIgnore: false,
      worldCopyJump: true,
    }).addLayer(layer);

    // init layers from question value
    if (this.data.features.length > 0) {
      L.geoJSON(this.data, {
        // Circles are not supported by geojson
        // We abstract them as markers with a radius property
        pointToLayer: (feature: any, latlng: any) => {
          if (feature.properties.radius) {
            return new L.Circle(latlng, feature.properties.radius);
          } else {
            return new L.Marker(latlng);
          }
        },
      })
        .addTo(this.map)
        .eachLayer((l: any) => {
          l.on('pm:change', this.onMapChange.bind(this));
        });
    }

    // add geoman tools
    this.map.pm.addControls({
      position: 'topright',
      drawText: false,
      drawCircleMarker: false,
    });

    // updates question value on adding new shape
    this.map.on('pm:create', (l: any) => {
      this.onMapChange();

      // subscribe to changes on the created layers
      l.layer.on('pm:change', this.onMapChange.bind(this));
    });

    // updates question value on removing shapes
    this.map.on('pm:remove', this.onMapChange.bind(this));
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
        const json = l.toGeoJSON();
        // Adds radius property to circles,
        // as they are not supported by geojson
        if (l instanceof L.Circle) {
          json.properties.radius = l.getRadius();
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
}
