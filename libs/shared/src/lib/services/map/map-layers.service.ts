import { Injectable, Injector, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  catchError,
  filter,
  first,
  forkJoin,
  from,
  lastValueFrom,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  GeometryType,
  LayerFormData,
} from '../../components/ui/map/interfaces/layer-settings.type';
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
import { omitBy, isNil, get, omit, isEmpty } from 'lodash';
import { ContextService } from '../context/context.service';
import { DOCUMENT } from '@angular/common';
import { MapPolygonsService } from './map-polygons.service';
import { WidgetService } from '../widget/widget.service';
import { ReferenceData } from '../../models/reference-data.model';
import getReferenceDataAggregationFields from '../../utils/reference-data/aggregation-fields.util';
import { authType } from '../../models/api-configuration.model';
import { ReferenceDataService } from '../reference-data/reference-data.service';
import { AggregationService } from '../aggregation/aggregation.service';
import { Feature } from '@turf/helpers';
import filterReferenceData from '../../utils/filter/reference-data-filter.util';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

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
   * @param widgetService Shared widget service
   * @param referenceDataService Shared reference data service
   * @param aggregationService Shared aggregation service
   * @param document document
   */
  constructor(
    private apollo: Apollo,
    private restService: RestService,
    private queryBuilder: QueryBuilderService,
    private aggregationBuilder: AggregationBuilderService,
    private contextService: ContextService,
    private mapPolygonsService: MapPolygonsService,
    private widgetService: WidgetService,
    private referenceDataService: ReferenceDataService,
    private aggregationService: AggregationService,
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
   * @param ids id array
   * @returns Observable of layer
   */
  public getLayers(ids: string[]): Observable<LayerModel[]> {
    return this.apollo
      .query<LayersQueryResponse>({
        query: GET_LAYERS,
        variables: {
          sortField: 'name',
          filter: {
            logic: 'and',
            filters: [
              {
                field: 'ids',
                operator: 'eq',
                value: ids,
              },
            ],
          },
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
   * Get reference data aggregation fields
   *
   * @param referenceData Reference data
   * @param aggregation Current aggregation
   * @returns list of aggregation fields
   */
  public getReferenceDataAggregationFields(
    referenceData: ReferenceData,
    aggregation: Aggregation | null
  ) {
    const fields = getReferenceDataAggregationFields(
      referenceData,
      this.queryBuilder
    );
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

  /**
   * Get fields from aggregation
   *
   * @param queryName query name to get the fields
   * @param aggregation Current aggregation
   * @returns list of aggregation fields
   */
  public getResourceAggregationFields(
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
   * @returns Observable of LayerSettingsI
   */
  async createLayersFromId(
    layerIds: string,
    injector: Injector
  ): Promise<Layer> {
    const promise: Promise<Layer> = lastValueFrom(
      this.getLayerById(layerIds).pipe(
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
      const data = await lastValueFrom(
        forkJoin({
          layer: of(layer),
          geojson: this.getLayerGeoJson(layer),
        })
      );
      return new Layer(
        {
          ...data.layer,
          geojson: data.geojson,
        },
        injector,
        this.document
      );
    } else {
      return new Layer(layer, injector, this.document);
    }
  }

  /**
   * Check geoJSON feature, if it's MultiLine or MultiPolygon, parse it
   * into array of single features
   *
   * @param feature Feature to parse
   * @returns array of features
   */
  private parseToSingleFeature = (feature: Feature) => {
    const features: Feature[] = [];
    if (feature.geometry.type === 'MultiPoint') {
      for (const coordinates of feature.geometry.coordinates) {
        features.push({
          ...omit(feature, 'geometry'),
          geometry: {
            type: 'Point',
            coordinates: typeof coordinates !== 'number' ? coordinates : [],
          },
        });
      }
    } else if (feature.geometry.type === 'MultiPolygon') {
      features.push(feature);
    } else {
      // No other types are supported for now
      // features.push(feature);
    }
    return features;
  };

  /**
   * Get feature from item and add it to collection
   *
   * @param features collection of features
   * @param layerType layer type
   * @param item item to get feature from
   * @param mapping fields mapping, to build geoJson from
   * @param mapping.geoField geo field to extract geojson
   * @param mapping.latitudeField latitude field ( not used if geoField )
   * @param mapping.longitudeField longitude field ( not used if geoField )
   * @param mapping.adminField admin field ( mapping with polygons coming from common services )
   */
  private getFeatureFromItem = (
    features: any[],
    layerType: GeometryType,
    item: any,
    mapping: {
      geoField?: string;
      latitudeField?: string;
      longitudeField?: string;
      adminField?: string;
    }
  ) => {
    if (mapping.geoField) {
      // removed the toLowerCase there, which may cause an issue
      const geo = get(item, mapping.geoField);
      if (geo) {
        if (mapping.adminField) {
          const feature = {
            geometry: geo,
            properties: { ...omit(item, mapping.geoField) },
          };
          features.push(feature);
        } else {
          const feature = {
            ...(typeof geo === 'string' ? JSON.parse(geo) : geo),
            properties: { ...omit(item, mapping.geoField) },
          };
          // Only push if feature is of the same type as layer
          // Get from feature, as geo can be stored as string for some models ( ref data )
          const geoType = get(feature, 'geometry.type');
          if (feature.type === 'Feature' && geoType === layerType) {
            features.push(feature);
          } else if (
            feature.type === 'Feature' &&
            `Multi${layerType}` === geoType
          ) {
            features.push(...this.parseToSingleFeature(feature));
          }
        }
      }
    } else {
      // Lowercase is needed as quick solution for solving ref data layers
      const latitude = get(item, mapping.latitudeField || '');
      const longitude = get(item, mapping.longitudeField || '');
      if (latitude && longitude) {
        const geo = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
          },
        };
        const feature = {
          ...geo,
          properties: { ...item },
        };
        features.push(feature);
      }
    }
  };

  /**
   * Get features
   *
   * @param features list of geo features
   * @param layerType type of layer
   * @param items list of items
   * @param mapping mapping
   */
  private getFeatures = (
    features: any[],
    layerType: GeometryType,
    items: any[],
    mapping: any
  ) => {
    items.forEach((item) => {
      try {
        this.getFeatureFromItem(features, layerType, item, mapping);
      } catch (e) {
        console.error(e);
      }
    });
  };

  /**
   * When using adminField mapping, update the feature so geometry is replaced with according polygons
   *
   * @param featureCollection feature collection to modify
   * @param featureCollection.type type of features
   * @param featureCollection.features list of features
   * @param layer layer to get polygons for
   * @returns modified feature collection
   */
  private applyPolygons = (
    featureCollection: { type: string; features: any[] },
    layer: LayerModel
  ) => {
    if (layer.datasource?.adminField) {
      return this.mapPolygonsService.assignGeometry(
        featureCollection,
        layer.datasource.adminField,
        layer.datasource.type
      );
    } else {
      // Else, directly returns the feature layer
      return featureCollection;
    }
  };

  /**
   * Method to get layer from definition
   * Query is sent to the back-end to fetch correct data
   *
   * @param params parameters as a json
   * @param params.layer layer to get data from
   * @param params.contextFilters Context filters
   * @returns features for the layer
   */
  private getLayer = (params: {
    layer: LayerModel;
    contextFilters?: CompositeFilterDescriptor;
  }) => {
    if (!params.contextFilters) {
      return Promise.resolve();
    }
    const at = params.layer.at
      ? this.contextService.atArgumentValue(params.layer.at)
      : undefined;
    const body = omitBy(
      {
        ...params.layer.datasource,
        contextFilters: JSON.stringify(params.contextFilters),
        queryParams: JSON.stringify(
          this.widgetService.replaceReferenceDataQueryParams(
            params.layer.datasource?.referenceDataVariableMapping
          )
        ),
        ...(at && {
          at: at.toString(),
        }),
      },
      isNil
    );
    return lastValueFrom(
      this.restService
        .post(`${this.restService.apiUrl}/gis/feature`, body)
        .pipe(
          map((value) => {
            return this.applyPolygons(value, params.layer);
          }),
          // On error, returns a default geojson
          catchError(() => of(EMPTY_FEATURE_COLLECTION))
        )
    );
  };

  /**
   * Fetches features with aggregation directly from frontend
   *
   * @param params parameters as a json
   * @param params.layer layer to get features from
   * @param params.refData Reference data
   * @param params.contextFilters Context filters
   * @param params.aggregationModel Aggregation
   * @returns Promise of features
   */
  private fetchAggregationData = (params: {
    layer: LayerModel;
    refData?: ReferenceData;
    contextFilters?: CompositeFilterDescriptor;
    aggregationModel?: Aggregation;
  }) => {
    if (!params.refData || !params.contextFilters || !params.aggregationModel) {
      return Promise.resolve();
    }
    return lastValueFrom(
      from(
        this.referenceDataService.aggregate(
          params.refData,
          params.aggregationModel,
          {
            queryParams: this.widgetService.replaceReferenceDataQueryParams(
              params.layer.datasource?.referenceDataVariableMapping
            ),
            contextFilters: params.contextFilters,
          }
        )
      ).pipe(
        map((aggregationData) => {
          const featureCollection = {
            type: 'FeatureCollection',
            features: [],
          };
          this.getFeatures(
            featureCollection.features,
            params.layer.type as any,
            aggregationData.items,
            {
              geoField: params.layer.datasource?.geoField,
              longitudeField: params.layer.datasource?.longitudeField,
              latitudeField: params.layer.datasource?.latitudeField,
              adminField: params.layer.datasource?.adminField,
            }
          );
          return this.applyPolygons(featureCollection, params.layer);
        }),
        // On error, returns a default geojson
        catchError(() => of(EMPTY_FEATURE_COLLECTION))
      )
    );
  };

  /**
   * Fetches features collection directly from frontend
   *
   * @param params parameters of the function as a json
   * @param params.layer layer to get features from
   * @param params.refData Reference data
   * @param params.contextFilters Context filters
   * @returns Promise of features
   */
  private fetchFeatureCollection(params: {
    layer: LayerModel;
    refData?: ReferenceData;
    contextFilters?: CompositeFilterDescriptor;
  }) {
    if (!params.refData || !params.contextFilters) {
      return Promise.resolve();
    }
    return lastValueFrom(
      from(
        this.referenceDataService.fetchItems(
          params.refData,
          this.widgetService.replaceReferenceDataQueryParams(
            params.layer.datasource?.referenceDataVariableMapping
          )
        )
      ).pipe(
        map((data) => {
          let items = data.items;
          if (params.contextFilters && !isEmpty(params.contextFilters)) {
            items = items.filter((x: any) =>
              filterReferenceData(x, params.contextFilters)
            );
          }
          const featureCollection = {
            type: 'FeatureCollection',
            features: [],
          };
          this.getFeatures(
            featureCollection.features,
            params.layer.type as any,
            items,
            {
              geoField: params.layer.datasource?.geoField,
              longitudeField: params.layer.datasource?.longitudeField,
              latitudeField: params.layer.datasource?.latitudeField,
              adminField: params.layer.datasource?.adminField,
            }
          );
          return this.applyPolygons(featureCollection, params.layer);
        }), // On error, returns a default geojson
        catchError(() => of(EMPTY_FEATURE_COLLECTION))
      )
    );
  }

  /**
   * Get layer geojson from definition
   *
   * @param layer layer model
   * @returns Layer GeoJSON query
   */
  private async getLayerGeoJson(layer: LayerModel) {
    const contextFilters = layer.contextFilters
      ? this.contextService.injectContext(JSON.parse(layer.contextFilters))
      : {};
    const adminLogic = (
      func: (params: {
        layer: LayerModel;
        refData?: ReferenceData;
        contextFilters?: CompositeFilterDescriptor;
        aggregationModel?: Aggregation;
      }) => Promise<any>,
      params: {
        layer: LayerModel;
        refData?: ReferenceData;
        contextFilters: CompositeFilterDescriptor;
        aggregationModel?: Aggregation;
      }
    ) => {
      return layer.datasource?.adminField
        ? lastValueFrom(
            this.mapPolygonsService.admin0sReady$.pipe(
              first(Boolean),
              switchMap(() => func.bind(this)(params))
            )
          )
        : func(params);
    };

    if (layer.datasource?.refData) {
      const refData = await this.referenceDataService.loadReferenceData(
        layer.datasource?.refData || ''
      );

      if (refData.apiConfiguration?.authType === authType.authorizationCode) {
        if (layer.datasource?.aggregation) {
          const aggregationModel = (
            await this.aggregationService.getAggregations({
              referenceData: layer.datasource?.refData,
              ids: [layer.datasource?.aggregation || ''],
            })
          ).edges[0].node;
          return adminLogic(this.fetchAggregationData.bind(this), {
            layer,
            refData,
            contextFilters,
            aggregationModel,
          });
        } else {
          return adminLogic(this.fetchFeatureCollection.bind(this), {
            layer,
            refData,
            contextFilters,
          });
        }
      } else {
        return adminLogic(this.getLayer.bind(this), { layer, contextFilters });
      }
    } else {
      return adminLogic(this.getLayer.bind(this), { layer, contextFilters });
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
}
