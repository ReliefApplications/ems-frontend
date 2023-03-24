import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

/** Available renderer types */
const AVAILABLE_RENDERER_TYPES = ['simple', 'heatmap'];

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
}
