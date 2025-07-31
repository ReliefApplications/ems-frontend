import { Injectable, ComponentRef, Inject, Renderer2 } from '@angular/core';
import { Feature } from 'geojson';

/// <reference path="../../../../typings/leaflet/index.d.ts" />
import * as L from 'leaflet';
import { DomService } from '../../../../services/dom/dom.service';
import { MapPopupComponent } from './map-popup.component';
import { PopupInfo } from '../../../../models/layer.model';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
/**
 * Shared map control service.
 */
@Injectable()
export class MapPopupService {
  /** Map instance */
  private map!: L.Map;
  /** Popup pane of the map */
  private popupPane!: HTMLElement | undefined;

  /**
   * Set the map that loaded this popup service instance
   */
  public set setMap(_map: L.Map) {
    this.map = _map;
    this.popupPane = this.map.getPane('popupPane');
  }

  /** Is the popup outside of the world bounds? */
  private isPopupOutOfBounds = { x: false, y: false };
  /** Timeout to open popup */
  private timeoutListener!: NodeJS.Timeout;
  /** Timeout to close popup */
  private timeoutPopupCloseListener!: NodeJS.Timeout;

  /**
   * Injects DomService and TranslateService instances to the service
   *
   * @param domService DomService
   * @param renderer Angular renderer
   * @param document document
   */
  constructor(
    private domService: DomService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Set popup content for the given map and feature points
   *
   * @param featurePoints Feature points to group in the popup
   * @param coordinates Coordinates
   * @param popupInfo Popup info
   * @param metadata Metadata
   * @param layerToBind Layer where to bind the popup, if not a default one would be created
   */
  public setPopUp(
    featurePoints: Feature<any>[],
    coordinates: L.LatLng,
    popupInfo: PopupInfo,
    metadata: any[] = [],
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

      // Initialize and get a MapPopupComponent instance popup
      const { instance, popup } = this.setPopupComponentAndContent(
        featurePoints,
        coordinates,
        popupInfo,
        metadata
      );

      popup.on('remove', () => {
        if (this.timeoutListener) {
          clearTimeout(this.timeoutListener);
        }
        if (this.timeoutPopupCloseListener) {
          clearTimeout(this.timeoutPopupCloseListener);
        }
        // prevent visual bug (bottom-popup switch + content destruction)
        this.popupPane
          ?.querySelector('.leaflet-popup')
          ?.classList.add('invisible');

        if (layerToBind instanceof L.Circle) {
          this.map.removeLayer(layerToBind);
        }
        // We will bind and unbind each time we set the popup for dynamic purposes
        layerToBind?.unbindPopup();
        instance.destroy();
      });
      if (this.timeoutListener) {
        clearTimeout(this.timeoutListener);
      }
      this.timeoutListener = setTimeout(() => {
        // Reset default popup
        if (this.popupPane) {
          this.popupPane.className = 'leaflet-pane leaflet-popup-pan';
          this.isPopupOutOfBounds = { x: false, y: false };
        }

        layerToBind
          ?.bindPopup(popup, {
            autoPan: false,
          })
          .openPopup();

        // Define the popup position
        this.setPopupPosition(coordinates, popup);
      }, 0); // time listener is used to get the correct popup height
    }
  }

  /**
   * Set the popup position if it is out of the world bounds
   *
   * @param coordinates Coordinates
   * @param popup Popup Element
   */
  private setPopupPosition(coordinates: L.LatLng, popup: L.Popup) {
    const popupEl: any = popup.getElement();
    const popupHeight = popupEl?.offsetHeight + 25 + 12; // pop up height + margin + half default icon size
    const popupWidth = popupEl?.offsetWidth / 2 + 25 + 12; // half pop up width + margin + half default icon size
    const maxPixWorldBounds = this.map.getPixelWorldBounds().max as L.Point; // world bounds in pixels

    if (this.map.project(coordinates).x < popupWidth) {
      // out of the left world bound
      this.isPopupOutOfBounds.x = true;
      this.popupPane?.classList.add('right-popup');
    } else if (
      maxPixWorldBounds.x - this.map.project(coordinates).x <
      popupWidth
    ) {
      // out of the right world bound
      this.isPopupOutOfBounds.x = true;
      this.popupPane?.classList.add('left-popup');
    }

    if (this.map.project(coordinates).y < popupHeight) {
      // out of the top world bound
      this.isPopupOutOfBounds.y = true;
      this.popupPane?.classList.add('bottom-popup');
    } else if (
      this.isPopupOutOfBounds &&
      maxPixWorldBounds.y - this.map.project(coordinates).y <
        popupEl?.offsetHeight / 2
    ) {
      // out of the bottom world bound if the position has changed to left or right
      this.isPopupOutOfBounds.y = true;
      this.popupPane?.classList.add('top-popup');
    }

    // if the pop up is outside the world bounds
    if (this.isPopupOutOfBounds.x || this.isPopupOutOfBounds.y) {
      const popupCoordinates = this.map.latLngToLayerPoint(coordinates); // popup coordinates based on origin point
      // manually set the popup pane position to allow the use of global values on the transform property
      this.renderer.setStyle(this.popupPane, 'top', popupCoordinates.y + 'px');
      this.renderer.setStyle(this.popupPane, 'left', popupCoordinates.x + 'px');
    } else {
      // reset the popup pane default position
      this.renderer.setStyle(this.popupPane, 'top', '0px');
      this.renderer.setStyle(this.popupPane, 'left', '0px');
    }

    // prevent display issue when zoom change
    this.map.once('zoomstart', () => {
      this.map.closePopup();
    });

    this.autoPan(popup, popupEl);
  }

