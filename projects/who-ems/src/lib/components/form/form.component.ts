import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import * as Survey from 'survey-angular';
import { AddRecordMutationResponse, ADD_RECORD, EditRecordMutationResponse, EDIT_RECORD } from '../../graphql/mutations';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import { FormService } from '../../services/form.service';
import { WhoFormModalComponent } from '../form-modal/form-modal.component';
import { WhoSnackBarService } from '../../services/snackbar.service';

@Component({
  selector: 'who-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class WhoFormComponent implements OnInit {

  @Input() form: Form;
  @Input() record: Record;
  @Output() save: EventEmitter<boolean> = new EventEmitter();

  // === SURVEYJS ===
  private survey: Survey.Model;

  // === SURVEY COLORS
  primaryColor = '#008DC9';

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private formService: FormService,
    private snackBar: WhoSnackBarService
  ) {}

  ngOnInit(): void {
    const defaultThemeColorsSurvey = Survey
      .StylesManager
      .ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.primaryColor;
    defaultThemeColorsSurvey['$main-hover-color'] = this.primaryColor;

    Survey
      .StylesManager
      .applyTheme();

    this.survey = new Survey.Model(this.form.structure);
    const cachedData = localStorage.getItem(`record:${this.form.id}`);
    if (cachedData) {
      this.survey.data = JSON.parse(cachedData);
    } else {
      if (this.record && this.record.data) {
        this.survey.data = this.record.data;
      }
    }
    this.survey.render('surveyContainer');
    this.survey.onComplete.add(this.complete);
    this.survey.showCompletedPage = false;
    this.survey.onValueChanged.add(this.valueChange.bind(this));
  }

  public reset(): void {
    this.survey.clear();
    this.save.emit(false);
    this.survey.render();
  }

  public valueChange(): void {
    localStorage.setItem(`record:${this.form.id}`, JSON.stringify(this.survey.data));
  }

  /*  Custom SurveyJS method, save a new record.
  */
  public complete = () => {
    if (this.record) {
      this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: this.record.id,
          data: this.survey.data
        }
      }).subscribe((res) => {
        if (res.errors) {
          this.save.emit(false);
          this.survey.clear(false, true);
          this.snackBar.openSnackBar(res.errors[0].message, { error: true });
        } else {
          localStorage.removeItem(`record:${this.form.id}`);
          this.survey.showCompletedPage = true;
          this.save.emit(true);
        }
      });
    } else {
      this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_RECORD,
        variables: {
          form: this.form.id,
          data: this.survey.data
        }
      }).subscribe((res) => {
        if (res.errors) {
          this.save.emit(false);
          this.survey.clear(false, true);
          this.snackBar.openSnackBar(res.errors[0].message, { error: true });
        } else {
          localStorage.removeItem(`record:${this.form.id}`);
          this.survey.showCompletedPage = true;
          this.save.emit(true);
        }
      });
    }
  }

  /*  Event listener to trigger embedded forms.
  */
  @HostListener('document:openForm', ['$event'])
  onOpenEmbeddedForm(event: any): void {
    const dialogRef = this.dialog.open(WhoFormModalComponent, {
      data: {
        template: event.detail.template,
        locale: event.locale
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const e = new CustomEvent('saveResourceFromEmbed', { detail: { resource: res.data, template: res.template } });
        document.dispatchEvent(e);
      }
    });
  }

}
