import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ButtonModule, DialogModule, SpinnerModule } from '@oort-front/ui';
import { Component, OnInit, Inject } from '@angular/core';
import { SurveyModule } from 'survey-angular-ui';
import { CommonModule } from '@angular/common';
import { SurveyModel } from 'survey-core';
import { Form } from '../../models/form.model';

/** Dialog data interface */
interface DialogData {
  form: Form;
  data: any;
}

/**
 * Display a draft record in a modal.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    SurveyModule,
    SpinnerModule,
    ButtonModule,
  ],
  selector: 'shared-draft-record-modal',
  templateUrl: './draft-record-modal.component.html',
  styleUrls: ['./draft-record-modal.component.scss'],
})
export class DraftRecordModalComponent implements OnInit {
  /** Loading indicator */
  public loading = true;
  /** Survey instance */
  public survey!: SurveyModel;

  /**
   * Display a draft record in a modal.
   *
   * @param formBuilderService Form builder service
   * @param data Data passed to the dialog
   */
  constructor(
    private formBuilderService: FormBuilderService,
    @Inject(DIALOG_DATA)
    public data: DialogData
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
