import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogModule, SpinnerModule } from '@oort-front/ui';
import { Component, OnInit, Inject } from '@angular/core';
import { SurveyModule } from 'survey-angular-ui';
import { CommonModule } from '@angular/common';
import { SurveyModel } from 'survey-core';

/**
 * Modal that displays a draft record saved
 */
@Component({
  standalone: true,
  imports: [CommonModule, DialogModule, SurveyModule, SpinnerModule],
  selector: 'shared-draft-record-modal',
  templateUrl: './draft-record-modal.component.html',
  styleUrls: ['./draft-record-modal.component.scss'],
})
export class DraftRecordModalComponent implements OnInit {
  /** Data */
  public loading = true;
  public survey!: SurveyModel;

  /**
   * Creates an instance of DraftRecordModalComponent.
   *
   * @param formBuilderService Form builder service
   * @param data Data passed to the dialog, here the draft form data
   */
  constructor(
    private formBuilderService: FormBuilderService,
    @Inject(DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {
    this.survey = this.formBuilderService.createSurvey(
      this.data?.form?.structure || '',
      this.data?.form?.metadata
    );
    this.survey.data = this.data.data;
    this.loading = false;
  }
}
