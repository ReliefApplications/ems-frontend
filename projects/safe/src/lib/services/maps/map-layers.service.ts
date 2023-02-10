import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { get } from 'lodash';

// Declares L to be able to use Leaflet from CDN
declare let L: any;

@Injectable({
  providedIn: 'root',
})
export class SafeMapLayersService {
  constructor() {}

  /**
   * Creates custom marker icon for the Leaflet map.
   *
   * @param color Color of the marker
   * @param opacity Opacity of the marker
   * @returns Custom marker icon
   */
  public createCustomMarker(color: string, opacity: number) {
    const markerHtmlStyles = `
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
   justify-content: center;`;

    const icon = L.divIcon({
      className: 'custom-marker',
      iconAnchor: [0, 24],
      labelAnchor: [-6, 0],
      popupAnchor: [0, -36],
      html: `<span data-attr="${color},${opacity}" style="${markerHtmlStyles}">
       <div style="width: 0.7em; height: 0.7em; background-color: white; border-radius:100%"/>
     </span>`,
    });

    return icon;
  }

  public applyOptionsToLayer(map: any, layer: any, options: any, icon?: any) {
    if (layer.children) {
      this.applyOptionsToLayer(map, layer.children, options);
    } else {
      const layers = get(layer, '_layers', [layer]);
      for (const layerKey in layers) {
        if (layers[layerKey]) {
          if (icon && layers[layerKey] instanceof L.Marker) {
            layers[layerKey].setIcon(icon);
          } else {
            layers[layerKey].setStyle(options);
          }
          map.removeLayer(layers[layerKey]);
          if (
            (layers[layerKey].options.visible ||
              layers[layerKey] instanceof L.Marker) &&
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
          const html = l.options.icon.options.html;
          // save marker style info to geojson
          if (html) {
            const attributes = html.match(/data-attr="(.*\d)"/)[1];
            const [color, opacity] = attributes.split(',');
            json.properties = { color, opacity };
          }
        }
        return json;
      }),
    };
  }
}
