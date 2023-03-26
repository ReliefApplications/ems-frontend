import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

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
export class LayerAggregationComponent {
  @Input() formGroup!: FormGroup;
  public reductionTypes = AVAILABLE_REDUCTION_TYPES;
}
