import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Apollo } from 'apollo-angular';
import { Record } from '../../../models/record.model';
import { Subscription } from 'rxjs';
import { QueryBuilderService } from '../../../services/query-builder.service';

const MARKER_OPTIONS = {
  color: '#0090d1',
  opacity: 0.25,
  weight: 12,
  fillColor: '#0090d1',
  fillOpacity: 1,
  radius: 6
};

@Component({
  selector: 'who-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
/*  Map widget using Leaflet.
*/
export class WhoMapComponent implements AfterViewInit, OnDestroy {

  // === MAP ===
  public mapId: string;
  private map: any;
  private southWest = L.latLng(-89.98155760646617, -180);
  private northEast = L.latLng(89.99346179538875, 180);
  private bounds = L.latLngBounds(this.southWest, this.northEast);

  // === MARKERS ===
  private markersLayer;
  private markersLayerGroup;
  private popupMarker;

  // === RECORDS ===
  private selectedItem: Record;
  private data: any[];
  private dataQuery: any;
  private dataSubscription: Subscription;

  // === WIDGET CONFIGURATION ===
  @Input() settings: any = null;

  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService
  ) {
    this.mapId = this.generateUniqueId();
  }

  /*  Generation of an unique id for the map ( in case multiple widgets use map ).
  */
  private generateUniqueId(parts: number = 4): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // tslint:disable-next-line:no-bitwise
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

    this.drawMap();

    this.dataQuery = this.queryBuilder.buildQuery(this.settings);

    if (this.dataQuery) {
      this.getData();
    }

    this.map.setMaxBounds(this.bounds);
    this.map.setZoom(this.settings.zoom);

    setTimeout(() => this.map.invalidateSize(), 100);
  }

  /*  Create the map with all useful parameters
  */
  private drawMap(): void {
    const centerLong = this.settings.centerLong ? Number(this.settings.centerLong) : 0;
    const centerLat = this.settings.centerLat ? Number(this.settings.centerLat) : 0;

    this.map = L.map(this.mapId, { zoomControl: false }).setView([centerLat, centerLong], this.settings.zoom || 3);

    L.control.zoom({
      position: 'bottomleft'
    }).addTo(this.map);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map',
      noWrap: true,
      minZoom: 1,
    }).addTo(this.map);

    this.markersLayerGroup = L.featureGroup().addTo(this.map);
    this.markersLayerGroup.on('click', event => {
      this.selectedItem = this.data.find(x => x.id === event.layer.options.id);
      this.popupMarker = L.popup({})
        .setLatLng([event.latlng.lat, event.latlng.lng])
        .setContent(JSON.stringify(this.selectedItem))
        .addTo(this.map);

    });

    this.markersLayer = L.markerClusterGroup({
    }).addTo(this.markersLayerGroup);
  }

  /*  Load the data, using widget parameters.
  */
  private getData(): void {
    this.map.closePopup(this.popupMarker);
    this.popupMarker = null;
    const myIcon = L.icon({
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
    });

    this.dataSubscription = this.dataQuery.valueChanges.subscribe(res => {
      this.data = [];
      this.selectedItem = null;
      this.markersLayer.clearLayers();
      for (const field in res.data) {
        if (Object.prototype.hasOwnProperty.call(res.data, field)) {
          res.data[field].map(x => this.drawMarkers(myIcon, x));
        }
      }
    });
  }

  /*  Draw markers on the map if the record has coordinates
  */
  private drawMarkers(icon: any, item: any): void {
    const latitude = Number(item[this.settings.latitude]);
    const longitude = Number(item[this.settings.longitude]);
    if (!isNaN(latitude) && latitude >= -90 && latitude <= 90) {
      if (!isNaN(longitude) && longitude >= -180 && longitude <= 180) {
        this.data.push(item);
        const options = MARKER_OPTIONS;
        Object.assign(options, { id: item.id });
        const marker = L.circleMarker(
          [
            latitude,
            longitude
          ],
          options);
        this.markersLayer.addLayer(marker);
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.dataSubscription) { this.dataSubscription.unsubscribe(); }
  }
}
