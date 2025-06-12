import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogRef, Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import {
  DialogModule,
  FormWrapperModule,
  IconModule,
  SnackbarService,
  SpinnerModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { EmailService } from '../../../email/email.service';
import { ApplicationService } from '../../../../services/application/application.service';
import { EmailComponent } from '../../../email/email.component';
import { EmailModule } from '../../../email/email.module';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { ConfirmService } from '../../../../services/confirm/confirm.service';
import {
  AppAbility,
  AuthService,
} from '../../../../services/auth/auth.service';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { DownloadService } from '@oort-front/core';

/** Model for the data input */
interface DialogData {
  resource: any;
  distributionListNames: string[];
  isEdit?: boolean;
}
/**
 * Modal to edit distribution list
 */
@Component({
  standalone: true,
  imports: [
    EmailModule,
    TooltipModule,
    DialogModule,
    IconModule,
    FormWrapperModule,
    SpinnerModule,
    TableModule,
    ButtonsModule,
    InputsModule,
    DateInputsModule,
    InputsModule,
    DropDownsModule,
    LabelModule,
    LayoutModule,
    UploadsModule,
    CommonModule,
  ],
  selector: 'shared-distribution-modal',
  templateUrl: './distribution-modal.component.html',
  styleUrls: ['./distribution-modal.component.scss'],
})
export class DistributionModalComponent extends EmailComponent {
  /**
   * Custom template modal edition.
   *
   * @param dialogRef CDK Dialog reference.
   * @param emailService Email service.
   * @param applicationService Shared application service.
   * @param fb Angular form builder.
   * @param confirmService Shared confirmation service.
   * @param authService Shared authentication service.
   * @param downloadService Shared download service.
   * @param dialog CDK Dialog service.
   * @param translate Angular translation service.
   * @param ability App Ability object.
   * @param snackBar Shared snackbar service.
   * @param queryBuilder Shared query builder service.
   * @param data Dialog Data
   */
  constructor(
    public dialogRef: DialogRef<any>,
    emailService: EmailService,
    applicationService: ApplicationService,
    fb: FormBuilder,
    confirmService: ConfirmService,
    authService: AuthService,
    downloadService: DownloadService,
    dialog: Dialog,
    translate: TranslateService,
    ability: AppAbility,
    snackBar: SnackbarService,
    queryBuilder: QueryBuilderService,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    super(
      emailService,
      applicationService,
      fb,
      snackBar,
      confirmService,
      translate,
      authService,
      downloadService,
      ability,
      queryBuilder,
      dialog
    );
  }

  /**
   * Handles custom template navigation
   *
   * @param event data from the emitter
   */
  handleNavigation(event: any) {
    this.emailService.datasetsForm.reset();
    this.showTemplateCreationWizard = false;
    this.getExistingTemplate();
    this.getCustomTemplates();
    this.dialogRef.close({
      result: event?.template?.data?.addEmailDistributionList || null,
    });
  }
}
