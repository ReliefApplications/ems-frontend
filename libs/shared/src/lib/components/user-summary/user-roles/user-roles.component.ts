import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../../models/application.model';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth/auth.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

/** Component for the roles tab of the user summary */
@Component({
  selector: 'shared-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
})
export class UserRolesComponent extends UnsubscribeComponent implements OnInit {
  /** User */
  @Input() user!: User;
  /** Application */
  @Input() application?: Application;

  /** Event emitter for the edit event */
  @Output() edit = new EventEmitter();

  /** Whether the component is loading or not */
  @Input() loading = false;
  /** Whether groups can be seen or not */
  public canSeeGroups = false;

  /**
   * Component for the roles tab of the user summary
   *
   * @param authService Shared auth service
   */
  constructor(private authService: AuthService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.canSeeGroups = await new Promise<boolean>((resolve) => {
      this.authService.user$
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          // can_see_groups is a permission that is only available globally
          // therefore no need to check against the current application
          resolve(
            user?.permissions?.some((p) => p.type === 'can_see_groups') ?? false
          );
        });
    });
  }
}
