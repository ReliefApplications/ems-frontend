import {
  Component,
  OnDestroy,
  Inject,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmService } from '../../../../services/confirm/confirm.service';
import { Fields, LayerModel } from '../../../../models/layer.model';
import { createLayerForm, LayerFormT } from '../map-forms';
import {
  takeUntil,
  BehaviorSubject,
  pairwise,
  startWith,
  distinctUntilChanged,
  filter,
  combineLatest,
  tap,
} from 'rxjs';
import { MapComponent } from '../../../ui/map/map.component';
import {
  MapEvent,
  MapEventType,
} from '../../../ui/map/interfaces/map.interface';
import { LayerFormData } from '../../../ui/map/interfaces/layer-settings.type';
import { OverlayLayerTree } from '../../../ui/map/interfaces/map-layers.interface';
import * as L from 'leaflet';
import { MapLayersService } from '../../../../services/map/map-layers.service';
import { Layer } from '../../../ui/map/layer';
import { Apollo } from 'apollo-angular';
import { GET_REFERENCE_DATA, GET_RESOURCE } from '../graphql/queries';
import { get, isEqual } from 'lodash';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
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
import { MapLayersModule } from '../map-layers/map-layers.module';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ContextualFiltersSettingsComponent } from '../../common/contextual-filters-settings/contextual-filters-settings.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../../models/resource.model';
import { Layout } from '../../../../models/layout.model';
import { Aggregation } from '../../../../models/aggregation.model';
import { DomPortal, PortalModule } from '@angular/cdk/portal';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
} from '../../../../models/reference-data.model';

/**
 * Interface of dialog input
 */
interface DialogData {
  layer?: LayerModel;
  mapPortal?: DomPortal;
  mapComponent: MapComponent;
}

/**
 * Edit map layer modal.
 */
