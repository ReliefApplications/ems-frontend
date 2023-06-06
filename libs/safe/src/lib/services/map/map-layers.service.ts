import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  catchError,
  filter,
  forkJoin,
  lastValueFrom,
  map,
  mergeMap,
  Observable,
  of,
  tap,
} from 'rxjs';
import { LayerFormData } from '../../components/ui/map/interfaces/layer-settings.type';
import { Layer, EMPTY_FEATURE_COLLECTION } from '../../components/ui/map/layer';
import { LayerDatasource, LayerModel } from '../../models/layer.model';
import { Resource } from '../../models/resource.model';
import { SafeRestService } from '../rest/rest.service';
import { QueryBuilderService } from '../query-builder/query-builder.service';
import { AggregationBuilderService } from '../aggregation-builder/aggregation-builder.service';
import { Aggregation } from '../../models/aggregation.model';
import { Layout } from '../../models/layout.model';
import {
  AddLayerMutationResponse,
  ADD_LAYER,
  EditLayerMutationResponse,
  EDIT_LAYER,
  DeleteLayerMutationResponse,
  DELETE_LAYER,
} from './graphql/mutations';
import {
  GetLayerByIdQueryResponse,
  GetLayersQueryResponse,
  GET_LAYERS,
  GET_LAYER_BY_ID,
} from './graphql/queries';
import { HttpParams } from '@angular/common/http';
import { omitBy, isNil, get } from 'lodash';
import { SafeMapPopupService } from '../../components/ui/map/map-popup/map-popup.service';

/**
 * Shared map layer service
 */
@Injectable({
  providedIn: 'root',
})
export class SafeMapLayersService {
  /**
   * Class constructor
   *
   * @param apollo Apollo client instance
   * @param restService SafeRestService
   * @param queryBuilder Query builder service
   * @param aggregationBuilder Aggregation builder service
   */
  constructor(
    private apollo: Apollo,
    private restService: SafeRestService,
    private queryBuilder: QueryBuilderService,
    private aggregationBuilder: AggregationBuilderService
  ) {}

  // Layers saved in the database
  currentLayers: LayerModel[] = [];
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
      .query<GetLayerByIdQueryResponse>({
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
      .query<GetLayersQueryResponse>({
        query: GET_LAYERS,
        variables: {},
      })
      .pipe(
        filter((response) => !!response.data),
        // We are creating/destroying components in order to use the same map view for the layer edition and the map settings view
        // So we have to use service properties in order to not keep loading same queries when creating/destroying component views
        tap((response) => (this.currentLayers = response.data.layers)),
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
   * @param resource A resource
   * @param aggregation A aggregation
   * @returns aggregation fields
   */
  public getAggregationFields(
    resource: Resource | null,
    aggregation: Aggregation | null
  ) {
    //@TODO this part should be refactored
    // Get fields
    const fields = this.getAvailableSeriesFields(resource);
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
        // this.fields.next(field);
      })
      // @TODO To be improved - Get only the JSON type fields for this case
      .filter((x: any) => x !== null && x.type.name === 'JSON');
    return this.aggregationBuilder.fieldsAfter(
      selectedFields,
      aggregation?.pipeline
    );
  }

  // @TODO Copied method from tab-main.component, this one should be refactored in the needed places
  // eslint-disable-next-line jsdoc/require-returns
  /**
   * Set available series fields, from resource fields and aggregation definition.
   *
   * @param resource A resource
   */
  private getAvailableSeriesFields(resource: Resource | null): any[] {
    return this.queryBuilder
      .getFields(resource?.queryName as string)
      .filter(
        (field: any) =>
          !(
            field.name.includes('_id') &&
            (field.type.name === 'ID' ||
              (field.type.kind === 'LIST' && field.type.ofType.name === 'ID'))
          )
      );
  }

  // ================= LAYER CREATION ==================== //

  /**
   * Format given settings for Layer class
   * todo(gis): extended model is useless
   *
   * @param layerIds layer settings saved from the layer editor
   * @param popupService popup service
   * @param layerService Shared layer service
   * @returns Observable of LayerSettingsI
   */
  async createLayersFromIds(
    layerIds: string[],
    popupService: SafeMapPopupService,
    layerService: SafeMapLayersService
  ): Promise<Layer[]> {
    const promises: Promise<Layer>[] = [];
    for (const id of layerIds) {
      promises.push(
        lastValueFrom(
          this.getLayerById(id).pipe(
            mergeMap((layer: LayerModel) => {
              if (this.isDatasourceValid(layer.datasource)) {
                const params = new HttpParams({
                  fromObject: omitBy(layer.datasource, isNil),
                });
                // Get the current layer + its geojson
                return forkJoin({
                  layer: of(layer),
                  geojson: this.restService
                    .get(`${this.restService.apiUrl}/gis/feature`, { params })
                    .pipe(catchError(() => of(EMPTY_FEATURE_COLLECTION))),
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
                  popupService,
                  layerService
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
   * Create layer from its definition
   *
   * @param layer Layer to get definition of.
   * @param popupService Shared popup service
   * @param layersService Shared layers service
   * @returns Layer for map widget
   */
  async createLayerFromDefinition(
    layer: LayerModel,
    popupService: SafeMapPopupService,
    layersService: SafeMapLayersService
  ) {
    if (this.isDatasourceValid(layer.datasource)) {
      const params = new HttpParams({
        fromObject: omitBy(layer.datasource, isNil),
      });
      const res = await lastValueFrom(
        forkJoin({
          layer: of(layer),
          geojson: this.restService
            .get(`${this.restService.apiUrl}/gis/feature`, { params })
            .pipe(catchError(() => of(EMPTY_FEATURE_COLLECTION))),
        })
      );
      return new Layer(
        {
          ...res.layer,
          geojson: res.geojson,
        },
        popupService,
        layersService
      );
    } else {
      return new Layer(layer, popupService, layersService);
    }
  }

  private isDatasourceValid = (value: LayerDatasource | undefined) => {
    return (
      value &&
      (value.resource || value.refData) &&
      (value.aggregation || value.layout) &&
      (value.geoField || (value.latitudeField && value.longitudeField))
    );
  };
}
