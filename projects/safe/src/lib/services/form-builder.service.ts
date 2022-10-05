import { Injectable, Injector, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Survey from 'survey-angular';
import { SafeReferenceDataService } from './reference-data.service';
import { renderGlobalProperties } from '../survey/render-global-properties';
import { EditRecordMutationResponse, EDIT_RECORD } from '../graphql/mutations';
import { Apollo } from 'apollo-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

/**
 * Shared form builder service.
 * Only used to add on complete expression to the survey.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeFormBuilderService {
  /**
   * Constructor of the service
   *
   * @param referenceDataService Reference data service
   * @param translate Translation service
   * @param apollo Apollo service
   */
  constructor(
    private referenceDataService: SafeReferenceDataService,
    private translate: TranslateService,
    private apollo: Apollo
  ) {}

  /**
   * Creates new survey from the structure and add on complete expression to it.
   *
   * @param structure form structure
   * @param fields list of fields used to check if the fields should be hidden or disabled
   * @returns New survey
   */
  createSurvey(structure: string, fields: any[] = []): Survey.Survey {
    console.log('A Survey has been created');
    const survey = new Survey.Model(structure);
    survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.referenceDataService)
    );

    // Logic management for resource and resources logic
    survey.onCompleting.add((completedSurvey: any) => {
      for (const page of completedSurvey.toJSON().pages) {
        for (const element of page.elements) {
          if (element.type === 'resources' || element.type === 'resource') {
            const regex = /{\s*(\b.*\b)\s*}\s*=\s*"(.*)"/g;
            for (const record of completedSurvey.getValue(element.name)) {
              let operation: any;
              if (
                element.newRecords &&
                element.newRecords.includes(record) &&
                element.afterAddingANewRecord
              ) {
                operation = regex.exec(element.afterAddingANewRecord);
              } else if (element.afterLinkingExistingRecord) {
                operation = regex.exec(element.afterLinkingExistingRecord);
              }
              this.updateRecord(record, operation);
            }
          }
        }
      }
    });
    const onCompleteExpression = survey.toJSON().onCompleteExpression;
    if (onCompleteExpression) {
      survey.onCompleting.add(() => {
        survey.runExpression(onCompleteExpression);
      });
    }
    if (fields.length > 0) {
      for (const f of fields.filter((x) => !x.automated)) {
        const accessible = !!f.canSee;
        const editable = !!f.canUpdate;
        const hidden: boolean = (f.canSee !== undefined && !f.canSee) || false;
        const disabled: boolean =
          (f.canUpdate !== undefined && !f.canUpdate) || false;
        survey.getQuestionByName(f.name).visible = !hidden && accessible;
        survey.getQuestionByName(f.name).readOnly = disabled || !editable;
      }
    }
    // set the lang of the survey
    const surveyLang = localStorage.getItem('surveyLang');
    if (surveyLang && survey.getUsedLocales().includes(surveyLang)) {
      survey.locale = surveyLang;
    } else {
      const lang = this.translate.currentLang || this.translate.defaultLang;
      if (survey.getUsedLocales().includes(lang)) {
        survey.locale = lang;
      }
    }
    return survey;
  }

  /**
   * Updates the field with the specified information.
   *
   * @param id Id of the record to update
   * @param operation Operation to execute
   */
  private updateRecord(id: string, operation: any): void {
    if (id && operation) {
      this.apollo
        .mutate<EditRecordMutationResponse>({
          mutation: EDIT_RECORD,
          variables: {
            id,
            data: { [operation[1]]: operation[2] },
          },
        })
        .subscribe(() => {});
    }
  }
}