@Component({
  selector: 'shared-edit-layer-modal',
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
    ContextualFiltersSettingsComponent,
    PortalModule,
  ],
  templateUrl: './edit-layer-modal.component.html',
  styleUrls: ['./edit-layer-modal.component.scss'],
})
export class EditLayerModalComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  /** Current Layer */
  private _layer!: Layer;
  /** Selected reference data */
  public referenceData: ReferenceData | null = null;
  /** Selected resource */
  public resource: Resource | null = null;
  /** Selected layout */
  public layout: Layout | null = null;
  /** Selected aggregation */
  public aggregation: Aggregation | null = null;
  /** Available fields */
  public fields = new BehaviorSubject<Fields[]>([]);
  /** Available fields as observable */
  public fields$ = this.fields.asObservable();
  /** Form group */
  public form!: LayerFormT;
  /** Current map zoom */
  public currentZoom!: number;
  /** Current leaflet layer */
  private currentLayer!: L.Layer;
  /** Is current datasource valie */
  public isDatasourceValid = false;
  /** Map dom portal */
  public mapPortal?: DomPortal;
  /**
   * This property would handle the form change side effects to be triggered once all
   * layer related updates are done in order to avoid multiple mismatches and duplications between
   * a property change, layer data retrieval and form update
   */
  private triggerFormChange = new BehaviorSubject(true);

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
   * @param {DialogData} data Dialog input
   * @param confirmService Shared confirm service.
   * @param translate Angular translate service.
   * @param mapLayersService Shared map layer Service.
   * @param apollo Apollo service
   * @param dialogRef Dialog ref
   * @param fb Angular form builder
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private mapLayersService: MapLayersService,
    private apollo: Apollo,
    public dialogRef: DialogRef<LayerFormData>,
    private fb: FormBuilder
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
      // Reset all map layers to keep basemaps or arcGISmaps on loading map editor
      this.data.mapComponent.setupMapLayers(
        {
          layers: [],
          arcGisWebMap: encapsulatedSettings.settings.arcGisWebMap,
          basemap: encapsulatedSettings.settings.basemap,
          controls: encapsulatedSettings.settings.controls,
        },
        true
      );
      // Reset the current map view in order to only see the layer on edition
      this.data.mapComponent.mapSettings = {
        ...encapsulatedSettings.settings,
        layers: [],
      };
      this.currentZoom = this.data.mapComponent.map.getZoom();
      this.setUpLayer(true);
    }
    this.mapPortal = this.data.mapPortal;
    this.setUpEditLayerListeners();
  }

  ngAfterViewInit(): void {
    // If datasource changes, update fields form control
    this.fields.pipe(takeUntil(this.destroy$)).subscribe((fields: any) => {
      fields.forEach((field: Fields) => this.updateFormField(field));
    });
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
   * Update current map instance layers array in order to keep up to date all the related layers for listener removal
   */
  private updateCurrentMapInstanceLayerCount() {
    if (!this.data.mapComponent.layers.find((l) => l.id !== this._layer.id)) {
      this.data.mapComponent.layers.push(this._layer);
    }
  }

  /**
   * Set default layer for editor
   *
   * @param lastFormValue Last value triggered from the layer editor form
   */
  private setUpLayer(lastFormValue?: any) {
    if (!this.data.mapComponent) {
      return;
    }
    this.mapLayersService
      .createLayerFromDefinition(
        this.form.value as LayerModel,
        this.data.mapComponent.injector
      )
      .then((layer) => {
        if (layer) {
          this._layer = layer;
          this.updateCurrentMapInstanceLayerCount();
          this._layer.getLayer().then((l) => {
            this.currentLayer = l;
            this.updateMapLayer({ delete: false }, lastFormValue);
          });
        }
      });
  }

  /**
   * Update map layer
   *
   * @param options update options
   * @param options.delete delete existing layer
   * @param lastFormValue Last emitted value from the layer editor form
   */
  private updateMapLayer(
    options: { delete: boolean } = { delete: false },
    lastFormValue: any = null
  ) {
    if (this.data.mapComponent) {
      this.data.mapComponent.addOrDeleteLayer = {
        layerData: this.overlays,
        isDelete: options.delete,
      };
      if (options.delete) {
        this.currentLayer = undefined as unknown as L.Layer;
      } else {
        this.data.mapComponent.disableMapHandlers(false);
      }
      this.triggerFormChange.next(lastFormValue);
    }
  }

  /**
   * Set edit layers listeners.
   */
  private setUpEditLayerListeners() {
    // Those listeners would handle any change for layer into the map component reference
    // Main problem of duplicated layers is that form change triggers values before the updateLayer has fetch the needed info from server to update current map state
    // Combining form change(as it's a complex mix of different type of component and forms with different behaviors) we won't trigger any form change value until the triggerForm is set
    // triggerFormChange would be set once after the first form change is received and all needed data for map update is done,
    // Then it would trigger this stream again to check if during that time there has been any new change in the form, which would be loaded again avoiding any duplicate layers as they would be always added on sequence
    combineLatest([
      this.form.valueChanges.pipe(startWith(this.form.value), pairwise()),
      this.triggerFormChange.asObservable(),
    ])
      .pipe(
        filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([[prev, next], trigger]) =>
            this.triggerFormChange.getValue() &&
            !isEqual(this.triggerFormChange.getValue(), next)
        ),
        // Disable all map handlers while map data is updating to avoid any unwanted side effects
        tap(() => this.data.mapComponent.disableMapHandlers(true)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: async ([[prev, next], trigger]) => {
          this.updateMapLayer({ delete: true });
          if (
            prev.datasource?.geoField !== next.datasource?.geoField ||
            prev.datasource?.adminField !== next.datasource?.adminField ||
            prev.datasource?.latitudeField !== next.datasource?.latitudeField ||
            prev.datasource?.longitudeField !== next.datasource?.longitudeField
          ) {
            this.setUpLayer(next);
          } else if (this._layer) {
            await this._layer.removeAllListeners(this.data.mapComponent.map);
            await this._layer.setConfig({
              ...next,
              geojson: this._layer.geojson,
            });
            this.updateCurrentMapInstanceLayerCount();
            this._layer.getLayer(true).then((l) => {
              this.currentLayer = l;
              this.updateMapLayer({ delete: false }, next);
            });
          }
        },
      });

    if (this.form.controls.datasource) {
      // Reference data changes
      this.getReferenceData();
      this.form
        .get('datasource.refData')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.clearFields();
          this.form
            .get('datasource.aggregation')
            ?.setValue(null, { emitEvent: false });
          this.aggregation = null;
          if (value) {
            this.form.get('datasource.resource')?.setValue(null);
            this.getReferenceData();
          } else {
            this.referenceData = null;
          }
        });

      // Resource changes
      this.getResource();
      this.form
        .get('datasource.resource')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.clearFields();
          const datasourceGroup = this.form.controls.datasource as FormGroup;
          datasourceGroup.get('layout')?.setValue(null, { emitEvent: false });
          datasourceGroup
            .get('aggregation')
            ?.setValue(null, { emitEvent: false });
          this.layout = null;
          this.aggregation = null;
          if (value) {
            this.form.get('datasource.referenceData')?.setValue(null);
            this.getResource();
          } else {
            this.resource = null;
          }
        });
      this.form
        .get('datasource.layout')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.clearFields;
          if (value) {
            this.getResource();
          } else {
            this.layout = null;
          }
        });
      this.form
        .get('datasource.aggregation')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.clearFields();
          const formValue = this.form.getRawValue();
          if (!value) {
            this.aggregation = null;
          }
          if (get(formValue, 'datasource.refData')) {
            //we refetch fields even when aggregation is deleted
            this.getReferenceData();
          }
          if (value && get(formValue, 'datasource.resource')) {
            this.getResource();
          }
        });
    }

    this.data.mapComponent?.mapEvent.pipe(takeUntil(this.destroy$)).subscribe({
      next: (event: MapEvent) => this.handleMapEvent(event),
    });
  }

  /** Clears the geo, admin, latitude and longitude fields */
  private clearFields() {
    const datasourceGroup = this.form.controls.datasource as FormGroup;
    datasourceGroup.get('geoField')?.setValue(null, { emitEvent: false });
    datasourceGroup.get('adminField')?.setValue(null, { emitEvent: false });
    datasourceGroup.get('latitudeField')?.setValue(null, { emitEvent: false });
    datasourceGroup.get('longitudeField')?.setValue(null, { emitEvent: false });
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
    this.dialogRef.close(this.form.getRawValue() as LayerFormData);
  }

  /**
   * Custom close method of dialog.
   * Check if the form is updated or not, and display a confirmation modal if changes detected.
   */
  onCancel(): void {
    if (this.form?.pristine) {
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
            this.dialogRef.close();
          }
        });
    }
  }

  /**
   * Get resource from graphql
   */
  getResource(): void {
    this.fields.next([]);
    const formValue = this.form.getRawValue();
    const resourceID = get(formValue, 'datasource.resource');
    if (resourceID) {
      const layoutID = get(formValue, 'datasource.layout');
      const aggregationID = get(formValue, 'datasource.aggregation');
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id: resourceID,
            layout: layoutID ? [layoutID] : [],
            aggregation: aggregationID ? [aggregationID] : [],
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          this.resource = data.resource;
          // Update fields
          if (layoutID) {
            this.layout = get(data, 'resource.layouts.edges[0].node', null);
            this.fields.next(this.mapLayersService.getQueryFields(this.layout));
          } else {
            if (aggregationID) {
              this.aggregation = get(
                data,
                'resource.aggregations.edges[0].node',
                null
              );
              this.fields.next(
                this.aggregation
                  ? this.mapLayersService.getAggregationFields(
                      data.resource.queryName ?? '',
                      this.aggregation
                    )
                  : []
              );
            }
          }
        });
    }
  }

  /**
   * Get reference data from graphql
   */
  getReferenceData(): void {
    this.fields.next([]);
    const formValue = this.form.getRawValue();
    const referenceDataId = get(formValue, 'datasource.refData');
    if (referenceDataId) {
      const aggregationID = get(formValue, 'datasource.aggregation');
      this.apollo
        .query<ReferenceDataQueryResponse>({
          query: GET_REFERENCE_DATA,
          variables: {
            id: referenceDataId,
            aggregation: aggregationID ? [aggregationID] : [],
          },
        })
        .subscribe(({ data }) => {
          this.referenceData = data.referenceData;
          if (aggregationID) {
            this.aggregation = get(
              data,
              'referenceData.aggregations.edges[0].node',
              null
            );
            this.fields.next(
              this.aggregation
                ? this.mapLayersService.getAggregationFields(
                    data.referenceData.graphQLTypeName ?? '',
                    this.aggregation
                  )
                : []
            );
          } else {
            this.fields.next(
              this.getFieldsFromRefData(this.referenceData?.fields || [])
            );
          }
        });
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

  /**
   * Updates or creates a new form control when editing the layer field
   * or changing the datasource
   *
   * @param field field object with the updated info
   * @param initializing indicates if datasource didn't changed and fields list
   * need to be update nad not initialized
   */
  updateFormField(field: Fields, initializing = true): void {
    const fieldsInfo = (
      this.form.get('popupInfo')?.get('fieldsInfo') as FormArray
    ).controls;
    const control = fieldsInfo.find(
      (fieldControl: any) =>
        (fieldControl as FormArray)?.get('name')?.value === field.name
    );
    if (!control) {
      const newControl = this.fb.group({
        label: get(field, 'label', ''),
        name: get(field, 'name', ''),
        type: get(field, 'type', ''),
      });
      fieldsInfo.push(newControl);
    } else {
      if (!initializing) {
        control.get('label')?.setValue(get(field, 'label', ''));
        this.fields.next(this.form.get('popupInfo')?.get('fieldsInfo')?.value);
      } else {
        field.label = control.get('label')?.value ?? '';
      }
    }
  }

  /**
   * Extract layer fields from reference data
   *
   * @param fields available reference data fields
   * @returns layer fields
   */
  private getFieldsFromRefData(fields: any[]): Fields[] {
    return fields
      .filter((field) => field && typeof field !== 'string')
      .map((field) => {
        return {
          label: field.name,
          name: field.name,
          type: field.type,
        } as Fields;
      });
  }
}
