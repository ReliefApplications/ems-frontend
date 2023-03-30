import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  filter,
  forkJoin,
  from,
  lastValueFrom,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
import { LayerFormData } from '../../components/ui/map/interfaces/layer-settings.type';
import { Layer, ExtendedLayerModel } from '../../components/ui/map/layer';
import { LayerModel } from '../../models/layer.model';
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

  // ================= LAYER CREATION ==================== //

  /**
   * Format given settings for Layer class
   *
   * @param layerIds layer settings saved from the layer editor
   * @returns Observable of LayerSettingsI
   */
  async createLayersFromIds(layerIds: string[]): Promise<Layer> {
    // If current layers exists, we will use those values,
    // otherwise we will make the API call
    const layerSourceData$ = !this.currentLayers.length
      ? this.getLayers()
      : of(this.currentLayers);

    const formattedLayerSettings = await lastValueFrom(
      layerSourceData$.pipe(
        // Get the layer info from the layers where the id is included in the given layerIds
        switchMap((layers) =>
          from(layers.filter((layer) => layerIds.includes(layer.id)))
        ),
        // Then go layer by layer to create the layerSettings object
        mergeMap((layer: LayerModel) => {
          // Get the current layer plus it's geojson
          return forkJoin({
            layer: of(layer),
            geojson: this.restService.get(
              `${
                this.restService.apiUrl
              }/gis/feature?type=Point&tolerance=${0.9}&highquality=${true}`
            ),
          });
        }),
        // Destructure layer information to have all data at the same level
        map(
          (layer) =>
            ({
              ...layer.layer,
              geojson: layer.geojson,
            } as ExtendedLayerModel)
        ),
        // Get them into an array after all pipes are done
        toArray(),
        // And set those layers into the children of our hardcoded layer group
        // @TODO it would be mapped later onto it's current layer type
        map((layers: ExtendedLayerModel[]) => {
          return {
            name: '',
            type: 'group',
            children: layers,
          };
        })
      )
    );
    return new Layer(formattedLayerSettings);
  }

  /**
   * Create layer from its definition
   *
   * @param layer Layer to get definition of.
   * @param datasource Datasource object containing type and id
   * @param datasource.type Data source type
   * @param datasource.id Data source id
   * @returns Layer for map widget
   */
  async createLayerFromDefinition(
    layer: LayerModel,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    datasource?: { type: 'layout' | 'aggregation' | 'refData'; id: string }
  ) {
    const res = await lastValueFrom(
      forkJoin({
        layer: of(layer),
        geojson: this.restService.get(
          `${
            this.restService.apiUrl
          }/gis/feature?type=Point&tolerance=${0.9}&highquality=${true}`
        ),
      })
    );
    return new Layer({
      ...res.layer,
      geojson: res.geojson,
    } as ExtendedLayerModel);
  }

  /**
   * Set the geojson to the given layer settings
   *
   * @param layer layer settings saved from the layer editor
   * @returns LayerSettingsI array
   */
  private getLayerSettings(layer: ExtendedLayerModel): any {
    // @TODO As we complete the layer editor we will have to set those new values in these function
    // instead of the hardcoded ones
    return {
      // Currently we only have name and id in the graphql endpoint for each layer metadata
      name: layer.name,
      id: layer.id,
      type: 'feature',
      // The geojson previously fetched from the REST
      geojson: layer.geojson,
      filter: {
        condition: 'and',
        filters: [
          {
            field: 'name',
            operator: 'neq',
            value: 'Point 1',
          },
        ],
      },
      properties: {
        // None of this data is available yet
        minZoom: layer.layerDefinition?.minZoom ?? 2,
        maxZoom: layer.layerDefinition?.maxZoom ?? 18,
        opacity: layer?.opacity ?? 1,
        visibility: layer.visibility ?? true,
        legend: {
          display: true,
          field: 'name',
        },
      },
      styling: [
        {
          filter: {
            condition: 'and',
            filters: [],
          },
          style: {
            borderColor: 'black',
            borderWidth: 1,
            fillOpacity: layer.opacity ?? 1,
            borderOpacity: layer.opacity ?? 1,
            symbol: layer.layerDefinition?.drawingInfo?.renderer?.symbol ?? {
              color: '#0b55d6',
              icon: 'location-dot',
              size: 24,
            },
          },
        },
      ],
      labels: {
        filter: {
          condition: 'and',
          filters: [],
        },
        label: '{{name}}',
        style: {
          color: '#000000',
          fontSize: 12,
          fontWeight: 'normal',
        },
      },
    };
  }
}
