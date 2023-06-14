import { Component, Input } from '@angular/core';
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
}
