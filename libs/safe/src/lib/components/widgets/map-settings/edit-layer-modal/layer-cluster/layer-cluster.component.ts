import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

/** Layer cluster settings */
@Component({
  selector: 'safe-layer-cluster',
  templateUrl: './layer-cluster.component.html',
  styleUrls: ['./layer-cluster.component.scss'],
})
export class LayerClusterComponent {
  @Input() formGroup!: FormGroup;
  public expansivePanels = ['fields', 'label', 'popups'];
}
