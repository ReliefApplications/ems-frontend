import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { Role, User } from '../../../../models/user.model';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeAddUserComponent } from '../add-user/add-user.component';
import { NOTIFICATIONS } from '../../../../const/notifications';
import { SafeSnackBarService } from '../../../../services/snackbar.service';
import { SafeDownloadService } from '../../../../services/download.service';
import { TranslateService } from '@ngx-translate/core';
import { UploadEvent } from '@progress/kendo-angular-upload';

interface DialogData {
  roles: Role[];
  users: User[];
  positionAttributeCategories?: PositionAttributeCategory[];
  uploadPath: string;
  downloadPath: string;
}

@Component({
  selector: 'safe-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.scss'],
})
export class SafeInviteUsersComponent implements OnInit {
  public gridData: GridDataResult = { data: [], total: 0 };
  public formGroup: FormGroup = new FormGroup({});
  private editedRowIndex = 0;
  private editionActive = false;

  // === TEMPLATE REFERENCE TO KENDO GRID ===
  @ViewChild(GridComponent)
  private grid?: GridComponent;

  @ViewChild('fileReader') fileReader: any;

  get positionAttributes(): FormArray | null {
    return this.formGroup.get('positionAttributes') as FormArray;
  }

  constructor(
    private renderer: Renderer2,
    private downloadService: SafeDownloadService,
    private snackBar: SafeSnackBarService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SafeInviteUsersComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  /**
   * Closes the modal.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Opens a modal to invite a new user.
   */
  onAdd(): void {
    const invitedUsers = this.gridData.data.map((x) => x.email);
    const dialogRef = this.dialog.open(SafeAddUserComponent, {
      panelClass: 'add-dialog',
      data: {
        roles: this.data.roles,
        users: this.data.users.filter(
          (x) => !invitedUsers.includes(x.username)
        ),
        ...(this.data.positionAttributeCategories && {
          positionAttributeCategories: this.data.positionAttributeCategories,
        }),
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.gridData.data.push(value);
      }
    });
  }

  /**
   * Removes an user from the invitation list.
   *
   * @param index index of user to remove.
   */
  onRemove(index: number): void {
    this.gridData.data.splice(index, 1);
  }

  /**
   * Uploads a list of users as xlsx file.
   *
   * @param e Event of file upload.
   */
  onUpload(e: UploadEvent): void {
    e.preventDefault();
    this.gridData.data = [];
    if (e.files.length > 0) {
      const file = e.files[0].rawFile;
      if (file && this.isValidFile(file)) {
        this.downloadService.uploadFile(this.data.uploadPath, file).subscribe(
          (res) => {
            this.gridData.data = res;
          },
          (err) => {
            if (err.status === 400) {
              this.snackBar.openSnackBar(err.error, { error: true });
              this.resetFileInput();
            } else {
              this.snackBar.openSnackBar(NOTIFICATIONS.userImportFail, {
                error: true,
              });
              this.resetFileInput();
            }
          }
        );
      } else {
        if (e.files.length > 1) {
          this.snackBar.openSnackBar(NOTIFICATIONS.formatInvalid('xlsx'), {
            error: true,
          });
          this.resetFileInput();
        }
      }
    }
  }

  /**
   * Download template for users invite.
   */
  onDownload(): void {
    this.downloadService.getFile(
      this.data.downloadPath,
      `text/xlsx;charset=utf-8;`,
      'users_template.xlsx'
    );
  }

  /**
   * Deletes the file.
   */
  private resetFileInput(): void {
    this.fileReader.clearFiles();
  }

  /**
   * Closes the modal submitting the data.
   */
  onSubmit(): void {
    if (this.editionActive) {
      this.closeEditor();
    }
    this.dialogRef.close(this.gridData.data);
  }

  /**
   * Handles cell click events. Creates form group for edition.
   *
   * @param param0 cell click event.
   */
  public cellClickHandler({ isEdited, dataItem, rowIndex }: any): void {
    if (!this.editionActive) {
      this.formGroup = this.createFormGroup(dataItem);
      this.editionActive = true;
      this.editedRowIndex = rowIndex;
      this.grid?.editRow(rowIndex, this.formGroup);
    } else {
      if (rowIndex !== this.editedRowIndex) {
        this.closeEditor();
      }
    }
  }

  /**
   * Creates a form group for inline edition of a row.
   *
   * @param dataItem Row data.
   * @returns Form group created from row data.
   */
  public createFormGroup(dataItem: any): FormGroup {
    const formGroup: any = {
      email: [dataItem.email, Validators.required],
      role: [dataItem.role, Validators.required],
      ...(this.data.positionAttributeCategories && {
        positionAttributes: this.formBuilder.array(
          this.data.positionAttributeCategories.map((x, index) =>
            this.formBuilder.group({
              value: [dataItem.positionAttributes[index].value || ''],
              category: [x.id, Validators.required],
            })
          )
        ),
      }),
    };
    return this.formBuilder.group(formGroup);
  }

  /**
   * Closes opened form group.
   */
  private closeEditor(): void {
    this.grid?.closeRow(this.editedRowIndex);
    this.grid?.cancelCell();
    this.gridData.data.splice(this.editedRowIndex, 1, this.formGroup.value);
    this.editedRowIndex = 0;
    this.editionActive = false;
    this.formGroup = new FormGroup({});
  }

  /**
   * Check that the file can be considered as valid.
   *
   * @param file File to check extension of.
   * @returns does the file have correct extension.
   */
  private isValidFile(file: any): any {
    return file.name.endsWith('.xlsx');
  }
}
