import {Apollo} from 'apollo-angular';
import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as Survey from 'survey-angular';
import { AddRecordMutationResponse, ADD_RECORD, EditRecordMutationResponse, EDIT_RECORD } from '../../graphql/mutations';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import { FormService } from '../../services/form.service';
import { WhoFormModalComponent } from '../form-modal/form-modal.component';
import { WhoSnackBarService } from '../../services/snackbar.service';
import { LANGUAGES } from '../../utils/languages';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WhoWorkflowService } from '../../services/workflow.service';

@Component({
  selector: 'who-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class WhoFormComponent implements OnInit, OnDestroy {

  @Input() form!: Form;
  @Input() record?: Record;
  @Output() save: EventEmitter<boolean> = new EventEmitter();

  // === SURVEYJS ===
  public survey!: Survey.Model;
  public surveyLanguage: { name: string, nativeName: string } = {
    name: 'English',
    nativeName: 'English'
  };
  public usedLocales: Array<{ text: string, value: string }> = [];
  public dropdownLocales: any[] = [];
  public surveyActive = true;
  public selectedTabIndex = 0;

  // === SURVEY COLORS ===
  primaryColor = '#008DC9';

  // === MODIFIED AT ===
  public modifiedAt: Date | null = null;

  // === PASS RECORDS FROM WORKFLOW ===
  private isStep = false;
  private recordsSubscription?: Subscription;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private formService: FormService,
    private snackBar: WhoSnackBarService,
    private router: Router,
    private workflowService: WhoWorkflowService
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

    const structure = JSON.parse(this.form.structure || '');
    this.survey = new Survey.Model(JSON.stringify(structure));

    // Unset readOnly fields if it's the record creation
    if (!this.record) {
      this.form.fields?.forEach(field => {
        if (field.readOnly) {
          this.survey.getQuestionByName(field.name).readOnly = false;
        }
      });
    }

    // Fetch cached data from local storage
    const storedData = localStorage.getItem(`record:${this.form.id}`);
    let cachedData = storedData ? JSON.parse(storedData) : null;

    this.isStep = this.router.url.includes('/workflow/');
    if (this.isStep) {
      this.recordsSubscription = this.workflowService.records.subscribe(records => {
        if (records.length > 0) {
          const mergedRecord = records[0];
          cachedData = mergedRecord.data;
          const resourcesField = this.form.fields?.find(x => x.type === 'resources');
          if (resourcesField && resourcesField.resource === mergedRecord.form?.resource?.id) {
            cachedData[resourcesField.name] = records.map(x => x.id);
          } else {
            this.snackBar.openSnackBar('Selected records do not match with any fields from this form', { error: true });
          }
        }
      });
    }

    if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
      this.survey.data = this.form.uniqueRecord.data;
      this.modifiedAt = this.form.uniqueRecord.modifiedAt || null;
    } else {
      if (cachedData) {
        this.survey.data = cachedData;
      } else {
        if (this.record && this.record.data) {
          this.survey.data = this.record.data;
          this.modifiedAt = this.record.modifiedAt || null;
        }
      }
    }

    if (this.survey.getUsedLocales().length > 1) {
      this.survey.getUsedLocales().forEach(lang => {
        const nativeName = (LANGUAGES as any)[lang].nativeName.split(',')[0];
        this.usedLocales.push({value: lang, text: nativeName});
        this.dropdownLocales.push(nativeName);
      });
    }

    if (navigator.language) {
      const clientLanguage = navigator.language.substring(0, 2);
      const code = this.survey.getUsedLocales().includes(clientLanguage) ? clientLanguage : 'en';
      this.surveyLanguage = (LANGUAGES as any)[code];
      this.survey.locale = code;
    } else {
      // TODO: check
      this.survey.locale = 'en';
    }

    this.survey.render('surveyContainer');
    this.survey.onComplete.add(this.complete);
    this.survey.showCompletedPage = false;
    if (!this.record && !this.form.canCreateRecords) {
      this.survey.mode = 'display';
    }
    this.survey.onCurrentPageChanged.add((surveyModel, options) => {
      this.selectedTabIndex = surveyModel.currentPageNo;
    });
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
        if (!data[key] && questions[field].getType() !== 'boolean') { data[key] = null; }
      }
    }
    this.survey.data = data;
    if (this.record || this.form.uniqueRecord) {
      const recordId = this.record ? this.record.id : this.form.uniqueRecord?.id;
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
    mutation.subscribe((res: any) => {
      if (res.errors) {
        this.save.emit(false);
        this.survey.clear(false, true);
        this.surveyActive = true;
        this.snackBar.openSnackBar(res.errors[0].message, { error: true });
      } else {
        localStorage.removeItem(`record:${this.form.id}`);
        if (res.data.editRecord || res.data.addRecord.form.uniqueRecord) {
          this.survey.clear(false, true);
          if (res.data.addRecord) {
            this.record = res.data.addRecord;
            this.modifiedAt = this.record?.modifiedAt || null;
          } else {
            this.modifiedAt = res.data.editRecord.modifiedAt;
          }
          this.surveyActive = true;
        } else {
          this.survey.showCompletedPage = true;
        }
        if (this.form.uniqueRecord) {
          this.selectedTabIndex = 0;
        }
        this.save.emit(true);
      }
    });
  }

  /* Change language of the form.
  */
  setLanguage(ev: string): void {
    this.survey.locale = this.usedLocales.filter(locale => locale.text === ev)[0].value;
  }

  public onShowPage(i: number): void {
    this.survey.currentPageNo = i;
    this.selectedTabIndex = i;
    if (this.survey.compareTo) {
      this.survey.currentPageNo = i;
    }
  }

  ngOnDestroy(): void {
    if (this.recordsSubscription) {
      this.recordsSubscription.unsubscribe();
      this.workflowService.storeRecords([]);
    }
  }
}
