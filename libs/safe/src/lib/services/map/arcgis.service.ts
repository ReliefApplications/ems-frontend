import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { get } from 'lodash';
import proj4 from 'proj4';
import * as Color from 'color';

import { ApiKeyManager } from '@esri/arcgis-rest-request';
import {
  getItemData,
  ISearchOptions,
  searchItems,
  SearchQueryBuilder,
} from '@esri/arcgis-rest-portal';
import * as EsriHeat from 'esri-leaflet-heatmap';
import * as EsriCluster from 'esri-leaflet-cluster';
import * as EsriRenderers from 'esri-leaflet-renderers';
import * as Esri from 'esri-leaflet';
import * as Vector from 'esri-leaflet-vector';
import * as Geocoding from 'esri-leaflet-geocoder';
import * as L from 'leaflet';

/**
 * Define the ArcGIS projected coordinate system (102100 is the WKID for Web Mercator)
 */
const arcgisProj =
  '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';

type TreeObject = { label: string; layer: L.Layer };

/**
 * Shared ArcGIS service map.
 */
@Injectable({
  providedIn: 'root',
})
export class ArcgisService {
  private esriApiKey!: string;
  private session!: ApiKeyManager;

  /**
   * Shared ArcGIS service map
   *
   * @param environment injected environment configuration
   * @param http Http client
   */
  constructor(
    @Inject('environment') environment: any,
    private http: HttpClient
  ) {
    this.esriApiKey = environment.esriApiKey;
    this.session = new ApiKeyManager({ key: environment.esriApiKey });
  }

  /**
   * Load webmap from ArcGIS based on its id
   *
   * @param {L.Map} map to add the webmap
   * @param {string} id webmap id
   * @returns basemaps and layers
   */
  public loadWebMap(
    map: L.Map,
    id: string
  ): Promise<{ basemaps: TreeObject[]; layers: TreeObject[] }> {
    return new Promise((resolve) => {
      getItemData(id, {
        authentication: this.session,
      }).then((webMap: any) => {
        this.setDefaultView(map, webMap);
        Promise.all([
          this.loadBaseMap(map, webMap),
          this.loadOperationalLayers(map, webMap),
        ]).then(([basemaps, layers]) => {
          resolve({ basemaps, layers });
        });
      });
    });
  }

  /**
   * Search for web map in arcgis-rest-request
   *
   * @param options parameter
   * @param options.start parameter
   * @param options.text search string
   * @param options.id current id
   * @returns searched items
   */
  public searchItems(options: { start?: number; text?: string; id?: string }) {
    const query = new SearchQueryBuilder()
      .startGroup()
      .match('Web Map')
      .in('type');
    if (options.text) {
      query.and().match(options.text).in('title');
    }
    query.endGroup();
    if (options.id) {
      query.or();
      query.startGroup().match(options.id).in('id').endGroup();
    }
    const filter: ISearchOptions = {
      q: query,
      start: options.start,
      authentication: this.session,
      // portal: arcgisUrl + '/sharing/rest',
    };
    return searchItems(filter);
  }

