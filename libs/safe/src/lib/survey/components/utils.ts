import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SafeResourceGridModalComponent } from '../../components/search-resource-grid-modal/search-resource-grid-modal.component';
import { UntypedFormGroup } from '@angular/forms';
import { surveyLocalization } from 'survey-angular';
import { SafeResourceModalComponent } from '../../components/resource-modal/resource-modal.component';

/**
 * Build the search button for resource and resources components
 *
 * @param question The question object
 * @param fieldsSettingsForm The form used for the button
 * @param multiselect Indicate if we need multiselect
 * @param dialog The material dialog service
 * @returns The button DOM element
 */
export const buildSearchButton = (
  question: any,
  fieldsSettingsForm: UntypedFormGroup,
  multiselect: boolean,
  dialog: MatDialog
): any => {
  const searchButton = document.createElement('button');
  searchButton.innerText = surveyLocalization.getString(
    'oort:search',
    question.survey.locale
  );
  searchButton.style.marginRight = '8px';
  if (fieldsSettingsForm) {
    searchButton.onclick = () => {
      const dialogRef = dialog.open(SafeResourceGridModalComponent, {
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
      dialogRef.afterClosed().subscribe((rows: any[]) => {
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
 * @param dialog The material dialog service
 * @returns The button DOM element
 */
export const buildAddButton = (
  question: any,
  multiselect: boolean,
  dialog: MatDialog
): any => {
  const addButton = document.createElement('button');
  addButton.innerText = surveyLocalization.getString(
    'oort:addNewRecord',
    question.survey.locale
  );
  if (question.addRecord && question.addTemplate) {
    addButton.onclick = () => {
      const dialogRef = dialog.open(SafeResourceModalComponent, {
        disableClose: true,
        data: {
          template: question.addTemplate,
          locale: question.resource.value,
          askForConfirm: false,
          ...(question.prefillWithCurrentRecord && {
            prefillData: question.survey.data,
          }),
        },
        height: '98%',
        width: '100vw',
        panelClass: 'full-screen-modal',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(({ data }: any) => {
        if (data) {
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
    };
  }
  addButton.style.display =
    question.addRecord && question.addTemplate ? '' : 'none';
  return addButton;
};
