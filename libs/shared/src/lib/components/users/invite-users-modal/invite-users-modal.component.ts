import { Component, Inject, ViewChild } from '@angular/core';
import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { Role } from '../../../models/user.model';
import { PositionAttributeCategory } from '../../../models/position-attribute-category.model';
import { FormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { DownloadService } from '../../../services/download/download.service';
import { TranslateService } from '@ngx-translate/core';
import { UploadEvent } from '@progress/kendo-angular-upload';
import { SnackbarService } from '@oort-front/ui';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { CommonModule } from '@angular/common';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { AddUserModule } from '../add-user/add-user.module';
import { TranslateModule } from '@ngx-translate/core';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { ButtonModule as uiButtonModule, TextareaModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';

/** Model fot the input data */
interface DialogData {
  roles: Role[];
  positionAttributeCategories?: PositionAttributeCategory[];
  uploadPath: string;
  downloadPath: string;
}

/** Invite users modal component */
@Component({
  standalone: true,
  selector: 'shared-invite-users-modal',
  templateUrl: './invite-users-modal.component.html',
  styleUrls: ['./invite-users-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    GroupModule,
    DropDownsModule,
    ButtonModule,
    ButtonsModule,
    AddUserModule,
    TranslateModule,
    UploadsModule,
    DialogModule,
    TextareaModule,
    uiButtonModule,
  ],
})
export class InviteUsersModalComponent extends UnsubscribeComponent {
  /** Grid data */
  public gridData: GridDataResult = { data: [], total: 0 };
  /** Form group */
  public formGroup!: ReturnType<typeof this.createFormGroup>;
  /** File size limit, in MB */
  public maxFileSize: number;
  /** Index of the edited row */
  private editedRowIndex = 0;
  /** Is the edition active */
  private editionActive = false;

  /** Reference to the grid */
  @ViewChild(GridComponent)
  private grid?: GridComponent;

  /** Reference to the file reader */
  @ViewChild('fileReader') fileReader: any;

  /** @returns The position attributes available */
  get positionAttributes(): UntypedFormArray | null {
    return this.formGroup.get('positionAttributes') as UntypedFormArray;
  }

  /**
   * Invite users modal component
   *
   * @param downloadService Shared download service
   * @param snackBar Shared snack bar service
   * @param fb Angular form builder service
   * @param dialog CDK Dialog service
   * @param dialogRef Dialog reference
   * @param translate Angular translation service
   * @param data Passed data
   * @param environment environment
   */
  constructor(
    private downloadService: DownloadService,
    private snackBar: SnackbarService,
    private fb: FormBuilder,
    public dialog: Dialog,
    public dialogRef: DialogRef<InviteUsersModalComponent>,
    public translate: TranslateService,
    @Inject(DIALOG_DATA) public data: DialogData,
    @Inject('environment') public environment: any
  ) {
    super();
    this.maxFileSize = environment.maxFileSize;
  }

  /**
   * Opens a modal to invite a new user.
   */
  async onAdd(): Promise<void> {
    const { AddUserComponent } = await import('../add-user/add-user.component');
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: {
        roles: this.data.roles,
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
