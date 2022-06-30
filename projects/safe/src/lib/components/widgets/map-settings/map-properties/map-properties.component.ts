import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import get from 'lodash/get';

/** Available basemaps */
const BASEMAP_LAYERS: any = {
  Streets: 'ArcGIS:Streets',
  Navigation: 'ArcGIS:Navigation',
  Topographic: 'ArcGIS:Topographic',
  'Light Gray': 'ArcGIS:LightGray',
  'Dark Gray': 'ArcGIS:DarkGray',
  'Streets Relief': 'ArcGIS:StreetsRelief',
  Imagery: 'ArcGIS:Imagery',
  ChartedTerritory: 'ArcGIS:ChartedTerritory',
  ColoredPencil: 'ArcGIS:ColoredPencil',
  Nova: 'ArcGIS:Nova',
  Midcentury: 'ArcGIS:Midcentury',
  OSM: 'OSM:Standard',
  'OSM:Streets': 'OSM:Streets',
};

/** List of basemap that can be used by the widget */
const BASEMAPS: string[] = [
  'Sreets',
  'Navigation',
  'Topographic',
  'Light Gray',
  'Dark Gray',
  'Streets Relief',
  'Imagery',
  'ChartedTerritory',
  'ColoredPencil',
  'Nova',
  'Midcentury',
  'OSM',
  'OSM:Streets',
];

// Declares L to be able to use Leaflet from CDN
// Leaflet
//import 'leaflet.markercluster';
declare let L: any;

/**
 * Map Properties of Map widget.
 */
@Component({
  selector: 'safe-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss'],
})
export class MapPropertiesComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;

  private esriApiKey: string;
  private map: any;
  private formSubscription: any;

  public basemaps = BASEMAPS;

  /**
   * Injects the environment and gets the esri apikey.
   *
   * @param environment Environment file of the app, used to get the esri APIkey for basemaps
   */
  constructor(@Inject('environment') environment: any) {
    this.esriApiKey = environment.esriApiKey;
  }

  /**
   * Creates the map and setups the events that will be used to update the settings and map data.
   */
  ngOnInit(): void {
    const bounds = L.latLngBounds(L.latLng(-90, -1000), L.latLng(90, 1000));
    let lat = this.form.value.centerLat ? this.form.value.centerLat : 0;
    let lng = this.form.value.centerLong ? this.form.value.centerLong : 0;
    let zoom = this.form.value.zoom ? this.form.value.zoom : 0;
    let basemap = this.form.value.basemap;

    // Ignores the map movement when the lat/lng/zoom is changed.
    let ignoreMapMovement = false;

    // Creates the map.
    this.map = L.map('mapSettings', {
      zoomControl: false,
      maxBounds: bounds,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
    }).setView([lat, lng], zoom);

    // Sets the basemap.
    let basemapLayer = L.esri.Vector.vectorBasemapLayer(
      get(BASEMAP_LAYERS, this.form.value.basemap, BASEMAP_LAYERS.OSM),
      {
        apiKey: this.esriApiKey,
      }
    ).addTo(this.map);

    // Adds the zoom control.
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

    // Detects when there is a movement in the app and update the default view settings of the map.
    // If the movement is caused by updating directly the form fields it is ignored.
    this.map.on('moveend', () => {
      if (!ignoreMapMovement) {
        lat = this.map.getCenter().lat.toFixed(6);
        lng = this.map.getCenter().lng.toFixed(6);
        zoom = this.map.getZoom();
        this.form.patchValue({
          centerLat: lat,
          centerLong: lng,
          zoom,
        });
      } else {
        ignoreMapMovement = false;
      }
    });

    // Subscribes to the settings form, updates the map when the values change.
    this.formSubscription = this.form.valueChanges.subscribe((val: any) => {
      if (basemap !== val.basemap) {
        this.map.removeLayer(basemapLayer);
        basemap = val.basemap;
        basemapLayer = L.esri.Vector.vectorBasemapLayer(
          get(BASEMAP_LAYERS, this.form.value.basemap, BASEMAP_LAYERS.OSM),
          {
            apiKey: this.esriApiKey,
          }
        ).addTo(this.map);
      }
      if (
        zoom !== val.zoom ||
        lat !== val.centerLat ||
        lng !== val.centerLong
      ) {
        ignoreMapMovement = true;
        zoom = val.zoom;
        lat = val.centerLat ? val.centerLat : 0;
        lng = val.centerLong ? val.centerLong : 0;
        this.map.setView([lat, lng], zoom);
      }
    });
  }

  /**
   * Removes the map and the subscriptions.
   */
  ngOnDestroy(): void {
    this.map.remove();
    this.formSubscription.unsubscribe();
  }
}
