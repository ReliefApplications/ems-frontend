import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../../models/application.model';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth/auth.service';

/** Component for the roles tab of the user summary */
@Component({
  selector: 'shared-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
})
export class UserRolesComponent implements OnInit {
  @Input() user!: User;
  @Input() application?: Application;

  @Output() edit = new EventEmitter();

  @Input() loading = false;
  public canSeeGroups = false;

  /**
   * Component for the roles tab of the user summary
   *
   * @param authService Shared auth service
   */
  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.canSeeGroups = await new Promise<boolean>((resolve) => {
      this.authService.user$.subscribe((user) => {
        // can_see_groups is a permission that is only available globally
        // therefore no need to check against the current application
        resolve(
          user?.permissions?.some((p) => p.type === 'can_see_groups') ?? false
        );
      });
    });
  }
}
