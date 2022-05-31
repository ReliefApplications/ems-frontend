import { Apollo } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetRolesQueryResponse, GET_ROLES } from '../../../graphql/queries';
import { Role } from '../../../models/user.model';

/**
 * Interface defining the structure of the data
 */
interface DialogData {
  access: any;
  application: string;
}

/**
 * This component is a form that allows you to edit the access rights of a user
 */
@Component({
  selector: 'safe-edit-access',
  templateUrl: './edit-access.component.html',
  styleUrls: ['./edit-access.component.scss'],
})
export class SafeEditAccessComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public roles: Role[] = [];

  // === REACTIVE FORM ===
  accessForm: FormGroup = new FormGroup({});

  /**
   * The constructor function is used to create a new instance of the SafeEditAccessComponent class
   *
   * @param formBuilder This is used to create the form.
   * @param apollo This is the Apollo service that we'll use to make our GraphQL
   * queries.
   * @param dialogRef This is the dialog that will be opened
   * @param {DialogData} data This is the data that is passed to the dialog when it is opened.
   */
  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<SafeEditAccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  /**
   * Gets list of roles, and builds the form
   */
  ngOnInit(): void {
    this.apollo
      .watchQuery<GetRolesQueryResponse>({
        query: GET_ROLES,
        variables: {
          application: this.data.application,
        },
      })
      .valueChanges.subscribe((res) => {
        this.roles = res.data.roles;
        this.loading = res.loading;
      });
    this.accessForm = this.formBuilder.group({
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
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
