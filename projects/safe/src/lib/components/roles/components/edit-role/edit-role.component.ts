import {Apollo} from 'apollo-angular';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Channel } from '../../../../models/channel.model';
import {
  GetPermissionsQueryResponse, GET_PERMISSIONS,
  GetChannelsQueryResponse, GET_CHANNELS } from '../../../../graphql/queries';
import { Permission, Role } from '../../../../models/user.model';

@Component({
  selector: 'safe-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
/*  Modal to add a role.
*/
export class SafeEditRoleComponent implements OnInit {

  // === DATA ===
  public permissions: Permission[] = [];
  public channels: Channel[] = [];

  // === REACTIVE FORM ===
  roleForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeEditRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      role: Role,
      application: boolean
    },
    private apollo: Apollo
  ) { }

  /*  Load permissions and build the form.
  */
  ngOnInit(): void {
    this.apollo.watchQuery<GetPermissionsQueryResponse>({
      query: GET_PERMISSIONS,
      variables: {
        application: this.data.application
      }
    }).valueChanges.subscribe(res => {
      this.permissions = res.data.permissions;
    });
    this.apollo.watchQuery<GetChannelsQueryResponse>({
      query: GET_CHANNELS,
    }).valueChanges.subscribe(res => {
      this.channels = res.data.channels;
    });
    this.roleForm = this.formBuilder.group({
      title: [this.data.role.title, Validators.required],
      permissions: [this.data.role.permissions ? this.data.role.permissions.map(x => x.id) : null],
      channels: [this.data.role.channels ? this.data.role.channels.map(x => x.id) : null]
    });
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
