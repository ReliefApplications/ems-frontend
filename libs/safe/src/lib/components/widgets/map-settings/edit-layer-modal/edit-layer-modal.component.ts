import {
  Component,
  ViewChild,
  OnDestroy,
  Inject,
  OnInit,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SafeConfirmService } from '../../../../services/confirm/confirm.service';
import { LayerModel } from '../../../../models/layer.model';
import { createLayerForm, LayerFormT } from '../map-forms';
import {
  takeUntil,
  BehaviorSubject,
  Subject,
  pairwise,
  startWith,
  distinctUntilChanged,
} from 'rxjs';
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
import { get, isEqual } from 'lodash';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { LayerPropertiesModule } from './layer-properties/layer-properties.module';
import { LayerDatasourceModule } from './layer-datasource/layer-datasource.module';
import { LayerFieldsModule } from './layer-fields/layer-fields.module';
import { LayerAggregationModule } from './layer-aggregation/layer-aggregation.module';
import { LayerPopupModule } from './layer-popup/layer-popup.module';
import { LayerLabelsModule } from './layer-labels/layer-labels.module';
import { LayerFilterModule } from './layer-filter/layer-filter.module';
import { LayerClusterModule } from './layer-cluster/layer-cluster.module';
import { LayerStylingModule } from './layer-styling/layer-styling.module';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  DialogModule,
  IconModule,
  TabsModule,
  TooltipModule,
} from '@oort-front/ui';
import { Fields } from './layer-fields/layer-fields.component';
import { MapLayersModule } from '../map-layers/map-layers.module';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

/**
 * Interface of dialog input
 */
interface DialogData {
  layer?: LayerModel;
  currentMapContainerRef: BehaviorSubject<ViewContainerRef | null>;
  editingLayer: BehaviorSubject<boolean>;
  mapComponent: MapComponent;
}

/**
 * Edit map layer modal.
 */
