import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SafeMapLayersService } from '../../../../../services/map/map-layers.service';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

/**
 * Fields interface
 */
export interface Fields {
  label: string;
  name: string;
  type: string;
  [key: string]: string;
}
/**
 * Map layer fields settings component.
 */
@Component({
  selector: 'safe-layer-fields',
  templateUrl: './layer-fields.component.html',
  styleUrls: ['./layer-fields.component.scss'],
})
export class LayerFieldsComponent implements AfterViewInit {
  @Input() fields$!: Observable<Fields[]>;

  // Display of map
  @Input() currentMapContainerRef!: BehaviorSubject<ViewContainerRef | null>;
  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainerRef!: ViewContainerRef;
  @Input() destroyTab$!: Subject<boolean>;

  /**
   * Creates an instance of LayerFieldsComponent.
   *
   * @param mapLayersService Shared map layer Service.
   */
  constructor(private mapLayersService: SafeMapLayersService) {}

  /**
   * Save value of the input
   *
   * @param event event of the input.
   * @param index index of the field.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  saveLabel(event: string, index: number): void {
    // if (event && this.fields[index]) {
    //   this.fields[index].label = event;
    // }
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
}
