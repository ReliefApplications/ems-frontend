import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import * as Survey from 'survey-angular';
import { AddRecordMutationResponse, ADD_RECORD, EditRecordMutationResponse, EDIT_RECORD } from '../../graphql/mutations';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import { FormService } from '../../services/form.service';
import { WhoFormModalComponent } from '../form-modal/form-modal.component';
import { WhoSnackBarService } from '../../services/snackbar.service';
import { LANGUAGES } from '../../utils/languages';

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
  public survey: Survey.Model;
  public surveyLanguage = 'en';
  public usedLocales: Array<{ text: string, value: string }> = [];
  public dropdownLocales = [];
  public surveyActive = true;

  // === SURVEY COLORS ===
  primaryColor = '#008DC9';

  // === MODIFIED AT ===
  public modifiedAt: Date;

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

    const structure = JSON.parse(this.form.structure);

    this.survey = new Survey.Model(JSON.stringify(structure));
    const cachedData = localStorage.getItem(`record:${this.form.id}`);
    if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
      this.survey.data = this.form.uniqueRecord.data;
      this.modifiedAt = this.form.uniqueRecord.modifiedAt;
    } else {
      if (cachedData) {
        this.survey.data = JSON.parse(cachedData);
      } else {
        if (this.record && this.record.data) {
          this.survey.data = this.record.data;
        }
      }
    }

    if (this.survey.getUsedLocales().length > 1) {
      this.survey.getUsedLocales().forEach(lang => {
        const nativeName = LANGUAGES[lang].nativeName.split(',')[0];
        this.usedLocales.push({value: lang, text: nativeName});
        this.dropdownLocales.push(nativeName);
      });
    }

    if (navigator.language) {
      const clientLanguage = navigator.language.substring(0, 2);
      const code = this.survey.getUsedLocales().includes(clientLanguage) ? clientLanguage : 'en';
      this.surveyLanguage = LANGUAGES[code];
      this.survey.locale = code;
    } else {
      this.survey.locale = this.surveyLanguage;
    }

    this.survey.render('surveyContainer');
    this.survey.onComplete.add(this.complete);
    this.survey.showCompletedPage = false;
    if (!this.form.canCreateRecords) {
      this.survey.mode = 'display';
    }
    this.survey.onValueChanged.add(this.valueChange.bind(this));
  }

  public reset(): void {
    this.survey.clear();
    this.survey.showCompletedPage = false;
    this.save.emit(false);
    this.survey.render();
    this.surveyActive = true;
  }

  public valueChange(): void {
    localStorage.setItem(`record:${this.form.id}`, JSON.stringify(this.survey.data));
  }

  /*  Custom SurveyJS method, save a new record or edit existing one.
  */
  public complete = () => {
    let mutation: any;
    this.surveyActive = false;
    const data = this.survey.data;
    const questions = this.survey.getAllQuestions();
    for (const field in questions) {
      if (questions[field]) {
        const key = questions[field].getValueName();
        if (!data[key]) { data[key] = null; }
      }
    }
    this.survey.data = data;
    if (this.record || this.form.uniqueRecord) {
      const recordId = this.record ? this.record.id : this.form.uniqueRecord.id;
      mutation = this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: recordId,
          data: this.survey.data
        }
      });
    } else {
      mutation = this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_RECORD,
        variables: {
          form: this.form.id,
          data: this.survey.data
        }
      });
    }
    mutation.subscribe((res) => {
      if (res.errors) {
        this.save.emit(false);
        this.survey.clear(false, true);
        this.surveyActive = true;
        this.snackBar.openSnackBar(res.errors[0].message, { error: true });
      } else {
        localStorage.removeItem(`record:${this.form.id}`);
        if (this.form.uniqueRecord) {
          this.survey.clear(false, true);
          this.modifiedAt = res.data.editRecord.modifiedAt;
          this.surveyActive = true;
        } else {
          this.survey.showCompletedPage = true;
        }
        this.save.emit(true);
      }
    });
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

  /* Change language of the form.
  */
  setLanguage(ev: string): void {
    this.survey.locale = this.usedLocales.filter(locale => locale.text === ev)[0].value;
  }
}
