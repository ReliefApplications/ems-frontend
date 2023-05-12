import { Component } from '@angular/core';
import { Variant } from '@oort-front/ui';

/** Component for adding a new step in workflow */
@Component({
  selector: 'safe-add-step',
  templateUrl: './add-step.component.html',
  styleUrls: ['./add-step.component.scss'],
})
export class SafeAddStepComponent {
  // === ICON VARIANTS ===
  public colorVariant = Variant;
}
