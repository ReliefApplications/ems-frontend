import { Component, Input } from '@angular/core';
import { LayerFormT } from '../../map-forms';
import { DomPortal } from '@angular/cdk/portal';

/** Component for the general layer properties */
@Component({
  selector: 'shared-layer-properties',
  templateUrl: './layer-properties.component.html',
  styleUrls: ['./layer-properties.component.scss'],
})
export class LayerPropertiesComponent {
  /** Current form group */
  @Input() form!: LayerFormT;
  /** Map dom portal */
  @Input() mapPortal?: DomPortal;
  /** Current map zoom */
  @Input() currentZoom!: number | undefined;
}
