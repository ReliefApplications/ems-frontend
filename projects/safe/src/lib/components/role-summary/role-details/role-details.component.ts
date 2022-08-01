import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Role } from '../../../models/user.model';
import { Application } from '../../../models/application.model';

/**
 * General tab of Role Summary.
 * Contain title / description of role + list of users and permissions.
 */
@Component({
  selector: 'safe-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss'],
})
export class RoleDetailsComponent {
  @Input() role!: Role;
  @Input() application?: Application;
  @Input() loading = false;

  @Output() edit = new EventEmitter();

  /**
   * Emit an event with new role value
   *
   * @param value new role value
   */
  onUpdate(value: any): void {
    this.edit.emit(value);
  }
}
