import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { MapConstructorSettings } from '../ui/map/interfaces/map.interface';
import { UnsubscribeComponent } from '../utils/unsubscribe/public-api';
// Leaflet
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import { createCustomDivIcon } from '../ui/map/utils/create-div-icon';
import { CommonModule } from '@angular/common';
import { MapModule } from '../ui/map/map.module';

import { MapComponent } from '../ui/map';
import { AVAILABLE_GEOMAN_LANGUAGES } from '../ui/map/const/language';
import {
  getMapFeature,
  updateGeoManLayerPosition,
} from '../ui/map/utils/get-map-features';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, takeUntil } from 'rxjs';
import { GeospatialFieldsComponent } from './geospatial-fields/geospatial-fields.component';
import { GeoProperties } from './geospatial-map.interface';
import { get } from 'lodash';
import { ArcgisService } from '../../services/map/arcgis.service';
import { FormBuilder } from '@angular/forms';

/**
 * Default geocoding value
 */
const DEFAULT_GEOCODING: GeoProperties = {
  coordinates: { lat: 0, lng: 0 },
  city: '',
  countryName: '',
  countryCode: '',
  district: '',
  region: '',
  subRegion: '',
  street: '',
  address: '',
} as const;

/**
 * Component for displaying the input map
 * of the geo spatial type question.
 */