  /**
   * Replicate of the leaflet auto-pan function
   * If the popup is out of view, the map will automatically move to make it visible
   *
   * @param popup Leaflet popup
   * @param popupEl Popup Element
   */
  private autoPan(popup: L.Popup, popupEl: HTMLElement) {
    const margin = 20; // distance with map bounds
    const popupLatLng = popup.getLatLng() as L.LatLng; // popup coordinates
    const popupPoint = this.map.latLngToContainerPoint(popupLatLng); // popup coordinates in pixels relative to the map container
    const mapSize = this.map.getSize(); // map size

    let dx = 0;
    let dy = 0;

    if (!this.isPopupOutOfBounds.x) {
      if (popupPoint.x - popupEl.offsetWidth / 2 < margin) {
        // left offset
        dx = -1 * (margin + popupEl.offsetWidth / 2 - popupPoint.x);
      } else if (popupPoint.x + popupEl.offsetWidth / 2 > mapSize.x - margin) {
        // right offset
        dx = margin + popupEl.offsetWidth / 2 - (mapSize.x - popupPoint.x);
      }
    }

    if (!this.isPopupOutOfBounds.y) {
      if (popupPoint.y - popupEl.offsetHeight - 24 < margin) {
        // top offset
        dy = -1 * (margin + popupEl.offsetHeight + 24 - popupPoint.y);
      }
    }

    if (dx !== 0 || dy !== 0) {
      this.map.panBy([dx, dy]);
    }
  }

  /**
   * Initialize and sets MapPopupComponent popup component
   *
   * @param featurePoints Array of feature points
   * @param coordinates Coordinates where to set the popup
   * @param coordinates.lat Coordinates latitude
   * @param coordinates.lng Coordinates longitude
   * @param popupInfo Popup info
   * @param metadata Metadata
   * @returns Generated MapPopupComponent component instance and popup
   */
  private setPopupComponentAndContent(
    featurePoints: Feature<any>[],
    coordinates: L.LatLng,
    popupInfo: PopupInfo,
    metadata: any[] = []
  ): { instance: ComponentRef<MapPopupComponent>; popup: L.Popup } {
    // create div element to render the MapPopupComponent content
    const div = this.document.createElement('div');
    const popupComponent = this.initializeMapPopupComponent(
      coordinates,
      featurePoints,
      div,
      popupInfo,
      metadata
    );
    // create a popup that renders the MapPopupComponent
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
   * @param popupComponent  popup component
   * @param popup Leaflet popup
   */
  private setPopupComponentListeners(
    popupComponent: ComponentRef<MapPopupComponent>,
    popup: L.Popup
  ) {
    // listen to popup close event
    popupComponent.instance.closePopup
      .pipe(takeUntilDestroyed(popupComponent.instance.destroyRef))
      .subscribe(() => {
        if (this.timeoutPopupCloseListener) {
          clearTimeout(this.timeoutPopupCloseListener);
        }
        this.timeoutPopupCloseListener = setTimeout(() => {
          popup.remove();
        }, 0);
      });

    // listen to popup zoom to event
    popupComponent.instance.zoomTo
      .pipe(takeUntilDestroyed(popupComponent.instance.destroyRef))
      .subscribe((event: L.LatLng) => {
        popup.remove();
        this.map.setView(L.latLng(event), 10);
      });
  }

  /**
   * Initialize content and returns an instance of MapPopupComponent
   *
   * @param coordinates coordinates of the point to open popup from ( center of feature or point )
   * @param featurePoints featurePoints
   * @param containerElement containerElement
   * @param popupInfo Popup info
   * @param metadata Metadata
   * @returns MapPopupComponent instance
   */
  private initializeMapPopupComponent(
    coordinates: L.LatLng,
    featurePoints: any[],
    containerElement: HTMLElement,
    popupInfo: PopupInfo,
    metadata: any[] = []
  ): ComponentRef<MapPopupComponent> {
    // create component to render the MapPopupComponent
    const popupComponent = this.domService.appendComponentToBody(
      MapPopupComponent,
      containerElement
    );
    const instance: MapPopupComponent = popupComponent.instance;

    // set the component inputs
    instance.feature = featurePoints;
    instance.coordinates = coordinates;
    instance.metadata = metadata;

    // Bind zoom
    instance.currZoom = this.map.getZoom();
    this.map.on('zoomend', (zoom) => {
      instance.currZoom = zoom.target.getZoom();
    });

    // Use the first feature point as model to generate the popup template for the rest of features
    instance.template = this.generatePopupContentTemplate(popupInfo);
    return popupComponent;
  }

  /**
   * Generates de content inside the popup with the properties of the given feature
   *
   * @param popupInfo Popup info
   * @returns Popup content template
   */
  private generatePopupContentTemplate(popupInfo: PopupInfo): string {
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

    const containerStartTemplate =
      '<div class="shared-popup-content px-2 my-4">';
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
        for (const field of element.fields || []) {
          const dataField = popupInfo.fieldsInfo?.find((x) => x.name === field);
          if (!field.toLowerCase().includes('img')) {
            contentGridTemplate = `${contentGridTemplate} ${propertyNameTemplate(
              dataField?.label || field
            )} ${propertyValueTemplate(field)}`;
          } else {
            imageElement = imageTemplate(field);
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
