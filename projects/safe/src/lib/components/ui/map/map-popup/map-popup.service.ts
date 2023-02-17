import { Injectable, ComponentRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Feature } from 'geojson';

/// <reference path="../../../../typings/leaflet/index.d.ts" />
import * as L from 'leaflet';
import { takeUntil } from 'rxjs';
import { DomService } from '../../../../services/dom/dom.service';
import { SafeMapPopupComponent } from './map-popup.component';

/**
 * Shared map control service.
 */
@Injectable()
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

  // There would be an instance of map popup service for each map
  private map!: L.Map;
  /**
   * Set the map that loaded this popup service instance
   */
  public set setMap(_map: L.Map) {
    this.map = _map;
  }

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
   * Set popup content for the given map and feature points
   *
   * @param featurePoints Feature points to group in the popup
   * @param coordinates Coordinates
   * @param coordinates.lat Coordinates latitude
   * @param coordinates.lng Coordinates longitude
   * @param layerToBind Layer where to bind the popup, if not a default one would be created
   */
  public setPopUp(
    featurePoints: Feature<any>[],
    coordinates: { lat: number; lng: number },
    layerToBind?: L.Layer
  ) {
    if (featurePoints.length > 0) {
      const zoom = this.map.getZoom();
      const radius = 1000 / zoom;

      if (!layerToBind) {
        // create a circle around the point (for debugging)
        const circle = L.circle(coordinates, {
          radius: radius * 1000, // haversineDistance returns km, circle radius is in meters
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
        });
        circle.addTo(this.map);
        layerToBind = circle;
      }

      // Initialize and get a SafeMapPopupComponent instance popup
      const { instance, popup } = this.setPopupComponentAndContent(
        featurePoints,
        coordinates
      );

      popup.on('remove', () => {
        if (layerToBind instanceof L.Circle) {
          this.map.removeLayer(layerToBind);
        }
        // We will bind and unbind each time we set the popup for dynamic purposes
        layerToBind?.unbindPopup();
        instance.destroy();
      });
      layerToBind.bindPopup(popup);
      layerToBind.openPopup();
    }
  }

  /**
   * Initialize and sets SafeMapPopupComponent popup component
   *
   * @param featurePoints Array of feature points
   * @param coordinates Coordinates where to set the popup
   * @param coordinates.lat Coordinates latitude
   * @param coordinates.lng Coordinates longitude
   * @returns Generated SafeMapPopupComponent component instance and popup
   */
  private setPopupComponentAndContent(
    featurePoints: Feature<any>[],
    coordinates: { lat: number; lng: number }
  ): { instance: ComponentRef<SafeMapPopupComponent>; popup: L.Popup } {
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
    this.setPopupComponentListeners(popupComponent, popup);
    return { instance: popupComponent, popup };
  }

  /**
   * Set event listeners for the given popup component at the given map and leaflet popup
   *
   * @param popupComponent Safe popup component
   * @param popup Leaflet popup
   */
  private setPopupComponentListeners(
    popupComponent: ComponentRef<SafeMapPopupComponent>,
    popup: L.Popup
  ) {
    // listen to popup close event
    popupComponent.instance.closePopup
      .pipe(takeUntil(popupComponent.instance.destroy$))
      .subscribe(() => {
        popup.remove();
      });

    // listen to popup zoom to event
    popupComponent.instance.zoomTo
      .pipe(takeUntil(popupComponent.instance.destroy$))
      .subscribe((event: { coordinates: number[] }) => {
        popup.remove();
        this.map.setView(
          L.latLng(event.coordinates[1], event.coordinates[0]),
          10
        );
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
