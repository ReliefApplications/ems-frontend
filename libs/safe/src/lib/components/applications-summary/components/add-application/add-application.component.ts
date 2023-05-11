import { Component } from '@angular/core';
import { Variant } from '@oort-front/ui';

/**
 * This component is used to display the add application button
 */
@Component({
  selector: 'safe-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.scss'],
})
export class SafeAddApplicationComponent {
  // === COLOR VARIANT ===
  public colorVariant = Variant;
}
