import { Dialog } from '@angular/cdk/dialog';
import { UntypedFormControl } from '@angular/forms';
import { NgZone } from '@angular/core';
// todo: as it something to do with survey-angular
import { SurveyModel, surveyLocalization } from 'survey-core';
import localForage from 'localforage';
import { Question } from '../types';

/**
 * Build the search button for resource and resources components
 *
 * @param question The question object
 * @param fieldsSettingsForm The raw value from the form used for the grid settings
 * @param multiselect Indicate if we need multiselect
 * @param dialog The Dialog service
 * @param temporaryRecords The form used to save and keep the temporary records updated
 * @param document Document
 * @returns The button DOM element
 */
export const buildSearchButton = (
  question: Question,
  fieldsSettingsForm: any,
  multiselect: boolean,
  dialog: Dialog,
  temporaryRecords: UntypedFormControl,
  document: Document
): any => {
  const searchButton = document.createElement('button');
  searchButton.innerText = surveyLocalization.getString(
    'oort:search',
    (question.survey as SurveyModel).locale
  );
  searchButton.className = 'sd-btn !px-3 !py-1';
  searchButton.style.marginRight = '8px';
  if (fieldsSettingsForm) {
    temporaryRecords.valueChanges.subscribe((res: any) => {
      if (res) {
        fieldsSettingsForm.temporaryRecords = res;
      }
    });
    searchButton.onclick = async () => {
      const { ResourceGridModalComponent } = await import(
        '../../components/search-resource-grid-modal/search-resource-grid-modal.component'
      );
      const dialogRef = dialog.open(ResourceGridModalComponent, {
        data: {
          multiselect,
          gridSettings: { ...fieldsSettingsForm },
          selectedRows: Array.isArray(question.value)
            ? question.value
            : question.value
            ? [question.value]
            : [],
          selectable: true,
        },
        panelClass: 'closable-dialog',
      });
      dialogRef.closed.subscribe((rows: any) => {
        if (!rows) {
          return;
        }
        if (rows.length > 0) {
          question.value = multiselect ? rows : rows[0];
        } else {
          question.value = null;
        }
      });
    };
  }
  searchButton.style.display =
    !question.isReadOnly && question.canSearch ? '' : 'none';
  return searchButton;
};

/**
 * Build the add button for resource and resources components
 *
 * @param question The question object
 * @param multiselect Indicate if we need multiselect
 * @param dialog The Dialog service
 * @param ngZone Angular Service to execute code inside Angular environment
 * @param document Document
 * @returns The button DOM element
 */
export const buildAddButton = (
  question: Question,
  multiselect: boolean,
  dialog: Dialog,
  ngZone: NgZone,
  document: Document
): any => {
  const addButton = document.createElement('button');
  addButton.innerText = surveyLocalization.getString(
    'oort:addNewRecord',
    (question.survey as SurveyModel).locale
  );
  addButton.className = 'sd-btn !px-3 !py-1';
  if (question.addRecord && question.addTemplate && !question.isReadOnly) {
    addButton.onclick = async () => {
      ngZone.run(async () => {
        const { ResourceModalComponent } = await import(
          '../../components/resource-modal/resource-modal.component'
        );
        const dialogRef = dialog.open(ResourceModalComponent, {
          disableClose: true,
          data: {
            template: question.addTemplate,
            locale: question.resource.value,
            askForConfirm: false,
            ...(question.prefillWithCurrentRecord && {
              prefillData: (question.survey as SurveyModel).data,
            }),
          },
          height: '98%',
          width: '100vw',
          panelClass: 'full-screen-modal',
        });
        dialogRef.closed.subscribe((result: any) => {
          if (result) {
            const { data } = result;
            // TODO: call reload method
            // if (question.displayAsGrid && gridComponent) {
            //   gridComponent.availableRecords.push({
            //     value: data.id,
            //     text: data.data[question.displayField]
            //   });
            // }
            if (multiselect) {
              const newItem = {
                value: data.id,
                text: data.data[question.displayField],
              };
              question.contentQuestion.choices = [
                newItem,
                ...question.contentQuestion.choices,
              ];
              question.newCreatedRecords = question.newCreatedRecords
                ? question.newCreatedRecords.concat(data.id)
                : [data.id];
              question.value = question.value.concat(data.id);
            } else {
              const newItem = {
                value: data.id,
                text: data.data[question.displayField],
              };
              question.contentQuestion.choices = [
                newItem,
                ...question.contentQuestion.choices,
              ];
              question.newCreatedRecords = data.id;
              question.value = data.id;
            }
          }
        });
      });
    };
  }
  addButton.style.display =
    question.addRecord && question.addTemplate && !question.isReadOnly
      ? ''
      : 'none';
  question.registerFunctionOnPropertyValueChanged(
    'readOnly',
    (value: boolean) => {
      addButton.style.display = value ? 'none' : '';
    }
  );
  return addButton;
};

/**
 * Updates the newCreatedRecords for resource and resources questions
 *
 * @param question The question object
 * @param multiselect Indicate if the questions is multiselect
 * @param promises Promises array to be do something after they're all reject or resolved.
 * @returns The grid settings updated
 */
export const processNewCreatedRecords = (
  question: any,
  multiselect: boolean,
  promises: Promise<void>[]
): any => {
  const query = question.gridFieldsSettings || {};
  const temporaryRecords: any[] = [];
  if (multiselect) {
    question.newCreatedRecords?.forEach((recordId: string) => {
      const promise = new Promise<void>((resolve, reject) => {
        localForage
          .getItem(recordId)
          .then((data: any) => {
            if (data != null) {
              // We ensure to make it only if such a record is found
              const parsedData = JSON.parse(data);
              temporaryRecords.push({
                id: recordId,
                template: parsedData.template,
                ...parsedData.data,
                isTemporary: true,
              });
            }
            resolve();
          })
          .catch((error: any) => {
            console.error(error); // Handle any errors that occur while getting the item
            reject(error);
          });
      });
      promises.push(promise);
    });
  } else {
    new Promise<void>((resolve, reject) => {
      localForage
        .getItem(question.newCreatedRecords)
        .then((data: any) => {
          if (data != null) {
            // We ensure to make it only if such a record is found
            const parsedData = JSON.parse(data);
            temporaryRecords.push({
              id: question.newCreatedRecords,
              template: parsedData.template,
              ...parsedData.data,
              isTemporary: true,
            });
          }
          resolve();
        })
        .catch((error: any) => {
          console.error(error); // Handle any errors that occur while getting the item
          reject(error);
        });
    });
  }

  const uuidRegExpr =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
  const settings = {
    query: {
      ...query,
      temporaryRecords: temporaryRecords,
      filter: {
        logic: 'and',
        ...(multiselect && {
          filters: [
            {
              field: 'ids',
              operator: 'eq',
              value:
                question.value.filter((id: string) => !uuidRegExpr.test(id)) ||
                [], //We exclude the temporary records by excluding id in UUID format
            },
          ],
        }),
      },
    },
  };
  return settings;
};
