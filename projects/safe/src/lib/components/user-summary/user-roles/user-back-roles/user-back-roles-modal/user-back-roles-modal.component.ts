import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Role, User } from '../../../../../models/user.model';

/**
 * This interface describes the structure of the data to be displayed in the modal
 */
interface DialogData {
  selectedRoles: FormControl;
  roles: Role[];
  edit: any;
}

/**
 * This component is used to change the user roles
 */
@Component({
  selector: 'safe-user-back-roles-modal',
  templateUrl: './user-back-roles-modal.component.html',
  styleUrls: ['./user-back-roles-modal.component.scss'],
})
export class SafeUserBackRolesModalComponent implements OnInit {
  public edit: any;
  public selectedRoles: FormControl;
  public roles: Role[];
  public title: string;
  public cancelText: string;
  public confirmText: string;
  public confirmColor: string;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param data The data to be displayed in the modal
   * @param translate The translating service used to translate the different texts except the content of the modal
   * @param dialogRef The current dialog reference
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<SafeUserBackRolesModalComponent>
  ) {
    this.title = this.translate.instant(
      'components.user.summary.roles.updateUserRoles'
    );
    this.cancelText = this.translate.instant('kendo.editor.dialogCancel');
    this.confirmText = this.translate.instant('kendo.editor.dialogUpdate');
    this.confirmColor = 'primary';

    this.selectedRoles = data.selectedRoles;
    this.selectedRoles.enable();
    this.roles = data.roles;
    this.edit = data.edit;
  }

  ngOnInit(): void {}

  /**
   * Update selected roles
   */
  onUpdate(): void {
    const update = { roles: this.selectedRoles.value };
    console.log(update);
    this.edit.emit(update);
    console.log('UPDATE');
    this.dialogRef.close();
  }
}
