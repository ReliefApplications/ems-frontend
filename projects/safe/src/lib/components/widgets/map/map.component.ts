import { Apollo } from 'apollo-angular';
import {
  Component,
  AfterViewInit,
  Input,
  OnDestroy,
  Inject,
} from '@angular/core';
import { Record } from '../../../models/record.model';
import { Subscription } from 'rxjs';
import { QueryBuilderService } from '../../../services/query-builder.service';
// Leaflet
import 'leaflet.markercluster';
declare let L: any;

const MARKER_OPTIONS = {
  color: '#0090d1',
  opacity: 0.25,
  weight: 12,
  fillColor: '#0090d1',
  fillOpacity: 1,
  radius: 6,
};

// Declares an interface that will be used in the cluster markers layers
interface IMarkersLayerValue {
  [name: string]: any;
}

/**
 * Map Widget component.
 */
@Component({
  selector: 'safe-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class SafeMapComponent implements AfterViewInit, OnDestroy {
  // === MAP ===
  public mapId: string;
  private map: any;
  private southWest = L.latLng(-89.98155760646617, -180);
  private northEast = L.latLng(89.99346179538875, 180);
  private bounds = L.latLngBounds(this.southWest, this.northEast);
  public esriApiKey: string;

  // === MARKERS ===
  private markersLayer: any;
  private markersLayerGroup: any;
  private popupMarker: any;
  private markersCategories: IMarkersLayerValue = [];
  private categoryNames: string[] = [];
  private overlays: IMarkersLayerValue = {};
  private layerControl: any;

  // === RECORDS ===
  private selectedItem: Record | null = null;
  private data: any[] = [];
  private dataQuery: any;
  private dataSubscription?: Subscription;

  private displayFields: string[] = [];

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() settings: any = null;

  // This will be substituted when the querry returns the catgory tippe
  private placeholder = 'type';

  // === QUERY UPDATE INFO ===
  public lastUpdate = '';

  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService
  ) {
    this.esriApiKey = environment.esriApiKey;
    this.mapId = this.generateUniqueId();
  }

  /*  Generation of an unique id for the map ( in case multiple widgets use map ).
   */
  private generateUniqueId(parts: number = 4): string {
    const stringArr: string[] = [];
    for (let i = 0; i < parts; i++) {
      // eslint-disable-next-line no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }

  /*  Once template is ready, build the map.
   */
  ngAfterViewInit(): void {
    // Calls the function wich draw the map.
    this.drawMap();
    // Gets the settings from the DB.
    if (this.settings.query) {
      const builtQuery = this.queryBuilder.buildQuery(this.settings);
      this.dataQuery = this.apollo.watchQuery<any>({
        query: builtQuery,
        variables: {
          first: 100,
        },
      });
      // Handles the settings data and changes the map accordingly.
      this.getData();
    }

    this.displayFields =
      this.settings.query?.fields.map((f: any) => f.name) || [];

    this.map.setMaxBounds(this.bounds);
    this.map.setZoom(this.settings.zoom);

    setTimeout(() => this.map.invalidateSize(), 100);
  }

  /*  Create the map with all useful parameters
   */
  private drawMap(): void {
    const centerLong = this.settings.centerLong
      ? Number(this.settings.centerLong)
      : 0;
    const centerLat = this.settings.centerLat
      ? Number(this.settings.centerLat)
      : 0;

    const apiKey = this.esriApiKey;
    const basemapEnum = 'OSM:Standard';

    // Creates map
    this.map = L.map(this.mapId, {
      zoomControl: false,
      minZoom: 2,
      maxZoom: 18,
    }).setView([centerLat, centerLong], this.settings.zoom || 3);

    // Adds a zoom control
    L.control
      .zoom({
        position: 'bottomleft',
      })
      .addTo(this.map);

    // TODO: see if fixable, issue is that it does not work if leaflet not put in html imports
    L.esri.Vector.vectorBasemapLayer(basemapEnum, {
      apiKey,
    }).addTo(this.map);

    // Popup at marker click
    this.markersLayerGroup = L.featureGroup().addTo(this.map);
    this.markersLayerGroup.on('click', (event: any) => {
      this.selectedItem = this.data.find(
        (x) => x.id === event.layer.options.id
      );
      this.popupMarker = L.popup({})
        .setLatLng([event.latlng.lat, event.latlng.lng])
        .setContent(this.selectedItem ? this.selectedItem.data : '')
        .addTo(this.map);
    });
    this.markersLayer = L.markerClusterGroup({}).addTo(this.markersLayerGroup);
  }

  /**
   * Loads the data, using widget parameters.
   */
  private getData(): void {
    this.map.closePopup(this.popupMarker);
    this.popupMarker = null;
    const myIcon = L.icon({
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
    });

    this.dataSubscription = this.dataQuery.valueChanges.subscribe(
      (res: any) => {
        const today = new Date();
        this.lastUpdate =
          ('0' + today.getHours()).slice(-2) +
          ':' +
          ('0' + today.getMinutes()).slice(-2);
        // Empties all variables used in map
        this.data = [];
        this.categoryNames = [];
        this.markersCategories = [];
        this.selectedItem = null;
        this.markersLayer.clearLayers();
        for (const field in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, field)) {
            res.data[field].edges.map((x: any) => {
              // Gets all markers categories
              if (!this.categoryNames.includes(x.node[this.placeholder])) {
                console.log(x.node);
                this.categoryNames.push(x.node[this.placeholder]);
              }
              this.drawMarkers(myIcon, x.node);
            });
          }
        }
        this.setMarkers();
      }
    );
  }

  /*  Draw markers on the map if the record has coordinates
   */
  private drawMarkers(icon: any, item: any): void {
    const latitude = Number(item[this.settings.latitude]);
    const longitude = Number(item[this.settings.longitude]);
    if (!isNaN(latitude) && latitude >= -90 && latitude <= 90) {
      if (!isNaN(longitude) && longitude >= -180 && longitude <= 180) {
        let data = '';
        for (const key of Object.keys(item)) {
          if (this.displayFields.includes(key)) {
            data += `<div><b>${key}:</b> ${item[key]}</div>`;
          }
        }
        const obj = { id: item.id, data };
        this.data.push(obj);
        const options = MARKER_OPTIONS;
        Object.assign(options, { id: item.id });
        const marker = L.circleMarker([latitude, longitude], options);
        if (!this.markersCategories[item[this.placeholder]]) {
          this.markersCategories[item[this.placeholder]] = [];
        }
        this.markersCategories[item[this.placeholder]].push(marker);
      }
    }
  }

  private setMarkers(): void {
    if (this.layerControl) {
      this.layerControl.remove();
    }
    this.categoryNames.map((name: string) => {
      this.overlays[name] = L.featureGroup
        .subGroup(this.markersLayer, this.markersCategories[name])
        .addTo(this.map);
    });
    if (this.categoryNames[1]) {
      this.layerControl = L.control
        .layers(null, this.overlays, { collapsed: true })
        .addTo(this.map);
    }
  }

  public ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
