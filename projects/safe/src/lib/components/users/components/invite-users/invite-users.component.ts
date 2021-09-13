import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { Role, User } from '../../../../models/user.model';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeAddUserComponent } from '../add-user/add-user.component';

interface DialogData {
  roles: Role[];
  users: User[];
  positionAttributeCategories?: PositionAttributeCategory[];
}

const matches = (el: any, selector: any) => (el.matches || el.msMatchesSelector).call(el, selector);

@Component({
  selector: 'safe-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.scss']
})
export class SafeInviteUsersComponent implements OnInit {

  public gridData: GridDataResult = { data: [], total: 0 };
  public formGroup: FormGroup = new FormGroup({});
  private editedRowIndex = 0;
  private editionActive = false;
  private docClickSubscription: any;

  // === TEMPLATE REFERENCE TO KENDO GRID ===
  @ViewChild(GridComponent)
  private grid?: GridComponent;

  get positionAttributes(): FormArray | null {
    return this.formGroup.get('positionAttributes') as FormArray;
  }

  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SafeInviteUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }

  /**
   * Closes the modal.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    const invitedUsers = this.gridData.data.map(x => x.email);
    const dialogRef = this.dialog.open(SafeAddUserComponent, {
      panelClass: 'add-dialog',
      data: {
        roles: this.data.roles,
        users: this.data.users.filter(x => !invitedUsers.includes(x.username)),
        ...this.data.positionAttributeCategories && { positionAttributeCategories: this.data.positionAttributeCategories }
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.gridData.data.push(value);
      }
    });
  }

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
      role: [dataItem.role, Validators.required],
      ...this.data.positionAttributeCategories &&
      {
        positionAttributes: this.formBuilder.array(this.data.positionAttributeCategories.map((x, index) => {
          return this.formBuilder.group({
            value: [dataItem.positionAttributes[index].value || ''],
            category: [x.id, Validators.required]
          });
        }))
      }
    };
    return this.formBuilder.group(formGroup);
  }

  private onDocumentClick(e: any): void {
    if (this.formGroup && this.editionActive && this.formGroup.valid &&
      !matches(e.target, '#customGrid tbody *, #customGrid .k-grid-toolbar .k-button .k-animation-container')) {
        this.closeEditor();
    }
  }

  private closeEditor(): void {
    this.grid?.closeRow(this.editedRowIndex);
    this.grid?.cancelCell();
    this.editedRowIndex = 0;
    this.editionActive = false;
    this.formGroup = new FormGroup({});
  }
}
