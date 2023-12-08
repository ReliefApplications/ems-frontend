import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Fields } from '../../../../../models/layer.model';
import { DomPortal } from '@angular/cdk/portal';

/**
 * Map layer fields settings component.
 */
@Component({
  selector: 'shared-layer-fields',
  templateUrl: './layer-fields.component.html',
  styleUrls: ['./layer-fields.component.scss'],
})
export class LayerFieldsComponent {
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** Map dom portal */
  @Input() mapPortal?: DomPortal;
  /** Update field event emitter */
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
}
