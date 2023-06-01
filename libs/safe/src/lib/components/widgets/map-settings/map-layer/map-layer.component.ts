import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  Output,
  OnChanges,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SafeConfirmService } from '../../../../services/confirm/confirm.service';
import { LayerModel } from '../../../../models/layer.model';
import { createLayerForm, LayerFormT } from '../map-forms';
import { debounceTime, takeUntil, BehaviorSubject } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { MapComponent } from '../../../ui/map/map.component';
import {
  MapEvent,
  MapEventType,
} from '../../../ui/map/interfaces/map.interface';
import { LayerFormData } from '../../../ui/map/interfaces/layer-settings.type';
import { OverlayLayerTree } from '../../../ui/map/interfaces/map-layers.interface';
import * as L from 'leaflet';
import { SafeMapLayersService } from '../../../../services/map/map-layers.service';
import { Layer } from '../../../ui/map/layer';
import { Apollo } from 'apollo-angular';
import { GetResourceQueryResponse, GET_RESOURCE } from '../graphql/queries';
import { Fields } from './layer-fields/layer-fields.component';
import { get } from 'lodash';

/**
 * Map layer editor.
 */
@Component({
  selector: 'safe-map-layer',
  templateUrl: './map-layer.component.html',
  styleUrls: ['./map-layer.component.scss'],
})
export class MapLayerComponent
  extends SafeUnsubscribeComponent
  implements OnChanges, OnDestroy
{
  @Input() layer?: LayerModel;
  private _layer!: Layer;
  @Input() mapComponent!: MapComponent | undefined;
  @Output() layerToSave = new EventEmitter<LayerFormData>();
  @Output() layerToOpen = new EventEmitter<LayerModel | undefined>();

  @ViewChild('layerNavigationTemplate')
  layerNavigationTemplate!: TemplateRef<any>;

  @ViewChild('layerSettingsTemplate')
  layerSettingsTemplate!: TemplateRef<any>;

  public resource: BehaviorSubject<GetResourceQueryResponse | null> =
    new BehaviorSubject<GetResourceQueryResponse | null>(null);
  public fields = new BehaviorSubject<Fields[]>([]);
  public fields$ = this.fields.asObservable();
  // === MAP ===
  public currentTab:
    | 'parameters'
    | 'datasource'
    | 'filter'
    | 'cluster'
    | 'aggregation'
    | 'popup'
    | 'fields'
    | 'labels'
    | 'styling'
    | 'sublayers'
    | null = 'parameters';
  public form!: LayerFormT;
  public currentZoom!: number;
  private currentLayer!: L.Layer;
  public isDatasourceValid = false;

  /**
   * Get the overlay tree object of the current map
   *
   * @returns OverlayLayerTree
   */
  private get overlays(): OverlayLayerTree {
    return {
      label: this.form.get('name')?.value || '',
      layer: this.currentLayer,
    };
  }

  /**
   * Get the datasource valid status, so we only display other tabs if valid
   *
   * @returns boolean if we have all necessary data to proceed
   */
  public get datasourceValid(): boolean {
    const datasourceForm = this.form?.get('datasource');
    if (datasourceForm?.get('refData')?.value) {
      return true;
    } else if (datasourceForm?.get('resource')?.value) {
      // If datasource origin is a resource, then geofield OR lat & lng is needed
      if (
        (datasourceForm?.get('layout')?.value ||
          datasourceForm?.get('aggregation')?.value) &&
        (datasourceForm?.get('geoField')?.value ||
          (datasourceForm?.get('latitudeField')?.value &&
            datasourceForm?.get('longitudeField')?.value))
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Map layer editor.
   *
   * @param confirmService Shared confirm service.
   * @param translate Angular translate service.
   * @param mapLayersService Shared map layer Service.
   * @param apollo Apollo service
   */
  constructor(
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private mapLayersService: SafeMapLayersService,
    private apollo: Apollo
  ) {
    super();
  }

  ngOnChanges(): void {
    this.currentTab = 'parameters';
    this.form = createLayerForm(this.layer);
    this.setIsDatasourceValid(this.form.get('datasource')?.value);
    this.form
      .get('datasource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.setIsDatasourceValid(value);
      });
    if (this.mapComponent) {
      this.currentZoom = this.mapComponent.map.getZoom();
      this.setUpLayer();
    }
    this.setUpEditLayerListeners();
    this.getResource();
  }

  /**
   * Set is datasource valid
   *
   * @param value datasource form value
   */
  private setIsDatasourceValid(value: any) {
    if (get(value, 'refData')) {
      this.isDatasourceValid = true;
    } else if (get(value, 'resource')) {
      // If datasource origin is a resource, then geofield OR lat & lng is needed
      if (
        (get(value, 'layout') || get(value, 'aggregation')) &&
        (get(value, 'geoField') ||
          (get(value, 'latitudeField') && get(value, 'longitudeField')))
      ) {
        this.isDatasourceValid = true;
      } else {
        this.isDatasourceValid = false;
      }
    } else {
      this.isDatasourceValid = false;
    }
  }

  /**
   * Set default layer for editor
   */
  private setUpLayer() {
    if (!this.mapComponent) return;
    this.mapLayersService
      .createLayerFromDefinition(
        this.form.value as LayerModel,
        this.mapComponent.mapPopupService,
        this.mapComponent.mapLayersService
      )
      .then((layer) => {
        if (layer) {
          this._layer = layer;
          layer.getLayer().then((l) => {
            this.currentLayer = l;
            this.updateMapLayer();
          });
        }
      });
  }

  /**
   * Update map layer
   *
   * @param options update options
   * @param options.delete delete existing layer
   */
  private updateMapLayer(options: { delete: boolean } = { delete: false }) {
    if (this.mapComponent) {
      this.mapComponent.addOrDeleteLayer = {
        layerData: this.overlays,
        isDelete: options.delete,
      };
      if (options.delete) {
        this.currentLayer = undefined as unknown as L.Layer;
      }
    }
  }

  /**
   * Set edit layers listeners.
   */
  private setUpEditLayerListeners() {
    // Those listeners would handle any change for layer into the map component reference
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(1000))
      .subscribe((value) => {
        this.updateMapLayer({ delete: true });
        this._layer.setConfig({ ...value, geojson: this._layer.geojson });
        this._layer.getLayer(true).then((layer) => {
          this.currentLayer = layer;
          this.updateMapLayer();
        });
      });

    this.form
      .get('datasource')
      ?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(1000))
      .subscribe(() => {
        this.updateMapLayer({ delete: true });
        this.setUpLayer();
        this.getResource();
      });

    this.mapComponent?.mapEvent.pipe(takeUntil(this.destroy$)).subscribe({
      next: (event: MapEvent) => this.handleMapEvent(event),
    });
  }

  /**
   * Handle leaflet map events
   *
   * @param event leaflet map event
   */
  public handleMapEvent(event: MapEvent) {
    if (event) {
      switch (event.type) {
        case MapEventType.ZOOM_END:
          this.currentZoom = event.content.zoom as number;
          break;
        default:
          break;
      }
    }
  }

  /**
   * Send the current form value to save
   */
  onSubmit() {
    this.layerToSave.emit(this.form.getRawValue() as LayerFormData);
  }

  /**
   * Custom close method of dialog.
   * Check if the form is updated or not, and display a confirmation modal if changes detected.
   */
  onCancel(): void {
    if (this.form?.pristine) {
      this.layerToSave.emit(undefined);
    } else {
      const confirmDialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('common.close'),
        content: this.translate.instant(
          'components.widget.settings.close.confirmationMessage'
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmColor: 'warn',
      });
      confirmDialogRef.afterClosed().subscribe((value: any) => {
        if (value) {
          this.layerToSave.emit(undefined);
        }
      });
    }
  }

  /** If the form has a resource, fetch it */
  getResource(): void {
    const resourceID = this.form.get('datasource')?.value?.resource;
    if (resourceID) {
      const layoutID = this.form.get('datasource')?.value?.layout;
      const aggregationID = this.form.get('datasource')?.value?.aggregation;
      this.apollo
        .query<GetResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id: resourceID,
            layout: layoutID ? [layoutID] : [],
            aggregation: aggregationID ? [aggregationID] : [],
          },
        })
        .pipe(takeUntil(this.destroy$), debounceTime(1000))
        .subscribe(({ data }) => {
          this.resource.next(data);
          // Update fields
          if (layoutID) {
            const layout = get(data, 'resource.layouts.edges[0].node', null);
            this.fields.next(this.mapLayersService.getQueryFields(layout));
          } else {
            if (aggregationID) {
              const aggregation = get(
                data,
                'resource.aggregations.edges[0].node',
                null
              );
              this.fields.next(
                this.mapLayersService.getAggregationFields(
                  data.resource,
                  aggregation
                )
              );
            }
          }
        });
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    const overlays: OverlayLayerTree = {
      label: this.form.get('name')?.value || '',
      layer: this.currentLayer,
    };
    //Once we exit the layer editor, destroy the layer and related controls
    if (this.mapComponent) {
      this.mapComponent.addOrDeleteLayer = {
        layerData: overlays,
        isDelete: true,
      };
    }
  }

  /**
   * Open layer edition
   *
   * @param layer layer to open
   */
  onEditLayer(layer?: LayerModel): void {
    this.layerToOpen.emit(layer);
  }

  /**
   * Delete given layer id from the layers form and updates map view
   *
   * @param layerIdToDelete Layer id to  delete
   */
  onDeleteLayer(layerIdToDelete: string): void {
    // Delete layer from form
    const sublayers = this.form.get('sublayers')?.value;
    const filtered = sublayers?.filter((l) => l !== layerIdToDelete);
    this.form.get('sublayers')?.setValue(filtered);
  }
}