@Component({
  selector: 'safe-edit-layer-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TabsModule,
    ButtonModule,
    IconModule,
    TranslateModule,
    TooltipModule,
    LayerPropertiesModule,
    LayerDatasourceModule,
    LayerFieldsModule,
    LayerAggregationModule,
    LayerPopupModule,
    LayerClusterModule,
    LayerLabelsModule,
    LayerFilterModule,
    LayerStylingModule,
    MapLayersModule,
  ],
  templateUrl: './edit-layer-modal.component.html',
  styleUrls: ['./edit-layer-modal.component.scss'],
})
export class EditLayerModalComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private _layer!: Layer;

  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainerRef!: ViewContainerRef;
  destroyTab$: Subject<boolean> = new Subject<boolean>();

  public resource: BehaviorSubject<GetResourceQueryResponse | null> =
    new BehaviorSubject<GetResourceQueryResponse | null>(null);
  public fields = new BehaviorSubject<Fields[]>([]);
  public fields$ = this.fields.asObservable();

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
   * Map layer editor.
   *
   * @param confirmService Shared confirm service.
   * @param translate Angular translate service.
   * @param mapLayersService Shared map layer Service.
   * @param apollo Apollo service
   * @param {DialogData} data Dialog input
   * @param dialogRef Dialog ref
   */
  constructor(
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private mapLayersService: SafeMapLayersService,
    private apollo: Apollo,
    @Inject(DIALOG_DATA) public data: DialogData,
    public dialogRef: DialogRef<LayerFormData>
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = createLayerForm(this.data.layer);
    this.setIsDatasourceValid(this.form.get('datasource')?.value);
    this.form
      .get('datasource')
      ?.valueChanges.pipe(
        distinctUntilChanged((prev, next) => isEqual(prev, next)),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.setIsDatasourceValid(value);
      });
    if (this.data.mapComponent) {
      const encapsulatedSettings =
        this.data.mapComponent.mapSettingsWithoutLayers;
      // Reset the current map view in order to only see the layer on edition
      this.data.mapComponent.mapSettings = {
        ...encapsulatedSettings.settings,
        layers: [],
      };
      this.currentZoom = this.data.mapComponent.map.getZoom();
      this.setUpLayer();
    }
    this.setUpEditLayerListeners();
    this.getResource();
    console.log(this.form);
  }

  ngAfterViewInit(): void {
    this.data.editingLayer.next(true);
    const currentContainerRef = this.data.currentMapContainerRef.getValue();
    if (currentContainerRef) {
      const view = currentContainerRef.detach();
      if (view) {
        this.mapContainerRef.insert(view);
        this.data.currentMapContainerRef.next(this.mapContainerRef);
      }
    }
  }

  /**
   * Change on selected index.
   */
  selectedIndexChange(): void {
    this.destroyTab$.next(true);
    const currentContainerRef = this.data.currentMapContainerRef.getValue();
    if (currentContainerRef) {
      const view = currentContainerRef.detach();
      if (view) {
        this.mapContainerRef.insert(view);
        this.data.currentMapContainerRef.next(this.mapContainerRef);
        this.destroyTab$.next(false);
      }
    }
  }

  /**
   * Set is datasource valid
   *
   * @param value datasource form value
   */
  private setIsDatasourceValid(value: any) {
    if (get(value, 'refData')) {
      if (
        get(value, 'geoField') ||
        (get(value, 'latitudeField') && get(value, 'longitudeField'))
      ) {
        this.isDatasourceValid = true;
      } else {
        this.isDatasourceValid = false;
      }
    } else if (get(value, 'resource')) {
      // If datasource origin is a resource, then geofield OR lat & lng is needed
      if (
        (get(value, 'layout') || get(value, 'aggregation')) &&
        (get(value, 'geoField') ||
          (get(value, 'latitudeField') && get(value, 'longitudeField')))
      ) {
        this.isDatasourceValid = true;
      }
    } else {
      this.isDatasourceValid = false;
    }
  }

  /**
   * Set default layer for editor
   */
  private setUpLayer() {
    if (!this.data.mapComponent) return;
    this.mapLayersService
      .createLayerFromDefinition(
        this.form.value as LayerModel,
        this.data.mapComponent.mapPopupService,
        this.data.mapComponent.mapLayersService
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
    if (this.data.mapComponent) {
      this.data.mapComponent.addOrDeleteLayer = {
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
      .pipe(
        startWith(this.form.value),
        distinctUntilChanged((prev, next) => isEqual(prev, next)),
        pairwise(),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ([prev, next]) => {
          this.updateMapLayer({ delete: true });
          // If any of the main properties to fetch the layer changes, set up layer
          if (
            prev.datasource.geoField !== next.datasource.geoField ||
            prev.datasource.latitudeField !== next.datasource.latitudeField ||
            prev.datasource.longitudeField !== next.datasource.longitudeField
          ) {
            this.setUpLayer();
          } else {
            // else update current layer properties
            this._layer.setConfig({ ...next, geojson: this._layer.geojson });
            this._layer.getLayer(true).then((layer) => {
              this.currentLayer = layer;
              this.updateMapLayer();
            });
          }
        },
      });

    this.form
      .get('datasource')
      ?.valueChanges.pipe(
        startWith(this.form.get('datasource')?.value),
        pairwise(),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ([prev, next]) => {
          if (!!prev && prev?.resource !== next?.resource && next?.resource) {
            this.getResource();
          }
          // else on aggregation implementation add it here
        },
      });

    this.data.mapComponent?.mapEvent.pipe(takeUntil(this.destroy$)).subscribe({
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
    // this.layerToSave.emit(this.form.getRawValue() as LayerFormData);
    this.destroyTab$.next(true);
    this.data.editingLayer.next(false);
    this.dialogRef.close(this.form.getRawValue() as LayerFormData);
  }

  /**
   * Custom close method of dialog.
   * Check if the form is updated or not, and display a confirmation modal if changes detected.
   */
  onCancel(): void {
    if (this.form?.pristine) {
      // this.layerToSave.emit(undefined);
      this.destroyTab$.next(true);
      this.data.editingLayer.next(false);
      this.dialogRef.close();
    } else {
      const confirmDialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('common.close'),
        content: this.translate.instant(
          'components.widget.settings.close.confirmationMessage'
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'danger',
      });
      confirmDialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.destroyTab$.next(true);
            this.data.editingLayer.next(false);
            this.dialogRef.close();
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
        .pipe(takeUntil(this.destroy$))
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
    if (this.data.mapComponent) {
      this.data.mapComponent.addOrDeleteLayer = {
        layerData: overlays,
        isDelete: true,
      };
    }
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
