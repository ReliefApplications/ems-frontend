import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { FormService } from '../../services/form.service';
import { Form } from '../../models/form.model';
import { v4 as uuidv4 } from 'uuid';
import * as Survey from 'survey-angular';
import { GetRecordByIdQueryResponse, GET_RECORD_BY_ID } from '../../graphql/queries';

@Component({
  selector: 'who-record-modal',
  templateUrl: './record-modal.component.html',
  styleUrls: ['./record-modal.component.scss']
})
export class WhoRecordModalComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public form: Form;
  public survey: Survey.Model;

  public containerId: string;

  // === SURVEY COLORS
  primaryColor = '#008DC9';

  constructor(
    public dialogRef: MatDialogRef<WhoRecordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      recordId: string,
      locale?: string
    },
    private apollo: Apollo,
    public dialog: MatDialog,
    private formService: FormService
  ) {
    this.containerId = uuidv4();
  }

  ngOnInit(): void {
    const defaultThemeColorsSurvey = Survey
      .StylesManager
      .ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.primaryColor;
    defaultThemeColorsSurvey['$main-hover-color'] = this.primaryColor;

    Survey
      .StylesManager
      .applyTheme();

    this.apollo.watchQuery<GetRecordByIdQueryResponse>({
      query: GET_RECORD_BY_ID,
      variables: {
        id: this.data.recordId
      }
    }).valueChanges.subscribe(res => {
      const record = res.data.record;
      this.form = record.form;
      this.loading = res.loading;
      this.survey = new Survey.Model(this.form.structure);
      this.survey.data = record.data;
      this.survey.locale = this.data.locale ? this.data.locale : 'en';
      this.survey.mode = 'display';
      this.survey.showNavigationButtons = 'none';
      this.survey.showProgressBar = 'off';
      this.survey.render(this.containerId);
    });
  }

  public onShowPage(i: number): void {
    this.survey.currentPageNo = i;
  }
}
