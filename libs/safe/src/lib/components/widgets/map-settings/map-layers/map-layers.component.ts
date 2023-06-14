import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { AddLayerModalComponent } from '../add-layer-modal/add-layer-modal.component';
import { SafeMapLayersService } from '../../../../services/map/map-layers.service';
import { LayerModel } from '../../../../models/layer.model';
import { LayerType } from '../../../ui/map/interfaces/layer-settings.type';
import { Dialog } from '@angular/cdk/dialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

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
  implements OnInit, OnChanges
{
  @Input() layerIds!: string[];
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();
  @Output() editLayer = new EventEmitter<LayerModel>();
  @Output() deleteLayer = new EventEmitter<string>();
  @Input() currentMapContainerRef!: BehaviorSubject<ViewContainerRef | null>;

  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainerRef!: ViewContainerRef;

  @Input() destroyTab$!: Subject<boolean>;

  // Table
  public mapLayers: Array<LayerModel> = new Array<LayerModel>();
  public displayedColumns = ['name', 'actions'];

  /**
   * Layers configuration component of Map Widget.
   *
   * @param dialog service for opening modals
   * @param mapLayersService Shared map layers service
   */
  constructor(
    private dialog: Dialog,
    private mapLayersService: SafeMapLayersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.updateLayerList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.layerIds) {
      this.layerIds = changes.layerIds.currentValue;
      this.updateLayerList();
    }
  }

  ngAfterViewInit(): void {
    this.currentMapContainerRef
      .pipe(takeUntil(this.destroyTab$))
      .subscribe((viewContainerRef) => {
        if (viewContainerRef) {
          if (viewContainerRef !== this.mapContainerRef) {
            const view = viewContainerRef.detach();
            if (view) {
              this.mapContainerRef.insert(view);
              this.currentMapContainerRef.next(this.mapContainerRef);
            }
          }
        }
      });
  }

  /**
   * Update layer list for Layers tab
   */
  private updateLayerList(): void {
    // todo: add filtering
    this.mapLayersService.getLayers().subscribe((layers) => {
      this.mapLayers = layers.filter((x) => this.layerIds.includes(x.id));
    });
  }

  /**
   * Removes a layer from the form array
   *
   * @param index Index of the layer to remove
   */
  public onDeleteLayer(index: number) {
    this.deleteLayer.emit(this.mapLayers[index].id);
  }

  /**
   * Opens a modal to add a new layer
   *
   * @param type type of layer
   */
  public async onAddLayer(type: LayerType = 'FeatureLayer') {
    this.editLayer.emit({
      type,
    } as LayerModel);
    const { EditLayerModalComponent } = await import(
      '../edit-layer-modal/edit-layer-modal.component'
    );
    const dialogRef = this.dialog.open(EditLayerModalComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        layer: { type } as LayerModel,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        console.log(value);
      }
    });
  }

  /**
   * Open dialog to select existing layer.
   */
  public onSelectLayer() {
    const dialogRef = this.dialog.open(AddLayerModalComponent, {
      disableClose: true,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      if (id) {
        this.onEditLayer(id as string);
      }
    });
  }

  /**
   * Opens a modal to edit a layer
   *
   * @param id id of layer to edit
   */
  public onEditLayer(id: string) {
    this.mapLayersService
      .getLayerById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (layer) => {
        this.editLayer.emit(layer);
        const { EditLayerModalComponent } = await import(
          '../edit-layer-modal/edit-layer-modal.component'
        );
        const dialogRef = this.dialog.open(EditLayerModalComponent, {
          disableClose: true,
          autoFocus: false,
          data: {
            layer,
          },
        });
        dialogRef.closed
          .pipe(takeUntil(this.destroy$))
          .subscribe((value: any) => {
            if (value) {
              console.log(value);
            }
          });
      });
  }

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param e Event emitted when a layer is reordered
   */
  public onListDrop(e: CdkDragDrop<LayerModel[]>) {
    moveItemInArray(this.mapLayers, e.previousIndex, e.currentIndex);
    // this.layerTable.renderRows();
  }
}
