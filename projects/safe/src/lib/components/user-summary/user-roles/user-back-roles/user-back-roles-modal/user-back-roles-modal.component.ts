import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

/**
 * This interface describes the structure of the data to be displayed in the modal
 */
interface DialogData {
  roles: any[];
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
  public roles: any[];
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
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService
  ) {
    this.title = 'Select roles';
    this.cancelText = this.translate.instant(
      'components.userBackRolesModal.cancel'
    );
    this.confirmText = this.translate.instant(
      'components.userBackRolesModal.confirm'
    );
    this.confirmColor = 'primary';
    this.roles = data.roles;
  }

  ngOnInit(): void {}
}
