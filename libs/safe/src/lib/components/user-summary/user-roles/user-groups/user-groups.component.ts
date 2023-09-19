import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Group, User } from '../../../../models/user.model';
import { GET_GROUPS, GetGroupsQueryResponse } from '../../graphql/queries';
import { SnackbarService } from '@oort-front/ui';

/** Back-office groups section the user summary */
@Component({
  selector: 'safe-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss'],
})
export class UserGroupsComponent implements OnInit {
  public groups: Group[] = [];
  @Input() user!: User;
  selectedGroups!: ReturnType<typeof this.createFormControl>;
  @Output() edit = new EventEmitter();
  @Input() canEdit = false;

  /** Setter for the loading state */
  @Input() set loading(loading: boolean) {
    if (!this.canEdit) return;
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
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.selectedGroups = this.createFormControl();
    this.selectedGroups.valueChanges.subscribe((value) => {
      this.edit.emit({ groups: value });
    });

    this.loading = true;
    this.apollo
      .query<GetGroupsQueryResponse>({
        query: GET_GROUPS,
      })
      .subscribe({
        next: ({ data, loading }) => {
          if (data) {
            this.groups = data.groups;
          }
          this.loading = loading;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Create form control
   *
   * @returns form control
   */
  private createFormControl() {
    return this.fb.control({
      value: get(this.user, 'groups', []).map((x) => x.id),
      disabled: !this.canEdit,
    });
  }
}
