import { Injectable } from '@angular/core';
import { Record } from '../models/record.model';
import { Apollo } from 'apollo-angular';
import * as Survey from 'survey-angular';
import { renderCustomProperties } from '../survey/custom-properties';
import { DomService } from './dom.service';
import { EditRecordMutationResponse, EDIT_RECORD } from '../graphql/mutations';
import get from 'lodash/get';

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
   * @param domService The dom service
   * @param apollo Apollo service
   */
  constructor(private domService: DomService, private apollo: Apollo) {}

  /**
   * Creates new survey from the structure and add on complete expression to it.
   *
   * @param structure form structure
   * @param record record that'll be edited, if any
   * @returns New survey
   */
  createSurvey(structure: string, record?: Record): Survey.Survey {
    const survey = new Survey.Model(structure);
    survey.onAfterRenderQuestion.add(renderCustomProperties(this.domService));
    // Logic management for resource and resources logic
    survey.onCompleting.add(() => {
      for (const page of survey.toJSON().pages) {
        for (const element of page.elements) {
          if (element.type === 'resources' || element.type === 'resource') {
            // if its a single record, the value will be string
            // so we account for that by putting it in an array
            const valueIterator =
              element.type === 'resources'
                ? survey.getValue(element.name)
                : [survey.getValue(element.name)];

            const regex = /{\s*(\b.*\b)\s*}\s*=\s*"(.*)"/g;
            for (const item of valueIterator) {
              let operation: any;
              if (
                element.newCreatedRecords &&
                element.newCreatedRecords.includes(item) &&
                element.afterRecordCreation
              ) {
                regex.lastIndex = 0; // ensure that regex restarts
                operation = regex.exec(element.afterRecordCreation); // divide string into groups for key : value mapping
              } else if (element.afterRecordSelection) {
                regex.lastIndex = 0; // ensure that regex restarts
                const isNewlySelected =
                  element.type === 'resources'
                    ? !get(record, `data.${element.name}`, []).includes(item)
                    : !(get(record, `data.${element.name}`, null) === item);
                // only updates those records that were not in the old value for the field
                if (isNewlySelected)
                  operation = regex.exec(element.afterRecordSelection); // divide string into groups for key : value mapping
              }
              this.updateRecord(item, operation);
            }
          }
        }
      }
    });
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
