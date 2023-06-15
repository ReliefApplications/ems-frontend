import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Fields } from '../layer-fields/layer-fields.component';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

/** Available renderer types */
const AVAILABLE_RENDERER_TYPES = ['simple', 'heatmap', 'uniqueValue'];

/**
 * Layer styling component.
 */
@Component({
  selector: 'safe-layer-styling',
  templateUrl: './layer-styling.component.html',
  styleUrls: ['./layer-styling.component.scss'],
})
export class LayerStylingComponent {
  @Input() formGroup!: FormGroup;
  public rendererTypes = AVAILABLE_RENDERER_TYPES;
  @Input() fields$!: Observable<Fields[]>;

  // Display of map
  @Input() currentMapContainerRef!: BehaviorSubject<ViewContainerRef | null>;
  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainerRef!: ViewContainerRef;
  @Input() destroyTab$!: Subject<boolean>;

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
