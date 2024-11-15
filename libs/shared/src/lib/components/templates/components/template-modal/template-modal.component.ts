import { Component } from '@angular/core';
import {
  DialogModule,
  FormWrapperModule,
  IconModule,
  SnackbarService,
  SpinnerModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { EmailModule } from '../../../../../../../../libs/shared/src/lib/components/email/email.module';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { CommonModule } from '@angular/common';
import { EmailComponent } from '../../../email/email.component';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  AppAbility,
  AuthService,
} from '../../../../services/auth/auth.service';
import { Dialog } from '@angular/cdk/dialog';
import { ApplicationService } from '../../../../services/application/application.service';
import { ConfirmService } from '../../../../services/confirm/confirm.service';
import { DownloadService } from '../../../../services/download/download.service';
import { EmailService } from '../../../email/email.service';
import { DialogRef } from '@angular/cdk/dialog';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';

/**
 * Custom template modal edition.
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
  selector: 'shared-template-modal',
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.scss'],
})
export class TemplateModalComponent extends EmailComponent {
  /**
   * Custom template modal edition.
   *
   * @param dialogRef CDK Dialog reference.
   * @param EmailService Email service.
   * @param ApplicationService Shared application service.
   * @param FormBuilder Angular form builder.
   * @param ConfirmService Shared confirmation service.
   * @param AuthService Shared authentication service.
   * @param DownloadService Shared download service.
   * @param Dialog CDK Dialog service.
   * @param TranslateService Angular translation service.
   * @param ability App Ability object.
   * @param snackBar Shared snackbar service.
   * @param queryBuilder Shared query builder service.
   */
  constructor(
    public dialogRef: DialogRef<any>,
    EmailService: EmailService,
    ApplicationService: ApplicationService,
    FormBuilder: FormBuilder,
    ConfirmService: ConfirmService,
    AuthService: AuthService,
    DownloadService: DownloadService,
    Dialog: Dialog,
    TranslateService: TranslateService,
    ability: AppAbility,
    snackBar: SnackbarService,
    queryBuilder: QueryBuilderService
  ) {
    super(
      EmailService,
      ApplicationService,
      FormBuilder,
      snackBar,
      ConfirmService,
      TranslateService,
      AuthService,
      DownloadService,
      ability,
      queryBuilder,
      Dialog
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
      result: event.template,
    });
  }
}