  /**
   * Load basemaps from the webmap
   *
   * @param {L.Map} map to add the webmap
   * @param {*} webMap webmap loaded
   */
  private async loadBaseMap(map: L.Map, webMap: any): Promise<TreeObject[]> {
    // BaseMaps
    const baseMaps: TreeObject[] = [];
    const baseMapLayers: L.Layer[] = [];
    for (const layer of webMap.baseMap.baseMapLayers) {
      const opacity = get(layer, 'opacity', 1);
      switch (layer.layerType) {
        case 'VectorTileLayer': {
          // When using the styleUrl of the given layer, the built in vectorTileLayer function duplicates the url to fetch it
          // So we will use the id in the styleUrls to fetch the vector tile layer
          // This regex matches the content for => {{url}}/items/tileLayerId/blabla/blabla
          let id = layer.styleUrl.match(/(?<=items\/).*?(?=\/)/gi);
          let esriUrlContent: any = null;
          // Get the styleUrl content to use the esriUrlContent.serviceItemId (if it exists) instead of the id
          const styleUrlContent: any = await this.httpGet(layer.styleUrl);
          if (styleUrlContent.sources.esri?.url) {
            esriUrlContent = await this.httpGet(
              styleUrlContent.sources.esri.url
            );
          }
          id = esriUrlContent
            ? esriUrlContent?.serviceItemId
            : id
            ? id
            : layer.itemId;
          const vectorTileLayer = Vector.vectorTileLayer(id, {
            token: this.esriApiKey,
            opacity,
          });
          vectorTileLayer.label = layer.title;
          baseMapLayers.push(vectorTileLayer);
          break;
        }
        case 'ArcGISTiledMapServiceLayer': {
          const tiledMapLayer = Esri.tiledMapLayer({
            pane: 'tilePane',
            url: layer.url,
            token: this.esriApiKey,
            opacity,
          });
          (tiledMapLayer as any).label = layer.title;
          baseMapLayers.push(tiledMapLayer);
          break;
        }
        // case 'ArcGISImageServiceLayer': {
        //   (Esri as any).imageMapLayer({
        //     pane: 'tilePane',
        //     url: layer.url,
        //     token: this.esriApiKey,
        //   }).addTo(map);
        //   break;
        // }
        default: {
          break;
        }
      }
    }

    // Display baseMap layer
    const baseMapLayerGroup = L.layerGroup(baseMapLayers).addTo(map);
    baseMaps.push({
      label: webMap.baseMap.title,
      layer: baseMapLayerGroup,
    });
    return baseMaps;
  }

  /**
   * Load operational layers
   *
   * @param {L.Map} map to add the webmap
   * @param {*} webMap webmap loaded
   */
  private async loadOperationalLayers(
    map: L.Map,
    webMap: any
  ): Promise<TreeObject[]> {
    const layers: TreeObject[] = [];
    for (const layer of webMap.operationalLayers) {
      await this.addLayer(map, layer, layers);
    }
    return layers;
  }

