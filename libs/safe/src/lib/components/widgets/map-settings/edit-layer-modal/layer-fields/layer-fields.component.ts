import { Component, Input } from '@angular/core';

/**
 * Fields interface
 */
interface Fields {
  label: string;
  name: string;
  type: string;
}
/**
 * Map layer fields settings component.
 */
@Component({
  selector: 'safe-layer-fields',
  templateUrl: './layer-fields.component.html',
  styleUrls: ['./layer-fields.component.scss'],
})
export class LayerFieldsComponent {
  @Input() fields: Fields[] = [];
  /**
   * Save value of the input
   *
   * @param event event of the input.
   * @param index index of the field.
   */
  saveLabel(event: string, index: number): void {
    if (event && this.fields[index]) {
      this.fields[index].label = event;
    }
  }
}
