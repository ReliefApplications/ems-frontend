import { Component, Input } from '@angular/core';

/**
 * This component is used to display the roles page in the platform
 */
@Component({
  selector: 'safe-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class SafeRolesComponent {
  // === INPUT DATA ===
  @Input() inApplication = false;
}
