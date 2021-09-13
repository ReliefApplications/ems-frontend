import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Role } from '../../../../models/user.model';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';

interface DialogData {
  roles: Role[];
  users: [];
  positionAttributeCategories?: PositionAttributeCategory[];
}

@Component({
  selector: 'safe-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.scss']
})
export class SafeInviteUsersComponent implements OnInit {

  public gridData: GridDataResult = { data: [], total: 0 };

  constructor(
    public dialogRef: MatDialogRef<SafeInviteUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.gridData = {
      data: [{
        email: 'test@gmail.com',
        role: '60338b030435210275157a4c'
      }],
      total: 1
    };
  }

  /**
   * Closes the modal.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
