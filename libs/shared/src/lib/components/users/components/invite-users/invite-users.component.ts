import { Component, Inject, ViewChild } from '@angular/core';
import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { Role, User } from '../../../../models/user.model';
import { PositionAttributeCategory } from '../../../../models/position-attribute-category.model';
import { FormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { DownloadService } from '../../../../services/download/download.service';
import { TranslateService } from '@ngx-translate/core';
import { UploadEvent } from '@progress/kendo-angular-upload';
import { SnackbarService } from '@oort-front/ui';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

/** Model fot the input data */
interface DialogData {
  roles: Role[];
  users: User[];
  positionAttributeCategories?: PositionAttributeCategory[];
  uploadPath: string;
  downloadPath: string;
}

/** Component for inviting users */
@Component({
  selector: 'shared-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.scss'],
})
export class InviteUsersComponent extends UnsubscribeComponent {
  public gridData: GridDataResult = { data: [], total: 0 };
  public formGroup!: ReturnType<typeof this.createFormGroup>;
  private editedRowIndex = 0;
  private editionActive = false;

  // === TEMPLATE REFERENCE TO KENDO GRID ===
  @ViewChild(GridComponent)
  private grid?: GridComponent;

  @ViewChild('fileReader') fileReader: any;

  /** @returns The position attributes available */
  get positionAttributes(): UntypedFormArray | null {
    return this.formGroup.get('positionAttributes') as UntypedFormArray;
  }

  /**
   * Constructor of the component
   *
   * @param downloadService The download service
   * @param snackBar The snack bar service
   * @param fb The form builder service
   * @param dialog The Dialog service
   * @param dialogRef The reference to a Dialog
   * @param translate The translation service
   * @param data The input data of the component
   */
  constructor(
    private downloadService: DownloadService,
    private snackBar: SnackbarService,
    private fb: FormBuilder,
    public dialog: Dialog,
    public dialogRef: DialogRef<InviteUsersComponent>,
    public translate: TranslateService,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    super();
  }

  /**
   * Opens a modal to invite a new user.
   */
  async onAdd(): Promise<void> {
    const invitedUsers = this.gridData.data.map((x) => x.email);
    const { AddUserComponent } = await import('../add-user/add-user.component');
    const dialogRef = this.dialog.open(AddUserComponent, {
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
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
        this.downloadService.uploadFile(this.data.uploadPath, file).subscribe({
          next: (res) => {
            this.gridData.data = this.gridData.data.concat(res);
          },
          error: (err) => {
            if (err.status === 400) {
              this.snackBar.openSnackBar(err.error, { error: true });
              this.resetFileInput();
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'models.user.notifications.userImportFail'
                ),
                {
                  error: true,
                }
              );
              this.resetFileInput();
            }
          },
        });
      } else {
        if (e.files.length > 1) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.formatInvalid', {
              format: 'xlsx',
            }),
            { error: true }
          );
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
    this.dialogRef.close(this.gridData.data as any);
  }

  /**
   * Handles cell click events. Creates form group for edition.
   *
   * @param param0 cell click event.
   * @param param0.dataItem The data of the item
   * @param param0.rowIndex The index of the current row
   */
  public cellClickHandler({ dataItem, rowIndex }: any): void {
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
  public createFormGroup(dataItem: any) {
    return this.fb.group({
      email: [dataItem.email, Validators.required],
      role: [dataItem.role, Validators.required],
      ...(this.data.positionAttributeCategories && {
        positionAttributes: this.fb.array(
          this.data.positionAttributeCategories.map((x, index) =>
            this.fb.group({
              value: [dataItem.positionAttributes[index].value || ''],
              category: [x.id, Validators.required],
            })
          )
        ),
      }),
    });
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
    this.formGroup.reset();
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
