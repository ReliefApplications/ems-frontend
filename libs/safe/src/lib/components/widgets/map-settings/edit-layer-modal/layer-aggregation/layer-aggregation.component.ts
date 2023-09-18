import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

/** Available reduction types */
const AVAILABLE_REDUCTION_TYPES = ['cluster'];

/**
 * Map layer aggregation settings component.
 */
@Component({
  selector: 'safe-layer-aggregation',
  templateUrl: './layer-aggregation.component.html',
  styleUrls: ['./layer-aggregation.component.scss'],
})
export class LayerAggregationComponent implements AfterViewInit {
  @Input() formGroup!: FormGroup;
  public reductionTypes = AVAILABLE_REDUCTION_TYPES;

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
