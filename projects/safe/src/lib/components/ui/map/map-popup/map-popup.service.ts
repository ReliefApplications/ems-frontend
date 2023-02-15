import { Injectable } from '@angular/core';

/// <reference path="../../../../typings/leaflet/index.d.ts" />
import * as L from 'leaflet';
import { get } from 'lodash';
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
  /**
   * Injects DomService instance to the service
   *
   * @param domService DomService
   */
  constructor(private domService: DomService) {}
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
  public addPopupToClickEvent(map: any, featurePoints: any[]) {
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
  private setPopUpContent(map: any, featurePoints: any[], clickEvent: any) {
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
      // create div element to render the SafeMapPopupComponent content
      const div = document.createElement('div');
      // Initialize and get a SafeMapPopupComponent instance
      const instance = this.initializeSafeMapPopupComponent(matchedPoints, div);
      // create a popup that renders the SafeMapPopupComponent
      const popup = L.popup({ closeButton: false })
        .setLatLng(coordinates)
        .setContent(div);
      // listen to popup close event
      instance.closePopup.subscribe(() => {
        popup.remove();
      });
      circle.bindPopup(popup);
      popup.on('remove', () => map.removeLayer(circle));
      circle.openPopup();
    }
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
  ): SafeMapPopupComponent {
    // create component
    // render the SafeMapPopupComponent
    const groupedPopup = this.domService.appendComponentToBody(
      SafeMapPopupComponent,
      containerElement
    );
    const instance: SafeMapPopupComponent = groupedPopup.instance;

    // set the points
    instance.points = featurePoints;

    // @TODO: In order to normalize or set each template for layer type we should map the point properties
    // Or create custom template for each type of feature points data

    instance.template = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; padding: 4px">
            <p style="color: gray">ID</p>
            <p>{{id}}</p>
            <p style="color: gray">Title</p>
            <p>{{title}}</p>
            <p style="color: gray">Marker</p>
            <p>{{marker-symbol}}</p>
            <p style="color: gray">Weight</p>
            <p>{{weight}}</p>
          </div>
          <img src="{{imgSrc}}" width="100%" />
          `;
    return instance;
  }
}
