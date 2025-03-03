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
  @Input() quickActionDistribution: any;

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
      this.emailService.quickEmailDistributionListQuery = {
        to: [],
        cc: [],
        bcc: [],
      };
    }
  }

  ngOnInit(): void {
    this.emailService.isToValid = false;
    this.emailService.isDistributionListEdit = true;
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
    const distributionListData =
      this.emailService?.distributionListData?.getRawValue();
    const emailDistribution =
      this.emailService.populateDistributionListForm(distributionListData);
    this.emailService.datasetsForm.setControl(
      'emailDistributionList',
      emailDistribution
    );
    await this.emailService.validateNextButton();

    //Check or the filter resource if no fields then send it as blank
    ['to', 'cc', 'bcc'].forEach((key) => {
      if (distributionListData[key]?.query?.fields?.length === 0) {
        distributionListData[key].query.name = '';
        distributionListData[key].resource = '';
      }
    });

    //Common service payload rebuild
    distributionListData.to.commonServiceFilter =
      this.emailService.setCommonServicePayload(
        distributionListData.to.commonServiceFilter.filter
      );
    distributionListData.cc.commonServiceFilter =
      this.emailService.setCommonServicePayload(
        distributionListData.cc.commonServiceFilter.filter
      );
    distributionListData.bcc.commonServiceFilter =
      this.emailService.setCommonServicePayload(
        distributionListData.bcc.commonServiceFilter.filter
      );
    if (this.emailService.isToValid) {
      const saveDistribution = distributionListData?.id
        ? await firstValueFrom(
            this.emailService.editDistributionList(
              distributionListData,
              distributionListData.id
            )
          )
        : await firstValueFrom(
            this.emailService.addDistributionList(
              distributionListData,
              this.applicationId
            )
          );
      if (!saveDistribution?.errors) {
        const isNew = !distributionListData?.id;
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
        this.navigateToEms.emit({ template: saveDistribution });
      } else {
        this.snackBar.openSnackBar(
          saveDistribution?.errors ? saveDistribution?.errors[0]?.message : '',
          { error: true }
        );
        throw new Error(saveDistribution?.errors[0].message);
      }
    }
  }

  /**
   * Submits the form data to the email service.
   *
   * @returns Button is valid or not for save data
   */
  checkValidation() {
    if (!this.emailService?.isToValid) {
      const distributionListData =
        this.emailService.distributionListData.getRawValue();
      this.emailService.isToValid =
        distributionListData?.to?.inputEmails?.length > 0 ||
        (distributionListData?.to?.query?.fields?.length > 0 &&
          distributionListData?.to?.query?.fields?.filter(
            (x: any) => x?.fields?.length === 0
          ).length === 0) ||
        distributionListData?.to?.commonServiceFilter?.filter?.filters?.filter(
          (x: any) => x?.field || x?.value
        )?.length > 0;
    }
    const validateFlg =
      this.emailService?.distributionListName?.trim()?.length > 0 &&
      !this.emailService?.isDistributionListNameDuplicate &&
      this.emailService?.isToValid;
    return !validateFlg;
  }
}
