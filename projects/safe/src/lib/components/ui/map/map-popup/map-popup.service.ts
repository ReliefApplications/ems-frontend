import { Injectable, ComponentRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Feature } from 'geojson';

/// <reference path="../../../../typings/leaflet/index.d.ts" />
import * as L from 'leaflet';
import { get } from 'lodash';
import { takeUntil } from 'rxjs';
import { DomService } from '../../../../services/dom/dom.service';
import { haversineDistance } from '../utils/haversine';
import { SafeMapPopupComponent } from './map-popup.component';

/**
 * Shared map control service.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeMapPopupService {
  private latitudeTag = this.translateService.instant(
    'models.widget.map.latitude'
  );
  private longitudeTag = this.translateService.instant(
    'models.widget.map.longitude'
  );
  private locationTag = this.translateService.instant(
    'components.widget.settings.map.popup.location'
  );
  /**
   * Injects DomService and TranslateService instances to the service
   *
   * @param domService DomService
   * @param translateService TranslateService
   */
  constructor(
    private domService: DomService,
    private translateService: TranslateService
  ) {}
  /**
   * Set popup event and content for click event in cluster groups
   *
   * @param map Map in where we want to open the popup
   * @param clusterGroup Cluster that groups the feature points for the popup
   */
  public addPopupToClusterClickEvent(map: any, clusterGroup: any) {
    clusterGroup.on('clusterclick', (event: any) => {
      const children = event.layer
        .getAllChildMarkers()
        .map((child: any) => child.feature);
      this.setPopUpContent(map, children, event);
    });
  }

  /**
   * Set popup event and content for click event in heat maps
   *
   * @param map Map in where we want to open the popup
   * @param featurePoints Feature points to group in the popupF
   */
  public addPopupToClickEvent(map: any, featurePoints: Feature<any>[]) {
    // Leaflet.heat doesn't support click events, so we have to do it ourselves
    map.on('click', (event: any) => {
      // there is a problem here, the radius should be different
      // depending on the latitude, because of the distortion of the Mercator projection
      // I couldn't get it to work, so I just used a fixed radius, based on the zoom level alone
      // https://en.wikipedia.org/wiki/Mercator_projection#Scale_factor
      // const mercatorScaleFactor = (latitude: number) => {
      //   const lat = (Math.PI / 180) * latitude;
      //   return (
      //     Math.cos(lat) /
      //     Math.sqrt(1 - Math.pow(Math.sin(lat), 2) * Math.pow(Math.E, 2))
      //   );
      // };

      // checks if the point is within the calculate radius

      this.setPopUpContent(map, featurePoints, event);
    });
  }

  /**
   * Set popup content for the given map and feature points
   *
   * @param map Map in where we want to open the popup
   * @param featurePoints Feature points to group in the popup
   * @param clickEvent Click event in the given map
   */
  private setPopUpContent(
    map: any,
    featurePoints: Feature<any>[],
    clickEvent: any
  ) {
    const coordinates = clickEvent.latlng;
    const zoom = map.getZoom();
    const radius = 1000 / zoom;
    const matchedPoints = featurePoints.filter((point) => {
      // Filter check for current mocked implementation of grouped points popup for heatmap
      // We only want to filter the points from heat map for now
      if (clickEvent.type === 'clusterclick') {
        return true;
      } else {
        const pointData = [
          point.geometry.coordinates[1],
          point.geometry.coordinates[0],
          get(point, 'properties.weight', 1),
        ];
        const distance = haversineDistance(
          coordinates.lat,
          coordinates.lng,
          pointData[0],
          pointData[1]
        );
        return distance < radius;
      }
    });

    if (matchedPoints.length > 0) {
      // create a circle around the point (for debugging)
      const circle = L.circle(coordinates, {
        radius: radius * 1000, // haversineDistance returns km, circle radius is in meters
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
      });
      circle.addTo(map);

      // Initialize and get a SafeMapPopupComponent instance popup
      const popup = this.setPopupComponentAndContent(
        map,
        matchedPoints,
        coordinates
      );

      circle.bindPopup(popup);
      popup.on('remove', () => map.removeLayer(circle));
      circle.openPopup();
    }
  }

  /**
   * Initialize and sets SafeMapPopupComponent popup component
   *
   * @param map Map where to execute setView with given coordinates when zoom event is emitted from popup
   * @param featurePoints Array of feature points
   * @param coordinates Coordinates where to set the popup
   * @param coordinates.lat Coordinates latitude
   * @param coordinates.lng Coordinates longitude
   * @returns {L.Popup} Generated SafeMapPopupComponent popup
   */
  public setPopupComponentAndContent(
    map: L.Map,
    featurePoints: Feature<any>[],
    coordinates: { lat: number; lng: number }
  ): L.Popup {
    // create div element to render the SafeMapPopupComponent content
    const div = document.createElement('div');
    div.setAttribute('class', 'safe-border-radius-inherit');

    const popupComponent = this.initializeSafeMapPopupComponent(
      featurePoints,
      div
    );
    // create a popup that renders the SafeMapPopupComponent
    const popup = L.popup({ closeButton: false })
      .setLatLng(coordinates)
      .setContent(div);
    // Set the event listeners for the popup component
    this.setPopupComponentListeners(map, popupComponent, popup);
    return popup;
  }

  /**
   * Set event listeners for the given popup component at the given map and leaflet popup
   *
   * @param map Leaflet map
   * @param popupComponent Safe popup component
   * @param popup Leaflet popup
   */
  private setPopupComponentListeners(
    map: L.Map,
    popupComponent: ComponentRef<SafeMapPopupComponent>,
    popup: L.Popup
  ) {
    // listen to popup close event
    popupComponent.instance.closePopup
      .pipe(takeUntil(popupComponent.instance.destroy$))
      .subscribe(() => {
        setTimeout(() => {
          popupComponent.destroy();
          popup.remove();
        }, 0);
      });

    // listen to popup zoom to event
    popupComponent.instance.zoomTo
      .pipe(takeUntil(popupComponent.instance.destroy$))
      .subscribe((event: { coordinates: number[] }) => {
        setTimeout(() => {
          popupComponent.destroy();
          popup.remove();
        }, 0);
        map.setView(L.latLng(event.coordinates[1], event.coordinates[0]), 10);
      });
  }
  /**
   * Initialize content and returns an instance of SafeMapPopupComponent
   *
   * @param featurePoints featurePoints
   * @param containerElement containerElement
   * @returns SafeMapPopupComponent instance
   */
  public initializeSafeMapPopupComponent(
    featurePoints: any[],
    containerElement: HTMLElement
  ): ComponentRef<SafeMapPopupComponent> {
    // create component to render the SafeMapPopupComponent
    const popupComponent = this.domService.appendComponentToBody(
      SafeMapPopupComponent,
      containerElement
    );
    const instance: SafeMapPopupComponent = popupComponent.instance;

    // set the points
    instance.points = featurePoints;

    //Use the first feature point as model to generate the popup template for the rest of features
    instance.template = this.generatePopupContentTemplate(featurePoints[0]);
    return popupComponent;
  }

  /**
   * Generates de content inside the popup with the properties of the given feature
   *
   * @param {Feature<any>} feature feature containing properties and coordinates
   * @returns Popup content template
   */
  public generatePopupContentTemplate(feature: Feature<any>): string {
    // Templates use for the property name and the property value to be displayed
    const propertyNameTemplate = (propertyName: string) =>
      `<p class="m-0 capitalize text-gray-400">${propertyName}</p>`;
    const propertyValueTemplate = (property: any) =>
      `<p class="m-0">{{${property}}}</p>`;
    // Template for the image
    const imageTemplate = (img: string) =>
      `<img src="{{${img}}}" class="flex-1" />`;

    const containerStartTemplate = '<div class="safe-popup-content">';
    const containerEndTemplate = '</div>';
    let contentGridTemplate = '';
    let imageElement = '';

    // Extract all the properties and set the name and value binding for the feature points of the popup with the given feature example in this method
    for (const property in feature.properties) {
      if (property) {
        if (!property.toLowerCase().includes('img')) {
          contentGridTemplate = `${contentGridTemplate} ${propertyNameTemplate(
            property
          )} ${propertyValueTemplate(property)}`;
        } else {
          imageElement = imageTemplate(property);
        }
      }
    }

    // Create the template extract for the feature coordinates using their index as a suffix
    const templateCoord = `
    ${propertyNameTemplate(this.latitudeTag)}
    ${propertyValueTemplate('coordinates1')}
    ${propertyNameTemplate(this.longitudeTag)}
    ${propertyValueTemplate('coordinates0')}
    ${propertyNameTemplate(this.locationTag)}
    <p class="m-0">({{coordinates1}}, {{coordinates0}})</p>
    `;

    contentGridTemplate = `${contentGridTemplate}${templateCoord}`;
    return `${containerStartTemplate}${contentGridTemplate}${containerEndTemplate}${imageElement}`;
  }
}
