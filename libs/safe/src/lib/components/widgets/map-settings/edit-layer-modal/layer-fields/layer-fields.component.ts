import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Fields } from '../../../../../models/layer.model';

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

  @Output() updatedField: EventEmitter<Fields> = new EventEmitter();

  /**
   * Save value of the input
   *
   * @param event event of the input.
   * @param field field to update.
   */
  saveLabel(event: string, field: Fields): void {
    if (event) {
      this.updatedField.emit({ ...field, label: event });
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
}
