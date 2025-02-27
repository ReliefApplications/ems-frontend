import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { EmailService } from '../../email.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationService } from '../../../../services/application/application.service';
import { firstValueFrom } from 'rxjs';
/**
 * Used to create custom template
 */
@Component({
  selector: 'ems-create-distribution',
  templateUrl: './create-distribution.component.html',
  styleUrls: ['./create-distribution.component.scss'],
})
export class CreateDistributionComponent implements OnInit, AfterViewInit {
  /** NAVIGATE TO MAIN EMAIL LIST SCREEN */
  @Output() navigateToEms: EventEmitter<any> = new EventEmitter();
  /** Reference to actions template */
  @ViewChild('actionsTmpl') actionsTemplate!: TemplateRef<any>;
  /** Application ID. */
  public applicationId = '';
  /** DL tile isDuplicate ? */
  public isDuplicateTitle = false;
  /** DL dialog data from Quick Action  */
  @Input() DL_QuickAction: any;

  /**
   * Angular Component constructor
   *
   * @param emailService email service
   * @param snackBar snackbar service
   * @param applicationService The service for handling applications.
   * @param translate translate service
   */
  constructor(
    public emailService: EmailService,
    private snackBar: SnackbarService,
    public applicationService: ApplicationService,
    private translate: TranslateService
  ) {
    if (!this.emailService.isCustomTemplateEdit) {
      this.emailService.layoutTitle = '';
      this.emailService.quickEmailDLQuery = { to: [], cc: [], bcc: [] };
    }
  }

  ngOnInit(): void {
    this.emailService.isToValid = false;
    this.emailService.isDLEdit = true;
    this.emailService.resetPreviewData();
    this.emailService.allPreviewData = [];
    this.emailService.disableNextActionBtn = true;
    this.applicationService.application$.subscribe((res: any) => {
      this.applicationId = res?.id;
    });
  }

  ngAfterViewInit(): void {
    this.emailService.resetPreviewData();
    this.emailService.emailDistributionList = [];
  }

  /**
   * Submits the form data to the email service.
   */
  async submit() {
    // this.emailService.checkDLToValid();
    const dlData = this.emailService?.DL_Data?.getRawValue();
    const emailDL = this.emailService.populateDistributionListForm(dlData);
    this.emailService.datasetsForm.setControl('emailDistributionList', emailDL);
    await this.emailService.validateNextButton();
    //Common service payload rebuild
    // const objData: any = cloneDeep(emailData);

    dlData.to.commonServiceFilter = this.emailService.setCommonServicePayload(
      dlData.to.commonServiceFilter.filter
    );
    dlData.cc.commonServiceFilter = this.emailService.setCommonServicePayload(
      dlData.cc.commonServiceFilter.filter
    );
    dlData.bcc.commonServiceFilter = this.emailService.setCommonServicePayload(
      dlData.bcc.commonServiceFilter.filter
    );
    if (this.emailService.isToValid) {
      const saveDL = dlData?.id
        ? await firstValueFrom(
            this.emailService.editDistributionList(dlData, dlData.id)
          )
        : await firstValueFrom(
            this.emailService.addDistributionList(dlData, this.applicationId)
          );
      if (!saveDL?.errors) {
        const isNew = !dlData?.id;
        this.snackBar.openSnackBar(
          this.translate.instant(
            isNew
              ? 'common.notifications.objectCreated'
              : 'common.notifications.objectUpdated',
            {
              type: this.translate.instant('common.distributionList.one'),
              value: '',
            }
          )
        );
        this.navigateToEms.emit({ template: saveDL });
      } else {
        this.snackBar.openSnackBar(
          saveDL?.errors ? saveDL?.errors[0]?.message : '',
          { error: true }
        );
        throw new Error(saveDL?.errors[0].message);
      }
    }
  }

  /**
   * Submits the form data to the email service.
   *
   * @returns Button is valid or not for save data
   */
  checkValidation() {
    const validateFlg =
      this.emailService?.distributionListName?.trim()?.length > 0 &&
      !this.emailService?.isDLNameDuplicate &&
      this.emailService?.isToValid;
    return !validateFlg;
  }
}