  /**
   * Add layers from the webMap operationalLayers to the map
   *
   * @param {L.Map} map to add to
   * @param {*} layer layer
   * @param {any[]} layers array to save the created layers
   * @param {boolean} [visibility=true] visibility of the layer
   */
  private async addLayer(
    map: L.Map,
    layer: any,
    layers: any[],
    visibility = true
  ) {
    const opacity = get(layer, 'opacity', 1);
    //configured maxScale and minScale
    const layerDefinitionValue = get(layer, 'layerDefinition');
    //default values for maxScaleLevel and minScaleLevel
    let maxScaleLevel: any = 18;
    let minScaleLevel: any = 0;
    //convert maxScale and minScale from arcgis to leaflet values
    const maxScale = get(layerDefinitionValue, 'maxScale');
    if (maxScale) {
      maxScaleLevel = Math.round(
        Math.log(591657550.5 / maxScale) / Math.log(2) + 1
      );
    }
    const minScale = get(layerDefinitionValue, 'minScale');
    if (minScale) {
      minScaleLevel = Math.round(
        Math.log(591657550.5 / minScale) / Math.log(2) + 1
      );
    }

    switch (layer.layerType) {
      case 'GroupLayer': {
        const children: any[] = [];
        const promises: Promise<any>[] = [];
        layer.layers.forEach((subLayer: any) => {
          promises.push(
            this.addLayer(
              map,
              subLayer,
              children,
              get(layer, 'visibility', true)
            )
          );
        });
        await Promise.all(promises);
        layers.push({ label: layer.title, children });
        break;
      }
      case 'ArcGISFeatureLayer': {
        let featureLayer: L.Layer | undefined = undefined;
        if (layer.url) {
          const reduction = get(layer, 'layerDefinition.featureReduction');
          if (reduction) {
            switch (reduction.type) {
              case 'cluster': {
                const pane = map.createPane(layer.id);
                featureLayer = EsriCluster.featureLayer({
                  url: layer.url,
                  token: this.esriApiKey,
                  // If popup is not disabled we want to show the cluster popup, no zoom to bounds
                  zoomToBoundsOnClick:
                    layer.layerDefinition.featureReduction.disablePopup,
                  // opacity,
                  // polygonOptions: {
                  //   opacity,
                  // },
                  // pane,
                  clusterPane: pane,
                  drawingInfo: layer.layerDefinition.drawingInfo,
                  minZoom: minScaleLevel,
                  maxZoom: maxScaleLevel,
                });
                pane.style.opacity = `${opacity}`;
                break;
              }
              default: {
                break;
              }
            }
          } else {
            const rendererType = get(
              layer,
              'layerDefinition.drawingInfo.renderer.type'
            );
            if (rendererType) {
              switch (rendererType) {
                case 'heatmap': {
                  const gradient: any = {};
                  const heatOptionsValue = get(
                    layer,
                    'layerDefinition.drawingInfo.renderer'
                  );
                  // todo(arcgis): some library should exist for that
                  for (let i = 0; i < heatOptionsValue.colorStops.length; i++) {
                    const colorStop = heatOptionsValue.colorStops[i];
                    // A minimum is set there, otherwise the colors are too pale
                    gradient[0.5 + colorStop.ratio / 2] = Color.rgb(
                      colorStop.color[0],
                      colorStop.color[1],
                      colorStop.color[2]
                    );
                  }
                  const pane = map.createPane(layer.id);
                  // todo(arcgis): not working with current options
                  featureLayer = EsriHeat.featureLayer({
                    url: layer.url,
                    token: this.esriApiKey,
                    gradient,
                    blur: get(heatOptionsValue, 'blurRadius', 15),
                    radius: get(heatOptionsValue, 'radius', 10),
                    maxZoom: map.getMaxZoom(),
                    max: get(heatOptionsValue, 'maxDensity', 1.0),
                    minOpacity: Math.max(
                      get(heatOptionsValue, 'minDensity', 0),
                      0.4
                    ),
                    pane,
                    ...(get(layer, 'layerDefinition.drawingInfo') && {
                      drawingInfo: layer.layerDefinition.drawingInfo,
                    }),
                  });
                  pane.style.opacity = `${opacity}`;
                  break;
                }
                case 'simple': {
                  featureLayer = Esri.featureLayer({
                    url: layer.url,
                    token: this.esriApiKey,
                    ...{ opacity },
                    ...(get(layer, 'layerDefinition.drawingInfo') && {
                      drawingInfo: layer.layerDefinition.drawingInfo,
                    }),
                  });
                  const renderer = EsriRenderers.simpleRenderer(
                    get(layer, 'layerDefinition.drawingInfo.renderer')
                  );
                  console.log(renderer._symbols);
                  break;
                }
                case 'uniqueValue': {
                  featureLayer = Esri.featureLayer({
                    url: layer.url,
                    token: this.esriApiKey,
                    ...{ opacity },
                    ...(get(layer, 'layerDefinition.drawingInfo') && {
                      drawingInfo: layer.layerDefinition.drawingInfo,
                      minZoom: minScaleLevel,
                      maxZoom: maxScaleLevel,
                      renderer: L.canvas(),
                      simplifyFactor: 10, // reduce the size of fetched geojson
                    }),
                  });
                  break;
                }
                default: {
                  break;
                }
              }
            } else {
              featureLayer = Esri.featureLayer({
                url: layer.url,
                token: this.esriApiKey,
                ...{ opacity },
                ...(get(layer, 'layerDefinition.drawingInfo') && {
                  drawingInfo: layer.layerDefinition.drawingInfo,
                  minZoom: minScaleLevel,
                  maxZoom: maxScaleLevel,
                }),
              });
            }
          }
        }
        if (featureLayer) {
          if (get(layer, 'visibility', true) && visibility) {
            featureLayer.addTo(map);
          }
          layers.push({ label: layer.title, layer: featureLayer });
        }
        break;
      }
      case 'ArcGISMapServiceLayer': {
        let featureLayer: L.Layer | undefined = undefined;
        if (layer.url) {
          featureLayer = Esri.featureLayer({
            url: layer.url + '/7',
            token: this.esriApiKey,
            ...{ opacity },
            minZoom: minScaleLevel,
            maxZoom: maxScaleLevel,
          });
        }
        if (featureLayer) {
          if (get(layer, 'visibility', true) && visibility) {
            featureLayer.addTo(map);
          }
          layers.push({ label: layer.title, layer: featureLayer });
        }
        break;
      }
      case 'ArcGISImageServiceLayer': {
        let imageMapLayer: L.Layer | undefined = undefined;
        if (layer.itemId) {
          await getItemData(layer.itemId, {
            authentication: this.session,
          }).then((item: any) => {
            if (layer.url) {
              imageMapLayer = (Esri as any).imageMapLayer({
                url: layer.url,
                token: this.esriApiKey,
                minZoom: minScaleLevel,
                maxZoom: maxScaleLevel,
                opacity,
                ...(get(item, 'renderingRule') && {
                  renderingRule: item.renderingRule,
                }),
              });
              if (imageMapLayer) {
                if (get(layer, 'visibility', true) && visibility) {
                  imageMapLayer.addTo(map);
                }
                layers.push({ label: layer.title, layer: imageMapLayer });
              }
            }
          });
        }
        break;
      }
      case 'WMS': {
        const wms = L.tileLayer.wms(layer.url, {
          layers: layer.visibleLayers,
          opacity,
          minZoom: minScaleLevel,
          maxZoom: maxScaleLevel,
        });
        if (get(layer, 'visibility', true) && visibility) {
          wms.addTo(map);
        }
        layers.push({ label: layer.title, layer: wms });
        break;
      }
      default: {
        console.log('layer not supported : ');
        console.log(layer);
        break;
      }
    }
  }

