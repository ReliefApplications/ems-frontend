/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
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
import { ApplicationService } from 'libs/shared/src/lib/services/application/application.service';
import { ConfirmService } from 'libs/shared/src/lib/services/confirm/confirm.service';
import { DownloadService } from 'libs/shared/src/lib/services/download/download.service';
import { EmailService } from '../../../email/email.service';
import { DialogRef } from '@angular/cdk/dialog';
import { QueryBuilderService } from 'libs/shared/src/lib/services/query-builder/query-builder.service';

/**
 *
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
   *
   * @param dialogRef
   * @param EmailService
   * @param ApplicationService
   * @param FormBuilder
   * @param ConfirmService
   * @param AuthService
   * @param DownloadService
   * @param Dialog
   * @param TranslateService
   * @param ability
   * @param snackBar
   */
  constructor(
    public dialogRef: DialogRef<TemplateModalComponent>,
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
   *
   */
  handleNavigation() {
    this.emailService.datasetsForm.reset();
    this.showTemplateCreationWizard = false;
    this.getExistingTemplate();
    this.getCustomTemplates();
    this.dialogRef.close();
  }
}
