import { Component, Input } from '@angular/core';
import { LAYER_TYPES } from '../../../../../models/layer.model';
import { LayerFormT } from '../../map-forms';

/** Component for the general layer properties */
@Component({
  selector: 'safe-layer-properties',
  templateUrl: './layer-properties.component.html',
  styleUrls: ['./layer-properties.component.scss'],
})
export class LayerPropertiesComponent {
  @Input() form!: LayerFormT;
  @Input() currentZoom!: number | undefined;

  public layerTypes = LAYER_TYPES;
}
