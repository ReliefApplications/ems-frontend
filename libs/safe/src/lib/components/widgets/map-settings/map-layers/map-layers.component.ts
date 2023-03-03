import { Component, Input } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

/**
 * Layers configuration component of Map Widget.
 */
@Component({
  selector: 'safe-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.scss'],
})
export class MapLayersComponent {
  @Input() selectedFields: any[] = [];
  @Input() formattedSelectedFields: any[] = [];

  /**
   * Get Online Layers of map as Form Control.
   *
   * @returns Form control
   */
  get onlineLayers(): UntypedFormControl {
    return this.form.get('onlineLayers') as UntypedFormControl;
  }

  /**
   * Get clorophlets configuration of map as Form Array.
   *
   * @returns Form Array
   */
  get clorophlets(): UntypedFormArray {
    return this.form.get('clorophlets') as UntypedFormArray;
  }

  @Input() form!: UntypedFormGroup;
}
