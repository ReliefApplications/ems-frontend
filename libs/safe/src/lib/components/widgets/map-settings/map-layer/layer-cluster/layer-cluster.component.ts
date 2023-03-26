import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { createClusterForm } from '../../map-forms';

/** Layer cluster settings */
@Component({
  selector: 'safe-layer-cluster',
  templateUrl: './layer-cluster.component.html',
  styleUrls: ['./layer-cluster.component.scss'],
})
export class LayerClusterComponent {
  public form: UntypedFormGroup;
  public expansivePanels = ['fields', 'label', 'popups'];

  /**
   * Creates an instance of LayerClusterComponent.
   */
  constructor() {
    this.form = createClusterForm();
  }
}
