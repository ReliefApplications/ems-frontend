import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import * as Survey from 'survey-angular';
import { AddRecordMutationResponse, ADD_RECORD, EditRecordMutationResponse, EDIT_RECORD } from '../../graphql/mutations';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import { FormService } from '../../services/form.service';
import { WhoFormModalComponent } from '../form-modal/form-modal.component';

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
    private formService: FormService
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
    if (this.record && this.record.data) {
      this.survey.data = this.record.data;
    }
    this.appendTooltipIcon();
    this.survey.render('surveyContainer');
    this.survey.onComplete.add(this.complete);
  }

  public reset(): void {
    this.survey.clear();
    this.save.emit(false);
    this.survey.render();
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
      }).subscribe(() => {
        this.save.emit(true);
      });
    } else {
      this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_RECORD,
        variables: {
          form: this.form.id,
          data: this.survey.data
        }
      }).subscribe(() => {
        this.save.emit(true);
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

  private appendTooltipIcon(): void {
    this.survey.onAfterRenderQuestion
      .add((survey, option) => {
        // Return if there is no description to show in tooltip
        if (!option.question.tooltip) {
          return;
        }

        const header = option
          .htmlElement
          .querySelector('h5');
        header.title = option.question.tooltip;

        const span = document.createElement('span');
        span.innerText = 'info';
        span.className = 'material-icons';
        span.style.fontSize = '1.2rem';
        span.style.cursor = 'help';
        header.appendChild(span);
      });
  }

}
