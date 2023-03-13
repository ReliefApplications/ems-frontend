import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { filter, map, Observable } from 'rxjs';
import { formatLayerDataForForm } from '../../components/widgets/map-settings/map-forms';
import { MapLayerI } from '../../components/widgets/map-settings/map-layers/map-layers.component';
import {
  AddLayerMutationResponse,
  ADD_LAYER,
  DeleteLayerMutationResponse,
  DELETE_LAYER,
  EditLayerMutationResponse,
  EDIT_LAYER,
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

  /**
   * Save a new layer in the DB
   *
   * @param layer Layer to add
   * @returns An observable with the new layer data formatted for the application form
   */
  public addLayer(layer: MapLayerI): Observable<MapLayerI> {
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
          return formatLayerDataForForm(
            (response.data as AddLayerMutationResponse).addLayer
          );
        })
      );
  }

  /**
   * Edit a layer in the DB
   *
   * @param layer Layer data to save
   * @returns An observable with the edited layer data formatted for the application form
   */
  public editLayer(layer: MapLayerI): Observable<MapLayerI> {
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
          return formatLayerDataForForm(
            (response.data as EditLayerMutationResponse).editLayer
          );
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
  public getLayers(): Observable<MapLayerI[]> {
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
          return (response.data as GetLayersQueryResponse).layers.map((layer) =>
            formatLayerDataForForm(layer)
          );
        })
      );
  }

  /**
   * Get the layer for the given id
   *
   * @param layerId Layer id
   * @returns Observable of layer
   */
  public getLayerById(layerId: string): Observable<MapLayerI> {
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
          return formatLayerDataForForm(
            (response.data as GetLayerByIdQueryResponse).layer
          );
        })
      );
  }
}