@Component({
  standalone: true,
  selector: 'shared-geospatial-map',
  templateUrl: './geospatial-map.component.html',
  styleUrls: ['./geospatial-map.component.scss'],
  imports: [CommonModule, MapModule, GeospatialFieldsComponent],
})
export class GeospatialMapComponent
  extends UnsubscribeComponent
  implements OnInit, AfterViewInit
{
  @Input() data?: Feature | FeatureCollection;
  @Input() geometry = 'Point';
  @Input() fields: { value: keyof GeoProperties; label: string }[] = [];

  public geoForm!: ReturnType<typeof this.buildGeoForm>;

  // === MAP ===
  public mapSettings: MapConstructorSettings = {
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
      // timedimension: false,
      download: false,
      legend: false,
      measure: true,
      layer: false,
      search: true,
      lastUpdate: null,
    },
    zoomControl: true,
  };

  // Layer to edit
  public selectedLayer?: L.Layer;
  public controls: any = {
    position: 'topright',
    drawText: false,
    drawCircleMarker: false,
    drawPolyline: false,
    drawCircle: false,
    drawRectangle: false,
    drawPolygon: false,
    cutPolygon: false,
    rotateMode: false,
    editMode: false,
  };

  private disableGeomanToolsFlag = false;

  // output
  private timeout: ReturnType<typeof setTimeout> | null = null;
  @Output() mapChange = new EventEmitter<Feature | FeatureCollection>();

  @ViewChild(MapComponent) mapComponent?: MapComponent;

  /**
   * Component for displaying the input map
   * of the geospatial type question.
   *
   * @param translate Angular translate service
   * @param arcgisService ArcGIS Service
   * @param fb Angular form builder
   */
  constructor(
    private translate: TranslateService,
    private arcgisService: ArcgisService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.geoForm = this.buildGeoForm();
  }

  ngAfterViewInit(): void {
    this.mapComponent?.map.pm.addControls(this.controls);
    this.setUpPmListeners();
    this.setDataLayers();

    (['lat', 'lng'] as const).forEach((key) => {
      this.geoForm
        .get(`coordinates.${key}`)
        ?.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$))
        .subscribe(() => {
          const lat = this.geoForm.get('coordinates.lat')?.value;
          const lng = this.geoForm.get('coordinates.lng')?.value;

          if (lat && lng && this.mapComponent?.map) {
            const latlng = L.latLng(lat, lng);

            // update the marker position on the map
            updateGeoManLayerPosition(
              this.mapComponent?.map,
              { latlng },
              this.selectedLayer
            );

            // updates the geospatial fields
            this.onReverseSearch(latlng);
          }
        });
    });
  }

  /**
   * Disables/Enables all buttons from geoman tools if there is a current action on going or finished
   *
   * @param triggeredButton Button clicked by user
   * @param e event triggered from geoman tools
   */
  private disableGeomanTools(triggeredButton: string, e: any) {
    // If we are clicking on the button itself, we are starting/ending an action
    if (e.type === 'pm:buttonclick') {
      this.disableGeomanToolsFlag = !this.disableGeomanToolsFlag;
    } else {
      // If is another type of event it's always a finished action, therefor enable geoman tools
      this.disableGeomanToolsFlag = false;
    }
    const buttons = Object.keys(
      (this.mapComponent?.map.pm.Toolbar as any).buttons
    );
    buttons.forEach((button) => {
      if (
        (button !== triggeredButton && button !== 'drawMarker') ||
        (triggeredButton !== 'drawMarker' &&
          button === 'drawMarker' &&
          this.noLayerContent())
      ) {
        this.mapComponent?.map.pm.Toolbar.setButtonDisabled(
          button,
          this.disableGeomanToolsFlag
        );
      }
    });
  }

  /**
   * Check if there is no marker set in the current geospatial map
   *
   * @returns true if there is any content, false otherwise
   */
  private noLayerContent(): boolean {
    const containsPointMarker = (feature: any) =>
      feature.geometry.type === 'Point';
    const content = getMapFeature(this.mapComponent?.map);
    return !content || !containsPointMarker(content);
  }

  /** Set geoman listeners */
  private setUpPmListeners() {
    // By default all drawn layer types have this property to false except for markers and circleMarkers
    // https://github.com/geoman-io/leaflet-geoman#draw-mode
    // We will enable this one for all layer types(including Markers) in order to auto blur when one marker is set
    this.mapComponent?.map.pm.setGlobalOptions({ continueDrawing: false });
    // updates question value on adding new shape
    this.mapComponent?.map.on('pm:create', (l: any) => {
      if (this.geometry === 'Point' && l.shape === 'Marker') {
        l.layer.setIcon(
          createCustomDivIcon({
            icon: 'leaflet_default',
            color: '#3388ff',
            opacity: 1,
            size: 24,
          })
        );
        this.selectedLayer = l.layer;
        this.onReverseSearch(l.layer._latlng).then(() => {
          this.mapChange.emit({
            ...l.layer.toGeoJSON(),
            properties: this.geoForm.value,
          });
        });
        this.disableGeomanTools('drawMarker', l);
        // If we add a Marker, we will disable the control to set new markers(currently we want to add just one)
        this.mapComponent?.map.pm.Toolbar.setButtonDisabled('drawMarker', true);
      }

      // subscribe to drag changes on the created layers
      l.layer.on('pm:dragend', (l: any) => {
        if (this.geometry == 'Point' && l.shape === 'Marker') {
          this.onReverseSearch(l.layer._latlng).then(() => {
            this.mapChange.emit({
              ...l.layer.toGeoJSON(),
              properties: this.geoForm.value,
            });
          });
        }
      });

      l.layer.on('pm:change', (l: any) => {
        if (this.geometry == 'Point' && l.shape === 'Marker') {
          this.mapChange.emit({
            ...l.layer.toGeoJSON(),
            properties: this.geoForm.value,
          });
        }
      });
    });
    this.mapComponent?.map.on('pm:buttonclick', (e) => {
      this.disableGeomanTools(e.btnName, e);
    });

    this.mapComponent?.map.on('pm:actionclick', (e) => {
      this.disableGeomanTools(e.btnName, e);
    });

    // updates question value on removing shapes
    this.mapComponent?.map.on('pm:remove', () => {
      this.selectedLayer = undefined;
      // If no markers, we enable the point marker control again
      if (this.noLayerContent()) {
        this.geoForm.setValue(DEFAULT_GEOCODING);
        this.mapChange.emit();
      }
    });

    // set language
    const setLang = (lang: string) => {
      if (AVAILABLE_GEOMAN_LANGUAGES.includes(lang)) {
        this.mapComponent?.map.pm.setLang(lang as any);
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

  /**
   * Builds the form for the geospatial question.
   *
   * @param value Value to set the form to
   * @returns Form group
   */
  private buildGeoForm(value?: any) {
    return this.fb.group({
      coordinates: this.fb.group({
        lat: get<number>(
          value,
          'coordinates.lat',
          DEFAULT_GEOCODING.coordinates.lat
        ),
        lng: get<number>(
          value,
          'coordinates.lng',
          DEFAULT_GEOCODING.coordinates.lng
        ),
      }),
      city: get<string>(value, 'properties.City', DEFAULT_GEOCODING.city),
      countryName: get<string>(
        value,
        'properties.CntryName',
        DEFAULT_GEOCODING.countryName
      ),
      countryCode: get<string>(
        value,
        'properties.Country',
        DEFAULT_GEOCODING.countryCode
      ),
      district: get<string>(
        value,
        'properties.District',
        DEFAULT_GEOCODING.district
      ),
      region: get<string>(value, 'properties.Region', DEFAULT_GEOCODING.region),
      street: get<string>(value, 'properties.StName', DEFAULT_GEOCODING.street),
      subRegion: get<string>(
        value,
        'properties.Subregion',
        DEFAULT_GEOCODING.subRegion
      ),
      address: get<string>(
        value,
        'properties.StAddr',
        DEFAULT_GEOCODING.address
      ),
    });
  }

  /** Creates map */
  private setDataLayers(): void {
    //init layers from question value
    const geospatialData = this.data as any;
    if (get(geospatialData, 'geometry.coordinates', []).length > 0) {
      const latlng = L.latLng([
        geospatialData.geometry.coordinates[1],
        geospatialData.geometry.coordinates[0],
      ]);
      updateGeoManLayerPosition(this.mapComponent?.map, { latlng });
    }
  }

  /**
   * On search, transform the result into a readable one
   *
   * @param address searched address
   */
  onSearch(address: any): void {
    if (address) {
      const value = {
        coordinates: {
          lat: get(address, 'latlng.lat', DEFAULT_GEOCODING.coordinates.lat),
          lng: get(address, 'latlng.lng', DEFAULT_GEOCODING.coordinates.lng),
        },
        city: get(address, 'properties.City', DEFAULT_GEOCODING.city),
        countryName: get(
          address,
          'properties.CntryName',
          DEFAULT_GEOCODING.city
        ),
        countryCode: get(address, 'properties.Country', DEFAULT_GEOCODING.city),
        district: get(address, 'properties.District', DEFAULT_GEOCODING.city),
        region: get(address, 'properties.Region', DEFAULT_GEOCODING.city),
        street: get(address, 'properties.StName', DEFAULT_GEOCODING.city),
        subRegion: get(address, 'properties.Subregion', DEFAULT_GEOCODING.city),
        address: get(address, 'properties.StAddr', DEFAULT_GEOCODING.city),
      };
      updateGeoManLayerPosition(
        this.mapComponent?.map,
        {
          latlng: [value.coordinates.lat, value.coordinates.lng],
        },
        this.selectedLayer
      );
      this.geoForm.setValue(value, { emitEvent: false });
    }
  }

  /**
   * Handles reverse search using the arcgis service
   *
   * @param latlng the latlng to search for
   * @returns a promise
   */
  private async onReverseSearch(latlng: L.LatLng) {
    return this.arcgisService.reverseSearch(latlng).then((res) => {
      const value = {
        coordinates: {
          lat: get(res, 'latlng.lat', DEFAULT_GEOCODING.coordinates.lat),
          lng: get(res, 'latlng.lng', DEFAULT_GEOCODING.coordinates.lng),
        },
        city: get(res, 'address.City', DEFAULT_GEOCODING.city),
        countryName: get(res, 'address.CntryName', DEFAULT_GEOCODING.city),
        countryCode: get(res, 'address.CountryCode', DEFAULT_GEOCODING.city),
        district: get(res, 'address.District', DEFAULT_GEOCODING.city),
        region: get(res, 'address.Region', DEFAULT_GEOCODING.city),
        street: get(res, 'address.StName', DEFAULT_GEOCODING.city),
        subRegion: get(res, 'address.Subregion', DEFAULT_GEOCODING.city),
        address: get(res, 'address.Address', DEFAULT_GEOCODING.city),
      };
      this.geoForm.setValue(value, { emitEvent: false });
    });
  }
}

// Result of a reverse search
// AddNum: '';
// Addr_type: 'Postal';
// Address: '';
// Block: '';
// City: 'Ashland';
// CntryName: 'United States';
// CountryCode: 'USA';
// District: '';
// LongLabel: '67831, Ashland, KS, USA';
// Match_addr: '67831, Ashland, Kansas';
// MetroArea: '';
// Neighborhood: '';
// PlaceName: '67831';
// Postal: '67831';
// PostalExt: '';
// Region: 'Kansas';
// RegionAbbr: 'KS';
// Sector: '';
// ShortLabel: '67831';
// Subregion: 'Clark County';
// Territory: '';
// Type: '';

// Result of a search
// {
//   "Loc_name": "World",
//   "Status": "M",
//   "Score": 100,
//   "Match_addr": "Mont Saint-Michel",
//   "LongLabel": "Mont Saint-Michel, Normandie, FRA",
//   "ShortLabel": "Mont Saint-Michel",
//   "Addr_type": "POI",
//   "Type": "Island",
//   "PlaceName": "Mont Saint-Michel",
//   "Place_addr": "Normandie",
//   "Phone": "",
//   "URL": "",
//   "Rank": 18.5,
//   "AddBldg": "",
//   "AddNum": "",
//   "AddNumFrom": "",
//   "AddNumTo": "",
//   "AddRange": "",
//   "Side": "",
//   "StPreDir": "",
//   "StPreType": "",
//   "StName": "",
//   "StType": "",
//   "StDir": "",
//   "BldgType": "",
//   "BldgName": "",
//   "LevelType": "",
//   "LevelName": "",
//   "UnitType": "",
//   "UnitName": "",
//   "SubAddr": "",
//   "StAddr": "",
//   "Block": "",
//   "Sector": "",
//   "Nbrhd": "",
//   "District": "",
//   "City": "",
//   "MetroArea": "",
//   "Subregion": "",
//   "Region": "Normandie",
//   "RegionAbbr": "",
//   "Territory": "",
//   "Zone": "",
//   "Postal": "",
//   "PostalExt": "",
//   "Country": "FRA",
//   "CntryName": "France",
//   "LangCode": "FRE",
//   "Distance": 17229755.71198649,
//   "X": -1.511389999999949,
//   "Y": 48.63603000000006,
//   "DisplayX": -1.511389999999949,
//   "DisplayY": 48.63603000000006,
//   "Xmin": -3.011389999999949,
//   "Xmax": -0.011389999999948941,
//   "Ymin": 47.13603000000006,
//   "Ymax": 50.13603000000006,
//   "ExInfo": ""
// }
