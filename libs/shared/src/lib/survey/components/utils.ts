import { Dialog } from '@angular/cdk/dialog';
import { NgZone } from '@angular/core';
// todo: as it something to do with survey-angular
import { SurveyModel, surveyLocalization } from 'survey-core';
import { Question } from '../types';

/**
 * Build the search button for resource and resources components
 *
 * @param question The question object
 * @param multiselect Indicate if we need multiselect
 * @param dialog The Dialog service
 * @param document Document
 * @param ngZone Angular Service to execute code inside Angular environment
 * @returns The button DOM element
 */
export const buildSearchButton = (
  question: Question,
  multiselect: boolean,
  dialog: Dialog,
  document: Document,
  ngZone: NgZone
) => {
  const fieldsSettingsForm = question.gridFieldsSettings;
  const survey = question.survey as SurveyModel;
  const searchButton = document.createElement('button');

  searchButton.id = `resourceSearchButton-${question.name}`;
  const updateButtonText = () => {
    if (!survey) {
      return;
    }
    searchButton.innerText =
      question.searchButtonText ??
      surveyLocalization.getString(
        'oort:search',
        survey.locale || survey.defaultLanguage
      );
  };
  updateButtonText();

  // Listen to language change and update button text
  survey.onLocaleChangedEvent.add(updateButtonText);
  question.registerFunctionOnPropertyValueChanged(
    'searchButtonText',
    updateButtonText
  );

  searchButton.className = 'sd-btn !px-3 !py-1';

  if (question.showButtonsInDropdown) {
    searchButton.className += ' !shadow-none';
  }
  if (fieldsSettingsForm) {
    searchButton.onclick = async () => {
      const { ResourceGridModalComponent } = await import(
        '../../components/search-resource-grid-modal/search-resource-grid-modal.component'
      );
      ngZone.run(() => {
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
      });
    };
  }

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
  const survey = question.survey as SurveyModel;
  const addButton = document.createElement('button');

  const updateButtonText = () => {
    addButton.innerText =
      question.addRecordText ??
      surveyLocalization.getString(
        'oort:addNewRecord',
        survey.locale || survey.defaultLanguage
      );
  };
  updateButtonText();

  // Listen to language change and update button text
  survey.onLocaleChangedEvent.add(updateButtonText);
  question.registerFunctionOnPropertyValueChanged(
    'addRecordText',
    updateButtonText
  );

  addButton.className = 'sd-btn !px-3 !py-1';
  if (question.showButtonsInDropdown) {
    addButton.className += ' !shadow-none';
  }
  if (question.addRecord && question.addTemplate && !question.isReadOnly) {
    addButton.onclick = async () => {
      const { ResourceModalComponent } = await import(
        '../../components/resource-modal/resource-modal.component'
      );
      ngZone.run(() => {
        const dialogRef = dialog.open(ResourceModalComponent, {
          disableClose: true,
          data: {
            template: question.addTemplate,
            alwaysCreateRecord: question.alwaysCreateRecord,
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
            question.template = result.template;
            question.draftData = {
              ...question.draftData,
              [data.id]: data.data,
            };
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

  return addButton;
};

/**
 * Build the add button for resource and resources components
 *
 * @param question The question object
 * @param dialog The Dialog service
 * @param ngZone Angular Service to execute code inside Angular environment
 * @param document Document
 * @returns The button DOM element
 */
export const buildUpdateButton = (
  question: Question,
  dialog: Dialog,
  ngZone: NgZone,
  document: Document
): any => {
  const survey = question.survey as SurveyModel;
  const updateButton = document.createElement('button');

  const updateButtonText = () => {
    updateButton.innerText =
      question.updateRecordText ??
      surveyLocalization.getString(
        'oort:updateRecord',
        survey.locale || survey.defaultLanguage
      );
  };
  updateButtonText();

  // Disable button if no record is selected
  const setDisabled = () => {
    updateButton.disabled = !question.value;
  };

  setDisabled();
  survey.onValueChanged.add((val, options) => {
    if (options.question === question) {
      setDisabled();
    }
  });

  // Listen to language change and update button text
  survey.onLocaleChangedEvent.add(updateButtonText);
  question.registerFunctionOnPropertyValueChanged(
    'updateRecordText',
    updateButtonText
  );

  updateButton.className = 'sd-btn !px-3 !py-1';
  if (question.showButtonsInDropdown) {
    updateButton.className += ' !shadow-none';
  }
  if (question.updateRecord) {
    updateButton.onclick = async () => {
      const { ResourceModalComponent } = await import(
        '../../components/resource-modal/resource-modal.component'
      );
      ngZone.run(() => {
        const dialogRef = dialog.open(ResourceModalComponent, {
          disableClose: true,
          data: {
            recordId: question.value,
            alwaysCreateRecord: false,
            askForConfirm: false,
          },
          height: '98%',
          width: '100vw',
          panelClass: 'full-screen-modal',
        });
        dialogRef.closed.subscribe((result: any) => {
          if (result) {
            const { data } = result;
            question.template = result.template;
            question.draftData = {
              ...question.draftData,
              [data.id]: data.data,
            };

            const updatedItem = {
              value: data.id,
              text: data.data[question.displayField],
            };
            const itemIndex = question.contentQuestion.choices.findIndex(
              (choice: any) => choice.value === updatedItem.value
            );
            if (itemIndex !== -1) {
              const newChoices = [...question.contentQuestion.choices];
              newChoices[itemIndex] = updatedItem;
              question.contentQuestion.choices = newChoices;
            }
          }
        });
      });
    };
  }

  return updateButton;
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
      const promise = new Promise<void>((resolve) => {
        temporaryRecords.push({
          id: recordId,
          template: question.template,
          ...question.draftData[recordId],
          isTemporary: true,
        });
        resolve();
      });
      promises.push(promise);
    });
  } else {
    new Promise<void>((resolve) => {
      temporaryRecords.push({
        id: question.newCreatedRecords,
        template: question.template,
        ...question.draftData[question.newCreatedRecords],
        isTemporary: true,
      });
      resolve();
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
                // Was used exclude the temporary records by excluding id in UUID format
                // But we not longer use UUID or local storage for the temporary records
                question.value.filter((id: string) => !uuidRegExpr.test(id)) ||
                [],
            },
          ],
        }),
      },
    },
  };
  return settings;
};

/******** SHARED METHODS FOR RESOURCE AND RESOURCES *********/

/**
 * Build up an element wrapper for questions actions buttons
 *
 * @returns Element wrapper containing the actions buttons
 */
export function setUpActionsButtonWrapper() {
  const actionsButtons = document.createElement('div');
  actionsButtons.id = 'actionsButtons';
  actionsButtons.style.display = 'flex';
  actionsButtons.style.flexWrap = 'wrap';
  actionsButtons.style.gap = '8px';
  return actionsButtons;
}
