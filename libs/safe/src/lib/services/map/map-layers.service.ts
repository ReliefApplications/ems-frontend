import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, filter, map } from 'rxjs';
import { Layer } from '../../models/layer.model';
import {
  AddLayerMutationResponse,
  ADD_LAYER,
  EditLayerMutationResponse,
  EDIT_LAYER,
  DeleteLayerMutationResponse,
  DELETE_LAYER,
} from './graphql/mutations';
import {
  GetLayersQueryResponse,
  GET_LAYERS,
  GetLayerByIdQueryResponse,
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

  /**
   * Save a new layer in the DB
   *
   * @param layer Layer to add
   * @returns An observable with the new layer data formatted for the application form
   */
  public addLayer(layer: Layer): Observable<Layer | undefined> {
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
  public editLayer(layer: Layer): Observable<Layer | undefined> {
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
   * Get layers in DB
   *
   * @returns Observable of layers
   */
  public getLayers(): Observable<Layer[]> {
    return this.apollo
      .query<GetLayersQueryResponse>({
        query: GET_LAYERS,
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
   * Get the layer for the given id
   *
   * @param layerId Layer id
   * @returns Observable of layer
   */
  public getLayerById(layerId: string): Observable<Layer> {
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
}
