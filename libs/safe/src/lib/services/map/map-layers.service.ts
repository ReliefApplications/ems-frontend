import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
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
import { SafeRestService } from '../rest/rest.service';
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
import { omitBy, isNil } from 'lodash';

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
   */
  constructor(private apollo: Apollo, private restService: SafeRestService) {}

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
    delete newLayer.datasource.origin;
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
    delete newLayer.datasource.origin;
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

  // ================= LAYER CREATION ==================== //

  /**
   * Format given settings for Layer class
   * todo(gis): extended model is useless
   *
   * @param layerIds layer settings saved from the layer editor
   * @returns Observable of LayerSettingsI
   */
  async createLayersFromIds(layerIds: string[]): Promise<Layer[]> {
    const promises: Promise<Layer>[] = [];
    for (const id of layerIds) {
      promises.push(
        lastValueFrom(
          this.getLayerById(id).pipe(
            mergeMap((layer: LayerModel) => {
              console.log(layer.datasource);
              if (this.isDatasourceValid(layer.datasource)) {
                const params = new HttpParams({
                  fromObject: omitBy(layer.datasource, isNil),
                });
                // Get the current layer + its geojson
                return forkJoin({
                  layer: of(layer),
                  geojson: this.restService.get(
                    `${this.restService.apiUrl}/gis/feature`,
                    { params }
                  ),
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
                new Layer({ ...layer.layer, geojson: layer.geojson })
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
   * @returns Layer for map widget
   */
  async createLayerFromDefinition(layer: LayerModel) {
    if (this.isDatasourceValid(layer.datasource)) {
      const params = new HttpParams({
        fromObject: omitBy(layer.datasource, isNil),
      });
      const res = await lastValueFrom(
        forkJoin({
          layer: of(layer),
          geojson: this.restService.get(
            `${this.restService.apiUrl}/gis/feature`,
            { params }
          ),
        })
      );
      return new Layer({
        ...res.layer,
        geojson: res.geojson,
      });
    } else {
      return new Layer(layer);
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
