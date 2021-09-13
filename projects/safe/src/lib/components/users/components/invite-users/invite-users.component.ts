import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { Role } from '../../../../models/user.model';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public formGroup: FormGroup = new FormGroup({});
  private editedRowIndex = 0;

  // === TEMPLATE REFERENCE TO KENDO GRID ===
  @ViewChild(GridComponent)
  private grid?: GridComponent;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeInviteUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
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

  onAdd(): void { }

  onRemove(index: number): void {
    this.gridData.data.splice(index, 1);
  }

  onUpload(): void { }

  onDownload(): void { }

  public cellClickHandler({ isEdited, dataItem, rowIndex }: any): void {
    this.formGroup = this.createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    this.grid?.editRow(rowIndex, this.formGroup);
  }

  public createFormGroup(dataItem: any): FormGroup {
    const formGroup: any = {
      email: [dataItem.email, Validators.required],
      roles: [dataItem.roles, Validators.required]
    };
    // if ((this.data.positionAttributeCategories || []).length > 0) {
    //   formGroup.attributes = 
    // }
    return this.formBuilder.group(formGroup);
  }

  private closeEditor(): void {
    this.grid?.closeRow(this.editedRowIndex);
    this.grid?.cancelCell();
    this.editedRowIndex = 0;
    this.formGroup = new FormGroup({});
  }
}
