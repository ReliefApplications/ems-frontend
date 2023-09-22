import { Apollo } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GetRolesQueryResponse, GET_ROLES } from './graphql/queries';
import { Role } from '../../../models/user.model';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

/**
 * Interface defining the structure of the data
 */
interface DialogData {
  access: any;
  application: string;
  objectTypeName: string;
}

/**
 * This component is a form that allows you to edit the access rights of a user
 */
@Component({
  selector: 'safe-edit-access',
  templateUrl: './edit-access.component.html',
  styleUrls: ['./edit-access.component.scss'],
})
export class SafeEditAccessComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public roles: Role[] = [];

  // === REACTIVE FORM ===
  accessForm = this.fb.group({
    canSee: [
      this.data.access.canSee
        ? this.data.access.canSee.map((x: any) => x.id)
        : null,
    ],
    canUpdate: [
      this.data.access.canUpdate
        ? this.data.access.canUpdate.map((x: any) => x.id)
        : null,
    ],
    canDelete: [
      this.data.access.canDelete
        ? this.data.access.canDelete.map((x: any) => x.id)
        : null,
    ],
  });

  /**
   * The constructor function is used to create a new instance of the SafeEditAccessComponent class
   *
   * @param fb This is used to create the form.
   * @param apollo This is the Apollo service that we'll use to make our GraphQL
   * queries.
   * @param dialogRef This is the dialog that will be opened
   * @param {DialogData} data This is the data that is passed to the dialog when it is opened.
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    public dialogRef: DialogRef<SafeEditAccessComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    super();
  }

  /**
   * Gets list of roles, and builds the form
   */
  ngOnInit(): void {
    this.apollo
      .query<GetRolesQueryResponse>({
        query: GET_ROLES,
        variables: {
          application: this.data.application,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.roles = data.roles;
      });
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
