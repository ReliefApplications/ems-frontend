import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, SkipSelf } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { SafeMapLayersService } from '../../../../services/map/map-layers.service';
import { takeUntil } from 'rxjs';
import { Layer } from '../../../../models/layer.model';
import { IconName } from '../../../ui/map/const/fa-icons';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { MapSettingsService, TabContentTypes } from '../map-settings.service';
import { GetLayersQueryResponse, GET_LAYERS } from './graphql/queries';
import { AddLayerModalComponent } from '../add-layer-modal/add-layer-modal.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

/** List of available layer types */
export const LAYER_TYPES = ['polygon', 'point', 'heatmap', 'cluster'] as const;

/** Interface for a map layer */
export interface MapLayerI {
  id: string;
  name: string;
  type: (typeof LAYER_TYPES)[number];
  defaultVisibility: boolean;
  opacity: number;
  visibilityRangeStart: number;
  visibilityRangeEnd: number;
  style: {
    color: string;
    size: number;
    icon: IconName | 'leaflet_default';
  };
  datasource: {
    origin: 'resource' | 'refData';
    resource: string;
    layout: string;
    aggregation: string;
    refData: string;
  };
}

/**
 * Layers configuration component of Map Widget.
 */
@Component({
  selector: 'safe-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.scss'],
})
export class MapLayersComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() form!: UntypedFormGroup;
  /** @returns the form array for the map layers */
  get layers() {
    return this.form.get('layers') as FormControl<string[]>;
  }

  // Table
  public mapLayers: MatTableDataSource<Layer> = new MatTableDataSource();
  public displayedColumns = ['name', 'actions'];
  public savedLayers: Layer[] = [];
  /**
   * Layers configuration component of Map Widget.
   *
   * @param mapSettingsService MapSettingsService
   * @param safeMapLayersService SafeMapLayersService
   * @param dialog MatDialog
   * @param apollo Angular Apollo
   */
  constructor(
    @SkipSelf() private mapSettingsService: MapSettingsService,
    private safeMapLayersService: SafeMapLayersService,
    private dialog: MatDialog,
    private apollo: Apollo
  ) {
    super();
  }

  ngOnInit(): void {
    this.mapSettingsService.mapSettingsCurrentTabTitle.next('common.layers');
    this.mapSettingsService.mapSettingsButtons.next([
      {
        value: TabContentTypes.PARAMETERS,
        icon: 'map',
        label: 'components.widget.settings.map.properties.title',
        /**
         * Is tab selected
         *
         * @param currentTab current tab value
         * @returns {boolean} is selected
         */
        isSelected: function (currentTab: TabContentTypes | null) {
          return currentTab === this.value;
        },
      },
      {
        value: TabContentTypes.LAYERS,
        icon: 'layers',
        label: 'common.layers',
        /**
         * Is tab selected
         *
         * @param currentTab current tab value
         * @returns {boolean} is selected
         */
        isSelected: function (currentTab: TabContentTypes | null) {
          return currentTab === this.value;
        },
      },
    ]);
    this.setUpLayerEditorListeners();
    this.fetchLayers();
  }

  /**
   * Fetch the current layers in the DB
   */
  private fetchLayers(): void {
    this.apollo
      .query<GetLayersQueryResponse>({
        query: GET_LAYERS,
        variables: {},
      })
      .subscribe((res) => {
        this.savedLayers = res.data.layers;
        this.mapLayers.data = res.data.layers.filter((x) =>
          this.layers.value.includes(x.id)
        );
      });
  }

  /**
   * Get the add/edit layer from the map-layer editor
   */
  private setUpLayerEditorListeners() {
    this.mapSettingsService.layerDataToSave$
      .pipe(takeUntil(this.destroy$))
      .subscribe((layer: { layer: any; layerId: string } | null) => {
        if (layer?.layer) {
          // If already contains an id is a layer edition
          if (layer.layerId) {
            this.safeMapLayersService
              .editLayer(layer.layer)
              .subscribe((res) => {
                if (res) {
                  // this.layers.at(index).patchValue(res);
                  this.fetchLayers();
                }
              });
          } else {
            this.safeMapLayersService.addLayer(layer.layer).subscribe({
              next: (res) => {
                if (res) {
                  this.layers.setValue([...this.layers.value, res.id]);
                  console.log(this.layers.value);
                }
              },
            });
          }
        }
      });

    this.layers?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value.length !== this.layers.value.length) {
          this.fetchLayers();
        }
      });
  }

  /**
   * Removes a layer from the form array
   *
   * @param index Index of the layer to remove
   */
  public onDeleteLayer(index: number) {
    this.layers.setValue(this.layers.value.splice(index, 1));
  }

  /**
   * Set template to add/edit a layer
   *
   * @param id id of layer to edit
   */
  public setLayerEditionTemplate(id?: string) {
    this.mapSettingsService.selectedLayerToEdit.next(
      id
        ? {
            layer: this.savedLayers.find((layer) => layer.id === id),
            layerId: id,
          }
        : null
    );
    this.mapSettingsService.mapSettingsCurrentSelectedTabButton.next(
      TabContentTypes.LAYER
    );
  }

  /**
   * Open dialog to select existing layer.
   */
  public onSelectLayer() {
    const dialogRef = this.dialog.open(AddLayerModalComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((id: string) => {
      if (id) {
        this.layers.setValue(this.layers.value.concat(id));
        // this.layers.push(createLayerForm(layer));
        this.setLayerEditionTemplate(id);
      }
    });
  }

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param e Event emitted when a layer is reordered
   */
  public onListDrop(e: CdkDragDrop<MapLayerI[]>) {
    let layerIds = this.layers.value;
    const movedElement = layerIds[e.previousIndex];
    layerIds = layerIds.splice(e.previousIndex, 1, movedElement);
    this.layers.setValue(layerIds);
  }
}
