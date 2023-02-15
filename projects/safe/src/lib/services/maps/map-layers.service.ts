import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { get } from 'lodash';
import { generateIconHTML } from '../../components/ui/map/utils/generateIcon';
import { FA_ICONS } from '../../components/ui/map/const/fa-icons';

import * as L from 'leaflet';

/**
 * Creates a new custom leaflet marker
 *
 * @param color Color set in the marker
 * @param opacity Opacity set in the marker(0>opacity<1)
 * @param size Font size in the marker(px)
 * @returns HTML template where to place the new marker
 */
const markerHtmlStyles = (color: string, opacity: number, size: number) => {
  const styles = `
  background-color: ${color};
  opacity: ${opacity};
  width: 2em;
  height: 2em;
  display: block;
  left: -0.5em;
  top: -0.5em;
  position: relative;
  border-radius: 2em 2em 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${size}px`;

  return `<span data-attr="${color},${opacity}" style="${styles}">
  <div style="width: 0.7em; height: 0.7em; background-color: white; border-radius:100%"/>
  </span>`;
};

/**
 * Shared map layer service
 */
@Injectable({
  providedIn: 'root',
})
export class SafeMapLayersService {
  /**
   * Create a custom div icon with the given icon or with custom
   *
   * @param iconProperties Properties related to the icon
   * @param iconProperties.size Size for the icon element
   * @param iconProperties.icon Icon identifier
   * @param iconProperties.color Color for the icon element
   * @param customMakerStylesProperties Properties related to the custom marker styles properties
   * @param customMakerStylesProperties.color Color for the custom marker
   * @param customMakerStylesProperties.opacity Opacity for the custom marker
   * @param htmlTemplate Html template for the div container
   * @param className Class name for the icon div container
   * @returns Div element with the icon
   */
  public createCustomDivIcon(
    iconProperties?: {
      size: number;
      icon: (typeof FA_ICONS)[number] | 'leaflet_default';
      color: string;
    },
    customMakerStylesProperties?: {
      color: string;
      opacity: number;
    },
    htmlTemplate: any = '',
    className: string = 'custom-marker'
  ) {
    const size = iconProperties?.size || 24;

    // If we receive an icon we use that to create the div template
    if (iconProperties) {
      // fa-icons use the generateIconHtml
      if (iconProperties.icon !== 'leaflet_default') {
        const { icon, color } = iconProperties;
        const htmlIcon = generateIconHTML({ size, color, icon });
        if (!htmlTemplate) {
          htmlTemplate = htmlIcon;
        } else if (htmlTemplate) {
          htmlTemplate = htmlTemplate + htmlIcon.outerHTML;
        }
      } else {
        // The default icon(leaflet-default) uses the markerHtmlStyles
        // size set for marker is half that the one for the icon to keep same visibility
        htmlTemplate = markerHtmlStyles(iconProperties.color, 1, size / 2);
      }
    }

    /**
     * If we receive custom marker styling properties we use them
     * to create the div template
     */
    if (customMakerStylesProperties) {
      const { color, opacity } = customMakerStylesProperties;
      // size set for marker is half that the one for the icon to keep same visibility
      htmlTemplate = markerHtmlStyles(color, opacity, size / 2);
    }

    const divIcon = L.divIcon({
      className,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [size / 2, -36],
      html: htmlTemplate,
    });

    return divIcon;
  }

  /**
   * Apply options to a layer
   *
   * @param map current map
   * @param layer layer to edit
   * @param options options to apply
   * @param icon custom icon
   */
  public applyOptionsToLayer(map: any, layer: any, options: any, icon?: any) {
    if (layer.children) {
      this.applyOptionsToLayer(map, layer.children, options);
    } else {
      const layers = get(layer, '_layers', [layer]);
      for (const layerKey in layers) {
        if (layers[layerKey]) {
          if (layers[layerKey] instanceof L.Marker) {
            if (icon) {
              layers[layerKey].setIcon(icon);
            }
            // Marker does not have setStyle built in function, so we merge properties manually
            layers[layerKey].options.opacity = options.opacity;
            layers[layerKey].options.visible = options.visible;
            layers[layerKey].options.defaultVisibility =
              options.defaultVisibility;
          } else {
            layers[layerKey].setStyle(options);
          }
          map.removeLayer(layers[layerKey]);
          if (
            layers[layerKey].options.visible &&
            !(
              layers[layerKey].options.visibilityRange &&
              (map.getZoom() > options.visibilityRange[1] ||
                map.getZoom() < options.visibilityRange[0])
            )
          ) {
            map.addLayer(layers[layerKey]);
          }
        }
      }
    }
  }

  /**
   * Gets the map features as a GeoJSON FeatureCollection.
   *
   * @param map current map
   * @returns GeoJSON FeatureCollection
   */
  public getMapFeatures(map: any): FeatureCollection {
    return {
      type: 'FeatureCollection',
      features: map.pm.getGeomanLayers().map((l: any) => {
        const json = l.toGeoJSON();
        json.options = l.options;
        // Adds radius property to circles,
        // as they are not supported by geojson
        if (l instanceof L.Circle) {
          json.properties.radius = l.getRadius();
        }
        if (l instanceof L.Marker) {
          const html =
            l.options.icon?.options && 'html' in l.options.icon?.options
              ? l.options.icon?.options.html
              : undefined;
          // save marker style info to geojson
          if (html) {
            const innerHtml = typeof html === 'string' ? html : html.innerHTML;
            const matches = innerHtml.match(/data-attr="(.*\d)"/);
            if (matches && matches.length > 1) {
              const attributes = matches[1];
              const [color, opacity] = attributes.split(',');
              json.properties = { color, opacity };
            }
          }
        }
        return json;
      }),
    };
  }
}
