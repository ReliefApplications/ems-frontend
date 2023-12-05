import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

/** Layer cluster settings */
@Component({
  selector: 'shared-layer-cluster',
  templateUrl: './layer-cluster.component.html',
  styleUrls: ['./layer-cluster.component.scss'],
})
export class LayerClusterComponent {
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Available panels */
  public expansivePanels = ['fields', 'label', 'popups'];
}
