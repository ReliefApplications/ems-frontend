import { Apollo } from 'apollo-angular';
import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';

import { Record } from '../../../models/record.model';
import { Subscription } from 'rxjs';
import { QueryBuilderService } from '@services/query-builder/query-builder.service';

/** Default options for the marker */
const MARKER_OPTIONS = {
  color: '#0090d1',
  opacity: 0.25,
  weight: 12,
  fillColor: '#0090d1',
  fillOpacity: 1,
  radius: 6,
};

/** Component for the map widget */
@Component({
  selector: 'safe-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
/** Map widget using Leaflet. */
export class SafeMapComponent implements AfterViewInit, OnDestroy {
  // === MAP ===
  public mapId: string;
  private map: any;
  private southWest = L.latLng(-89.98155760646617, -180);
  private northEast = L.latLng(89.99346179538875, 180);
  private bounds = L.latLngBounds(this.southWest, this.northEast);

  // === MARKERS ===
  private markersLayer: any;
  private markersLayerGroup: any;
  private popupMarker: any;

  // === RECORDS ===
  private selectedItem: Record | null = null;
  private data: any[] = [];
  private dataQuery: any;
  private dataSubscription?: Subscription;

  private displayFields: string[] = [];

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() settings: any = null;

  // === QUERY UPDATE INFO ===
  public lastUpdate = '';

  /**
   * Constructor of the map widget component
   *
   * @param apollo Apollo client
   * @param queryBuilder The querybuilder service
   */
  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService
  ) {
    this.mapId = this.generateUniqueId();
  }

  /**
   * Generation of an unique id for the map (in case multiple widgets use map).
   *
   * @param parts Number of parts in the id (seperated by dashes "-")
   * @returns A random unique id
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

  /** Once template is ready, build the map. */
  ngAfterViewInit(): void {
    this.drawMap();
    if (this.settings.query) {
      const builtQuery = this.queryBuilder.buildQuery(this.settings);
      this.dataQuery = this.apollo.watchQuery<any>({
        query: builtQuery,
        variables: {
          first: 100,
        },
      });
      this.getData();
    }

    this.displayFields =
      this.settings.query?.fields.map((f: any) => f.name) || [];

    this.map.setMaxBounds(this.bounds);
    this.map.setZoom(this.settings.zoom);

    setTimeout(() => this.map.invalidateSize(), 100);
  }

  /** Create the map with all useful parameters */
  private drawMap(): void {
    const centerLong = this.settings.centerLong
      ? Number(this.settings.centerLong)
      : 0;
    const centerLat = this.settings.centerLat
      ? Number(this.settings.centerLat)
      : 0;

    this.map = L.map(this.mapId, { zoomControl: false }).setView(
      [centerLat, centerLong],
      this.settings.zoom || 3
    );

    L.control
      .zoom({
        position: 'bottomleft',
      })
      .addTo(this.map);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map',
      noWrap: true,
      minZoom: 1,
    }).addTo(this.map);
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

  /** Load the data, using widget parameters. */
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
        this.data = [];
        this.selectedItem = null;
        this.markersLayer.clearLayers();
        for (const field in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, field)) {
            res.data[field].edges.map((x: any) =>
              this.drawMarkers(myIcon, x.node)
            );
          }
        }
      }
    );
  }

  /**
   * Draw markers on the map if the record has coordinates.
   *
   * @param icon The icon to use for the marker
   * @param item Data to use for disaplying the marker
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
        this.markersLayer.addLayer(marker);
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
