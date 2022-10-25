import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Subscription } from 'rxjs';
import { Group, User } from '../../../../models/user.model';
import { SafeSnackBarService } from '../../../../services/snackbar/snackbar.service';
import { GET_GROUPS, GetGroupsQueryResponse } from '../../graphql/queries';

/** Back-office groups section the user summary */
@Component({
  selector: 'safe-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss'],
})
export class UserGroupsComponent implements OnInit, OnDestroy {
  public groups: Group[] = [];
  @Input() user!: User;
  selectedGroups!: FormControl;
  @Output() edit = new EventEmitter();
  private querySubscription?: Subscription;

  /** Setter for the loading state */
  @Input() set loading(loading: boolean) {
    if (loading) {
      this.selectedGroups?.disable({ emitEvent: false });
    } else {
      this.selectedGroups?.enable({ emitEvent: false });
    }
  }

  /**
   * Back-office groups section the user summary
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
    this.selectedGroups = this.fb.control(
      get(this.user, 'groups', []).map((x) => x.id)
    );
    this.selectedGroups.valueChanges.subscribe((value) => {
      this.edit.emit({ groups: value });
    });

    this.loading = true;
    this.apollo
      .query<GetGroupsQueryResponse>({
        query: GET_GROUPS,
      })
      .subscribe(
        (res) => {
          if (res.data) {
            this.groups = res.data.groups;
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
