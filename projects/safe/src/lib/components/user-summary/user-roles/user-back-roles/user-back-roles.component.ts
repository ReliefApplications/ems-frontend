import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Role, User } from '../../../../models/user.model';
import { GetRolesQueryResponse, GET_ROLES } from '../../graphql/queries';
import { SafeSnackBarService } from '../../../../services/snackbar/snackbar.service';
import { Subscription } from 'rxjs';

/** Back-office roles section the user summary */
@Component({
  selector: 'safe-user-back-roles',
  templateUrl: './user-back-roles.component.html',
  styleUrls: ['./user-back-roles.component.scss'],
})
export class UserBackRolesComponent implements OnInit, OnDestroy {
  public roles: Role[] = [];
  @Input() user!: User;
  selectedRoles!: FormControl;
  @Output() edit = new EventEmitter();
  private querySubscription?: Subscription;

  /** Setter for the loading state */
  @Input() set loading(loading: boolean) {
    if (loading) {
      this.selectedRoles?.disable({ emitEvent: false });
    } else {
      this.selectedRoles?.enable({ emitEvent: false });
    }
  }

  /**
   * Back-office roles section the user summary
   *
   * @param fb Angular form builder
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService
  ) {}

  ngOnInit(): void {
    this.selectedRoles = this.fb.control(
      get(this.user, 'roles', [])
        .filter((x: Role) => !x.application)
        .map((x) => x.id)
    );
    this.selectedRoles.valueChanges.subscribe((value) => {
      this.edit.emit({ roles: value });
    });

    this.loading = true;
    this.querySubscription = this.apollo
      .query<GetRolesQueryResponse>({
        query: GET_ROLES,
      })
      .subscribe(
        (res) => {
          if (res.data) {
            this.roles = res.data.roles;
          }
          this.loading = res.loading;
        },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        }
      );
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