  /**
   * Set the map default view
   *
   * @param webMap arcgis webMap
   * @param map leaflet map
   */
  private setDefaultView(webMap: any, map: L.Map): void {
    // Get the xmin, xmax, ymin and ymax from arcgis coordinates
    if (get(webMap, 'initialState.viewpoint.targetGeometry')) {
      const xmin = parseFloat(
        webMap.initialState.viewpoint.targetGeometry.xmin
      );
      const xmax = parseFloat(
        webMap.initialState.viewpoint.targetGeometry.xmax
      );
      const ymin = parseFloat(
        webMap.initialState.viewpoint.targetGeometry.ymin
      );
      const ymax = parseFloat(
        webMap.initialState.viewpoint.targetGeometry.ymax
      );
      // Convert the ArcGIS coordinates to geographic coordinates
      const xminYmin = proj4(arcgisProj, 'EPSG:4326', [xmin, ymin]);
      const xmaxYmax = proj4(arcgisProj, 'EPSG:4326', [xmax, ymax]);

      const sw = L.latLng(xminYmin[1], xminYmin[0]);
      const ne = L.latLng(xmaxYmax[1], xmaxYmax[0]);
      map.fitBounds(L.latLngBounds(sw, ne));
    }
  }

  /**
   * Make a http get request using the session token.
   *
   * @param path url path
   * @returns requisition promise
   */
  private httpGet(path: string): Promise<any> {
    return this.http.get(path + `?token=${this.esriApiKey}`).toPromise();
  }

  public reverseSearch(latlng: L.LatLng) {
    return new Promise((resolve, reject) =>
      (Geocoding as any)
        .reverseGeocode({
          apikey: this.esriApiKey,
        })
        .latlng(latlng)
        .run((err: any, res: any) => {
          if (res) {
            console.log(res);
            resolve(res);
          }
          if (err) {
            reject(err);
          }
        })
    );
  }
}
