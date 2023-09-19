import { Component, Input } from '@angular/core';

/**
 * This component is used to display the roles page in the platform
 */
@Component({
  selector: 'shared-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent {
  // === INPUT DATA ===
  @Input() inApplication = false;
}
