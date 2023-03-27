import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, filter, map, tap } from 'rxjs';
import { LayerFormData } from '../../components/ui/map/interfaces/layer-settings.type';
import { LayerModel } from '../../models/layer.model';
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
   */
  constructor(private apollo: Apollo) {}

  // Layers saved in the database
  currentLayers: LayerModel[] = [];
  /**
   * Save a new layer in the DB
   *
   * @param layer Layer to add
   * @returns An observable with the new layer data formatted for the application form
   */
  public addLayer(layer: LayerFormData): Observable<LayerModel | undefined> {
    return this.apollo
      .mutate<AddLayerMutationResponse>({
        mutation: ADD_LAYER,
        variables: {
          name: layer.name,
          sublayers: [],
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
    return this.apollo
      .mutate<EditLayerMutationResponse>({
        mutation: EDIT_LAYER,
        variables: {
          id: layer.id,
          parent: layer.id,
          name: layer.name,
          sublayers: [],
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
}
