import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormArray,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatLegacyDialogRef as MatDialogRef,
  MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SafeMapLayersService } from '../../../../services/maps/map-layers.service';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { createLayerForm } from '../map-forms';
import { SafeEditLayerModalComponent } from './edit-layer-modal/edit-layer-modal.component';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  GetLayersQueryResponse,
  GET_LAYERS,
} from '../../../../services/maps/graphql/queries';
import { Layer } from '../../../../models/layer.model';

/** List of available layer types */
export const LAYER_TYPES = ['polygon', 'point', 'heatmap', 'cluster'] as const;
/** Interface for a map layer */
export interface MapLayerI {
  name: string;
  id: string;
  type: (typeof LAYER_TYPES)[number];
  defaultVisibility: boolean;
  opacity: number;
  visibilityRangeStart: number;
  visibilityRangeEnd: number;
  style: {
    color: string;
    size: number;
    icon: string;
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
  @ViewChild('layerOptionsModal') layerOptionsModal!: TemplateRef<any>;

  /** @returns the form array for the map layers */
  get layers() {
    return this.form.get('layers') as UntypedFormArray;
  }

  // Table
  public mapLayers: MatTableDataSource<MapLayerI> = new MatTableDataSource();
  public displayedColumns = ['name', 'actions'];

  // === Layers ===
  public layerList: Layer[] = [];
  public layerListQuery!: QueryRef<GetLayersQueryResponse>;
  public layerForm = new FormGroup({
    layer: new FormControl('', Validators.required),
  });
  public selectedLayer!: Layer;

  /**
   * Layers configuration component of Map Widget.
   *
   * @param dialog service for opening modals
   * @param safeMapLayerService service for map layers
   * @param apollo service for apollo client
   */
  constructor(
    private dialog: MatDialog,
    private safeMapLayerService: SafeMapLayersService,
    private apollo: Apollo
  ) {
    super();
  }

  ngOnInit(): void {
    this.mapLayers.data = this.layers.value;

    this.layerListQuery = this.apollo.watchQuery<GetLayersQueryResponse>({
      query: GET_LAYERS,
    });
    this.setListeners();
  }

  /**
   * Set listeners needed for the map layers component
   */
  private setListeners() {
    this.form
      .get('layers')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.mapLayers.data = value;
      });
    this.layerForm
      .get('layer')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.selectedLayer = this.layerList.find(
          (layer) => layer.id === value
        ) as Layer;
      });
    this.layerListQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => (this.layerList = data.layers));
  }
  /**
   * Removes a layer from the form array
   *
   * @param index Index of the layer to remove
   */
  public onDeleteLayer(index: number) {
    this.layers.removeAt(index);
  }

  /** Opens a modal to add a new layer */
  public onAddLayer() {
    const dialogRef: MatDialogRef<SafeEditLayerModalComponent, MapLayerI> =
      this.dialog.open(SafeEditLayerModalComponent, {
        disableClose: true,
        ...(this.selectedLayer && { data: this.selectedLayer }),
      });

    dialogRef
      .afterClosed()
      .subscribe((selectedLayer: MapLayerI | undefined) => {
        if (!selectedLayer) return;
        // If is selected from existing layer we just push it to the map widget settings
        if (this.selectedLayer) {
          this.layers.push(createLayerForm(selectedLayer));
        } else {
          // Otherwise create a new one
          this.safeMapLayerService.addLayer(selectedLayer).subscribe({
            next: (result) => {
              if (result) {
                this.layers.push(createLayerForm(result));
                this.layerListQuery.refetch();
              }
              // Handle errors and snackbar to inform user of successful operation?
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      });
  }

  /**
   * Opens a modal to edit a layer
   *
   * @param index Index of the layer to edit
   */
  public onEditLayer(index: number) {
    const dialogRef: MatDialogRef<SafeEditLayerModalComponent, MapLayerI> =
      this.dialog.open(SafeEditLayerModalComponent, {
        disableClose: true,
        data: this.layers.at(index).value,
      });

    dialogRef
      .afterClosed()
      .subscribe((selectedLayer: MapLayerI | undefined) => {
        if (!selectedLayer) return;
        this.layers.at(index).patchValue(selectedLayer);
      });
  }

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param e Event emitted when a layer is reordered
   */
  public onListDrop(e: CdkDragDrop<MapLayerI[]>) {
    const movedElement = this.layers.at(e.previousIndex);
    this.layers.removeAt(e.previousIndex);
    this.layers.insert(e.currentIndex, movedElement);
  }

  /**
   * Trigger layer options modal an action after closing it
   */
  public onSelectFromLayerList() {
    // Reset after each modal opening
    this.layerForm?.reset();
    const dialogRef = this.dialog.open(this.layerOptionsModal);
    dialogRef.afterClosed().subscribe({
      next: (action: string) => {
        if (action !== 'discard') {
          this.onAddLayer();
        }
      },
    });
  }
}
