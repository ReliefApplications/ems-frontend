import { Injectable, Injector, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  catchError,
  filter,
  first,
  forkJoin,
  lastValueFrom,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { LayerFormData } from '../../components/ui/map/interfaces/layer-settings.type';
import { Layer, EMPTY_FEATURE_COLLECTION } from '../../components/ui/map/layer';
import {
  AddLayerMutationResponse,
  DeleteLayerMutationResponse,
  EditLayerMutationResponse,
  LayerDatasource,
  LayerModel,
  LayerQueryResponse,
  LayersQueryResponse,
} from '../../models/layer.model';
import { RestService } from '../rest/rest.service';
import { QueryBuilderService } from '../query-builder/query-builder.service';
import { AggregationBuilderService } from '../aggregation-builder/aggregation-builder.service';
import { Aggregation } from '../../models/aggregation.model';
import { Layout } from '../../models/layout.model';
import { ADD_LAYER, EDIT_LAYER, DELETE_LAYER } from './graphql/mutations';
import { GET_LAYERS, GET_LAYER_BY_ID } from './graphql/queries';
import { HttpParams } from '@angular/common/http';
import { omitBy, isNil, get } from 'lodash';
import { ContextService } from '../context/context.service';
import { DOCUMENT } from '@angular/common';
import { MapPolygonsService } from './map-polygons.service';
import { MapConstructorSettings } from '../../components/ui/map/interfaces/map.interface';
import * as L from 'leaflet';

/**
 * Shared map layer service
 */
@Injectable({
  providedIn: 'root',
})
export class MapLayersService {
  /**
   * Shared map layer service
   *
   * @param apollo Apollo client instance
   * @param restService RestService
   * @param queryBuilder Query builder service
   * @param aggregationBuilder Aggregation builder service
   * @param contextService Application context service
   * @param mapPolygonsService Shared map polygons service
   * @param document document
   */
  constructor(
    private apollo: Apollo,
    private restService: RestService,
    private queryBuilder: QueryBuilderService,
    private aggregationBuilder: AggregationBuilderService,
    private contextService: ContextService,
    private mapPolygonsService: MapPolygonsService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Save a new layer in the DB
   *
   * @param layer Layer to add
   * @returns An observable with the new layer data formatted for the application form
   */
  public addLayer(layer: LayerFormData): Observable<LayerModel | undefined> {
    const newLayer = { ...layer };
    delete newLayer.id;
    if (newLayer.datasource) {
      delete newLayer.datasource.origin;
    }
    return this.apollo
      .mutate<AddLayerMutationResponse>({
        mutation: ADD_LAYER,
        variables: {
          layer: newLayer,
        },
      })
      .pipe(
        filter((response) => !!response.data),
        map((response) => {
          if (response.errors) {
            throw new Error(response.errors[0].message);
          }
          return response.data?.addLayer;
        })
      );
  }

  /**
   * Edit a layer in the DB
   *
   * @param layer Layer data to save
   * @returns An observable with the edited layer data formatted for the application form
   */
  public editLayer(layer: LayerFormData): Observable<LayerModel | undefined> {
    const newLayer = { ...layer };
    delete newLayer.id;
    if (newLayer.datasource) {
      delete newLayer.datasource.origin;
    }
    return this.apollo
      .mutate<EditLayerMutationResponse>({
        mutation: EDIT_LAYER,
        variables: {
          id: layer.id,
          layer: newLayer,
        },
      })
      .pipe(
        filter((response) => !!response.data),
        map((response) => {
          if (response.errors) {
            throw new Error(response.errors[0].message);
          }
          return response.data?.editLayer;
        })
      );
  }

  /**
   * Deletes the layer in the database with the given id
   *
   * @param layerId Layer id
   * @returns Observable
   */
  public deleteLayer(layerId: string) {
    return this.apollo.mutate<DeleteLayerMutationResponse>({
      mutation: DELETE_LAYER,
      variables: {
        id: layerId,
      },
    });
  }

  /**
   * Get the layer for the given id
   *
   * @param layerId Layer id
   * @returns Observable of layer
   */
  public getLayerById(layerId: string): Observable<LayerModel> {
    return this.apollo
      .query<LayerQueryResponse>({
        query: GET_LAYER_BY_ID,
        variables: {
          id: layerId,
        },
      })
      .pipe(
        filter((response) => !!response.data),
        map((response) => {
          if (response.errors) {
            throw new Error(response.errors[0].message);
          }
          return response.data.layer;
        })
      );
  }

  /**
   * Get the layers
   *
   * @returns Observable of layer
   */
  public getLayers(): Observable<LayerModel[]> {
    return this.apollo
      .query<LayersQueryResponse>({
        query: GET_LAYERS,
        variables: {
          sortField: 'name',
        },
      })
      .pipe(
        filter((response) => !!response.data),
        map((response) => {
          if (response.errors) {
            throw new Error(response.errors[0].message);
          }
          return response.data.layers;
        })
      );
  }

  /**
   * Set fields from query or use default value
   *
   * @param layout A layout to get the query
   * @returns query fields
   */
  public getQueryFields(layout: Layout | null) {
    return get(layout, 'query.fields', []);
  }

  /**
   * Get fields from aggregation
   *
   * @param queryName query name to get the fields
   * @param aggregation A aggregation
   * @returns aggregation fields
   */
  public getAggregationFields(
    queryName: string,
    aggregation: Aggregation | null
  ) {
    //@TODO this part should be refactored
    // Get fields
    const fields = this.getAvailableSeriesFields(queryName);
    const selectedFields = aggregation?.sourceFields
      .map((x: string) => {
        const field = fields.find((y) => x === y.name);
        if (!field) return null;
        if (field.type.kind !== 'SCALAR') {
          Object.assign(field, {
            fields: this.queryBuilder
              .getFieldsFromType(
                field.type.kind === 'OBJECT'
                  ? field.type.name
                  : field.type.ofType.name
              )
              .filter((y) => y.type.name !== 'ID' && y.type.kind === 'SCALAR'),
          });
        }
        return field;
      })
      // @TODO To be improved - Get only the JSON type fields for this case
      .filter((x: any) => x !== null);
    return this.aggregationBuilder
      .fieldsAfter(selectedFields, aggregation?.pipeline)
      .map((field) => ({
        name: field.name,
        label: field.name,
        type: field.type.name,
      }));
  }

  // @TODO Copied method from tab-main.component, this one should be refactored in the needed places
  // eslint-disable-next-line jsdoc/require-returns
  /**
   * Set available series fields, from resource fields and aggregation definition.
   *
   * @param queryName query name to get the fields
   */
  private getAvailableSeriesFields(queryName: string): any[] {
    return this.queryBuilder
      .getFields(queryName as string)
      .filter(
        (field: any) =>
          !(
            field.name.includes('_id') &&
            (field.type.name === 'ID' ||
              (field.type.kind === 'LIST' && field.type.ofType.name === 'ID'))
          )
      );
  }

  /**
   * Format given settings for Layer class
   * todo(gis): extended model is useless
   *
   * @param layerIds layer settings saved from the layer editor
   * @param injector Injector containing all needed providers for layer class
   * @returns Observable of LayerSettingsI
   */
  async createLayersFromIds(
    layerIds: string[],
    injector: Injector
  ): Promise<Layer[]> {
    const promises: Promise<Layer>[] = [];
    for (const id of layerIds) {
      promises.push(
        lastValueFrom(
          this.getLayerById(id).pipe(
            mergeMap((layer: LayerModel) => {
              if (this.isDatasourceValid(layer.datasource)) {
                // Get the current layer + its geojson
                return forkJoin({
                  layer: of(layer),
                  geojson: this.getLayerGeoJson(layer),
                });
              } else {
                return of({
                  layer,
                  geojson: EMPTY_FEATURE_COLLECTION,
                });
              }
            }),
            map(
              (layer: { layer: LayerModel; geojson: any }) =>
                new Layer(
                  { ...layer.layer, geojson: layer.geojson },
                  injector,
                  this.document
                )
            )
          )
        )
      );
    }
    return Promise.all(promises);
    // return {
    //   name: '',
    //   type: 'group',
    //   children: layers,
    // };
  }

  /**
   * Format given settings for Layer class
   *
   * @param layerIds layer settings saved from the layer editor
   * @param injector Injector containing all needed providers for layer class
   * @param mapSettings map settings
   * @param leafletMap leaflet map
   * @returns Observable of LayerSettingsI
   */
  async createLayersFromId(
    layerIds: string,
    injector: Injector,
    mapSettings?: MapConstructorSettings,
    leafletMap?: L.Map
  ): Promise<Layer> {
    const promise: Promise<Layer> = lastValueFrom(
      this.getLayerById(layerIds).pipe(
        mergeMap((layer: LayerModel) => {
          if (this.isDatasourceValid(layer.datasource)) {
            // Get the current layer + its geojson
            return forkJoin({
              layer: of(layer),
              geojson: this.getLayerGeoJson(layer, mapSettings, leafletMap),
            });
          } else {
            return of({
              layer,
              geojson: EMPTY_FEATURE_COLLECTION,
            });
          }
        }),
        map(
          (layer: { layer: LayerModel; geojson: any }) =>
            new Layer(
              { ...layer.layer, geojson: layer.geojson },
              injector,
              this.document
            )
        )
      )
    );

    return promise;
  }

  /**
   * Create layer from its definition
   *
   * @param layer Layer to get definition of.
   * @param injector Injector containing all needed providers for layer class
   * @returns Layer for map widget
   */
  async createLayerFromDefinition(layer: LayerModel, injector: Injector) {
    if (this.isDatasourceValid(layer.datasource)) {
      const res = await lastValueFrom(
        forkJoin({
          layer: of(layer),
          geojson: this.getLayerGeoJson(layer),
        })
      );
      return new Layer(
        {
          ...res.layer,
          geojson: res.geojson,
        },
        injector,
        this.document
      );
    } else {
      return new Layer(layer, injector, this.document);
    }
  }

  /**
   * Get layer geojson from definition
   *
   * @param layer layer model
   * @param mapSettings map settings
   * @param leafletMap leaflet map
   * @returns Layer GeoJSON query
   */
  async getLayerGeoJson(
    layer: LayerModel,
    mapSettings?: MapConstructorSettings,
    leafletMap?: L.Map
  ) {
    const contextFilters = layer.contextFilters
      ? this.contextService.injectContext(JSON.parse(layer.contextFilters))
      : {};
    const at = layer.at
      ? this.contextService.atArgumentValue(layer.at)
      : undefined;
    const params = new HttpParams({
      fromObject: omitBy(
        {
          ...layer.datasource,
          contextFilters: JSON.stringify(contextFilters),
          ...(at && {
            at: at.toString(),
          }),
        },
        isNil
      ),
    });
    // Method to get layer from definition
    // Query is sent to the back-end to fetch correct data
    const getLayer = () => {
      return lastValueFrom(
        this.restService
          .get(`${this.restService.apiUrl}/gis/feature`, { params })
          .pipe(
            map((value) => {
              // When using adminField mapping, update the feature so geometry is replaced with according polygons
              if (layer.datasource?.adminField) {
                const geojson = this.mapPolygonsService.assignPolygons(
                  value,
                  layer.datasource.adminField as any
                );
                if (mapSettings && leafletMap) {
                  const geographicExtentValue = isNil(
                    mapSettings?.geographicExtent
                  )
                    ? false
                    : this.getGeographicExtent(
                        mapSettings?.geographicExtent as string,
                        mapSettings
                      );
                  if (geographicExtentValue) {
                    this.zoomOnCountry(geojson, mapSettings, leafletMap);
                  }
                }
                return geojson;
              } else {
                // Else, directly returns the feature layer
                return value;
              }
            }),
            // On error, returns a default geojson
            catchError(() => of(EMPTY_FEATURE_COLLECTION))
          )
      );
    };
    // When using adminField, first make sure the polygons are fetched
    if (layer.datasource?.adminField) {
      return lastValueFrom(
        this.mapPolygonsService.admin0sReady$.pipe(
          first((v) => v),
          switchMap(() => getLayer())
        )
      );
    } else {
      return getLayer();
    }
  }

  /**
   * Check if the datasource is valid
   *
   * @param value datasource
   * @returns true if the datasource is valid
   */
  private isDatasourceValid = (value: LayerDatasource | undefined) => {
    if (value) {
      if (value.refData) {
        if (value.geoField || (value.latitudeField && value.longitudeField)) {
          return true;
        } else {
          return false;
        }
      } else if (value.resource) {
        // If datasource origin is a resource, then geofield OR lat & lng is needed
        if (
          (value.layout || value.aggregation) &&
          (value.geoField || (value.latitudeField && value.longitudeField))
        ) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Fit bounds & zoom on country
   *
   * @param geojson polygon geometry
   * @param mapSettings map settings
   * @param map leaflet map
   */
  private zoomOnCountry(
    geojson: any,
    mapSettings: MapConstructorSettings,
    map: L.Map
  ): void {
    // Only admin0 is available so far
    if (mapSettings.geographicExtentField === 'admin0') {
      const feature = L.geoJson(geojson);
      map.flyToBounds(feature.getBounds());
    }
  }

  /**
   * Get the geographic extent value depending on the dashboard filter or dashboard context
   *
   * @param geographicExtent geographic extent
   * @param mapSettings map settings
   * @returns geographic extent value
   */
  private getGeographicExtent(
    geographicExtent: string,
    mapSettings: MapConstructorSettings
  ): string | boolean {
    const fieldValue = geographicExtent.match(this.contextService.filterRegex);
    if (fieldValue) {
      // If geographic extent is in the format {{filter., try to replace it by dashboard filter value, if any
      const replacedFilter = this.contextService.replaceFilter(mapSettings);
      return replacedFilter.replaced
        ? replacedFilter.object.geographicExtent
        : false;
    }
    const contextValue = geographicExtent.match(
      this.contextService.contextRegex
    );
    // If geographic extent is in the format {{context., context dashboard is not set
    if (contextValue) {
      return false;
    }
    // As the dashboard context value is automatically replaced on dashboard init, return the value directly
    return geographicExtent;
  }
}
