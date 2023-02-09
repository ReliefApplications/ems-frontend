import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { LAYER_TYPES } from '../../map-layers.component';

/** Component for the general layer properties */
@Component({
  selector: 'safe-layer-properties',
  templateUrl: './layer-properties.component.html',
  styleUrls: ['./layer-properties.component.scss'],
})
export class LayerPropertiesComponent {
  @Input() form!: UntypedFormGroup;
  @Input() currentZoom!: number;

  public layerTypes = LAYER_TYPES;
}
