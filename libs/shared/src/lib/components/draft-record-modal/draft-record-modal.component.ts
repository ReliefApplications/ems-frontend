import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogModule, SpinnerModule } from '@oort-front/ui';
import { Component, OnInit, Inject } from '@angular/core';
import { SurveyModule } from 'survey-angular-ui';
import { CommonModule } from '@angular/common';
import { SurveyModel } from 'survey-core';

@Component({
  standalone: true,
  imports: [CommonModule, DialogModule, SurveyModule, SpinnerModule],
  selector: 'shared-draft-record-modal',
  templateUrl: './draft-record-modal.component.html',
  styleUrls: ['./draft-record-modal.component.scss'],
})
export class DraftRecordModalComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public survey!: SurveyModel;

  constructor(
    private formBuilderService: FormBuilderService,
    public dialogRef: DialogRef<DraftRecordModalComponent>,
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
