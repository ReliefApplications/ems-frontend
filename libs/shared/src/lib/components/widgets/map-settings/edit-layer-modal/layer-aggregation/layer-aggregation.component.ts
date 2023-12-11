import { DomPortal } from '@angular/cdk/portal';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

/** Available reduction types */
const AVAILABLE_REDUCTION_TYPES = ['cluster'];

/**
 * Map layer aggregation settings component.
 */
@Component({
  selector: 'shared-layer-aggregation',
  templateUrl: './layer-aggregation.component.html',
  styleUrls: ['./layer-aggregation.component.scss'],
})
export class LayerAggregationComponent {
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Map dom portal */
  @Input() mapPortal?: DomPortal;
  /** Available reduction types */
  public reductionTypes = AVAILABLE_REDUCTION_TYPES;
}
