import { Apollo } from 'apollo-angular';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { GET_ROLES } from './graphql/queries';
import { Role, RolesQueryResponse } from '../../../models/user.model';
import { takeUntil } from 'rxjs/operators';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

/**
 * Interface defining the structure of the data
 */
export interface AccessData {
  access: any;
  application: string;
  objectTypeName: string;
  accessData?: AccessData;
}

/**
 * This component is a form that allows you to edit the access rights of a user
 */
@Component({
  selector: 'shared-edit-access',
  templateUrl: './edit-access.component.html',
  styleUrls: ['./edit-access.component.scss'],
})
export class EditAccessComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Component is used as modal or not? */
  public useModal!: boolean;
  /** Available roles */
  public roles: Role[] = [];
  /** Name of the content type */
  public contentType!: string;
  /** Application id */
  public applicationId?: string;
  /** Reactive form */
  public accessForm!: ReturnType<typeof this.createAccessForm>;
  /** Event to update the parent component of updates */
  @Output() updateAccess: EventEmitter<any> = new EventEmitter();

  /**
   * The constructor function is used to create a new instance of the EditAccessComponent class
   *
   * @param fb This is used to create the form.
   * @param apollo This is the Apollo service that we'll use to make our GraphQL
   * queries.
   * @param dialogRef This is the dialog that will be opened
   * @param {AccessData} data This is the data that is passed to the dialog when it is opened.
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    public dialogRef: DialogRef<EditAccessComponent>,
    @Inject(DIALOG_DATA) public data: AccessData
  ) {
    super();
    // If dialog opened from the View settings modal modal
    if (this.data.accessData) {
      this.contentType = this.data.accessData.objectTypeName;
      this.applicationId = this.data.accessData.application;
      this.useModal = false;
    } else {
      // If opening its own modal and using ui-dialog
      this.contentType = this.data.objectTypeName;
      this.applicationId = this.data.application;
      this.useModal = true;
    }
  }

  /**
   * Gets list of roles, and builds the form
   */
  ngOnInit(): void {
    this.accessForm = this.createAccessForm(
      this.useModal ? this.data : (this.data.accessData as AccessData)
    );
    this.apollo
      .query<RolesQueryResponse>({
        query: GET_ROLES,
        variables: {
          application: this.applicationId,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.roles = data.roles;
      });

    if (!this.useModal) {
      this.accessForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.updateAccess.emit(value);
          }
        });
    }
  }

  /**
   * Closes the modal without sending any data.
   */
  public onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Create the access form.
   *
   * @param data access data to get the info from
   * @returns Form group
   */
  private createAccessForm(data: AccessData) {
    return this.fb.group({
      canSee: [
        data.access.canSee ? data.access.canSee.map((x: any) => x.id) : null,
      ],
      canUpdate: [
        data.access.canUpdate
          ? data.access.canUpdate.map((x: any) => x.id)
          : null,
      ],
      canDelete: [
        data.access.canDelete
          ? data.access.canDelete.map((x: any) => x.id)
          : null,
      ],
    });
  }
}
