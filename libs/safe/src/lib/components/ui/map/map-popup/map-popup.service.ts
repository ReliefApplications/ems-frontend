import { Injectable, ComponentRef } from '@angular/core';
import { Feature } from 'geojson';

/// <reference path="../../../../typings/leaflet/index.d.ts" />
import * as L from 'leaflet';
import { takeUntil } from 'rxjs';
import { DomService } from '../../../../services/dom/dom.service';
import { SafeMapPopupComponent } from './map-popup.component';
import { PopupInfo } from '../../../../models/layer.model';

/**
 * Shared map control service.
 */
@Injectable()
export class SafeMapPopupService {
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
   */
  constructor(private domService: DomService) {}

  /**
   * Set popup content for the given map and feature points
   *
   * @param featurePoints Feature points to group in the popup
   * @param coordinates Coordinates
   * @param popupInfo Popup info
   * @param layerToBind Layer where to bind the popup, if not a default one would be created
   */
  public setPopUp(
    featurePoints: Feature<any>[],
    coordinates: L.LatLng,
    popupInfo: PopupInfo,
    layerToBind?: L.Layer
  ) {
    if (
      featurePoints.length > 0 &&
      popupInfo.popupElements &&
      popupInfo.popupElements.length > 0
    ) {
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
        coordinates,
        popupInfo
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
   * @param popupInfo Popup info
   * @returns Generated SafeMapPopupComponent component instance and popup
   */
  private setPopupComponentAndContent(
    featurePoints: Feature<any>[],
    coordinates: L.LatLng,
    popupInfo: PopupInfo
  ): { instance: ComponentRef<SafeMapPopupComponent>; popup: L.Popup } {
    // create div element to render the SafeMapPopupComponent content
    const div = document.createElement('div');
    div.setAttribute('class', 'safe-border-radius-inherit');

    const popupComponent = this.initializeSafeMapPopupComponent(
      coordinates,
      featurePoints,
      div,
      popupInfo
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
      .subscribe((event: L.LatLng) => {
        popup.remove();
        this.map.setView(L.latLng(event), 10);
      });
  }

  /**
   * Initialize content and returns an instance of SafeMapPopupComponent
   *
   * @param coordinates coordinates of the point to open popup from ( center of feature or point )
   * @param featurePoints featurePoints
   * @param containerElement containerElement
   * @param popupInfo Popup info
   * @returns SafeMapPopupComponent instance
   */
  public initializeSafeMapPopupComponent(
    coordinates: L.LatLng,
    featurePoints: any[],
    containerElement: HTMLElement,
    popupInfo: PopupInfo
  ): ComponentRef<SafeMapPopupComponent> {
    // create component to render the SafeMapPopupComponent
    const popupComponent = this.domService.appendComponentToBody(
      SafeMapPopupComponent,
      containerElement
    );
    const instance: SafeMapPopupComponent = popupComponent.instance;

    // set the component inputs
    instance.feature = featurePoints;
    instance.coordinates = coordinates;

    // Bind zoom
    instance.currZoom = this.map.getZoom();
    this.map.on('zoomend', (zoom) => {
      instance.currZoom = zoom.target.getZoom();
    });

    // Use the first feature point as model to generate the popup template for the rest of features
    instance.template = this.generatePopupContentTemplate(
      featurePoints[0],
      popupInfo
    );
    return popupComponent;
  }

  /**
   * Generates de content inside the popup with the properties of the given feature
   *
   * @param {Feature<any>} feature feature containing properties and coordinates
   * @param popupInfo Popup info
   * @returns Popup content template
   */
  public generatePopupContentTemplate(
    feature: Feature<any>,
    popupInfo: PopupInfo
  ): string {
    const title = (title: string, popupTitle?: boolean) =>
      popupTitle
        ? `<h3 class="break-words !m-0 font-bold text-xl">${title}</h3>`
        : `<h3 class="break-words !m-0 font-medium">${title}</h3>`;
    const description = (description: string, popupTitle?: boolean) =>
      popupTitle
        ? `<p class="break-words !m-0 text-gray-600 font-light text-sm">${description}</p>`
        : `<p class="break-words !m-0 mb-2 text-gray-600 font-light">${description}</p>`;

    // Templates use for the property name and the property value to be displayed
    const propertyNameTemplate = (propertyName: string) =>
      `<p class="break-words !m-0 capitalize text-gray-400">${propertyName}</p>`;
    const propertyValueTemplate = (property: any) =>
      `<p class="!m-0 break-words">{{${property}}}</p>`;
    // Template for the image
    const imageTemplate = (img: string) =>
      `<img src="{{${img}}}" class="flex-1" />`;

    const containerStartTemplate = '<div class="safe-popup-content px-2 my-4">';
    const containerEndTemplate = '</div>';

    let template =
      popupInfo.description || popupInfo.description
        ? `<div class="w-full flex flex-col px-2 py-1" >${
            popupInfo.title && title(popupInfo.title, true)
          }${
            popupInfo.description && description(popupInfo.description, true)
          }</div>`
        : '';

    // We have a template per popup element
    popupInfo.popupElements?.forEach((element) => {
      if (element.type === 'fields') {
        let imageElement = '';
        let contentGridTemplate = '';
        // Extract properties and check that fields were selected in the popup info
        for (const property in feature.properties) {
          if (property && element.fields?.includes(property)) {
            const field = popupInfo.fieldsInfo?.find(
              (field) => field.name === property
            );
            if (!property.toLowerCase().includes('img')) {
              if (field) {
                contentGridTemplate = `${contentGridTemplate} ${propertyNameTemplate(
                  field?.label || property
                )} ${propertyValueTemplate(property)}`;
              }
            } else {
              imageElement = imageTemplate(property);
            }
          }
        }
        template =
          template +
          '<div class="m-2 rounded-md border-gray-200 border shadow-md py-2 px-1">';

        const elementHeader = `<div class="w-full flex flex-col ml-2" >${
          element.title && title(element.title)
        }${element.description && description(element.description)}</div>`;

        template += `${elementHeader}${containerStartTemplate}${contentGridTemplate}${containerEndTemplate}${imageElement}</div>`;
      } else if (element.type === 'text') {
        if (element.text) {
          const scriptRegex = /<script>(.*?)<\/script>/g;
          // remove all script tags
          const sanitizedHtml = element.text?.replace(scriptRegex, '') ?? '';
          template =
            template +
            `<div class="m-2 break-all rounded-md border-gray-200 border shadow-md px-1">${sanitizedHtml}</div>`;
        }
      }
    });

    return template;
  }
}
