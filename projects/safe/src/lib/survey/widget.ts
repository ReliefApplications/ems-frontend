import { MatDialog } from '@angular/material/dialog';
import { SafeFormModalComponent } from '../components/form-modal/form-modal.component';
import { DomService } from '../services/dom.service';
import { SafeResourceGridModalComponent } from '../components/search-resource-grid-modal/search-resource-grid-modal.component';
import { FormGroup } from '@angular/forms';
import { ChoicesRestful, JsonMetadata } from 'survey-angular';
import * as SurveyCreator from 'survey-creator';
import { SafeButtonComponent } from '../components/ui/button/button.component';
import { ButtonSize } from '../components/ui/button/button-size.enum';
import { ButtonCategory } from '../components/ui/button/button-category.enum';
import { EmbeddedViewRef } from '@angular/core';
import { SafeRecordDropdownComponent } from '../components/record-dropdown/record-dropdown.component';
import { SafeCoreGridComponent } from '../components/ui/core-grid/core-grid.component';
import { SafeReferenceDataDropdownComponent } from '../components/reference-data-dropdown/reference-data-dropdown.component';
import { SafeReferenceDataService } from '../services/reference-data.service';

const SELECTABLE_TYPES = ['dropdown', 'checkbox', 'radiogroup', 'tagbox'];

/**
 * Adds zero to number if < 10.
 *
 * @param i number
 * @returns number prefixed with 0 if needed
 */
const addZero = (i: number): string => {
  if (i < 10) {
    return '0' + i;
  } else {
    return i.toString();
  }
};

/**
 * Custom definition for survey. Definition of all additional code built on the default logic.
 *
 * @param survey Survey instance
 * @param domService Shared DOM service
 * @param dialog Material dialog service
 * @param environment Current environment
 * @param referenceDataService Reference data service
 */
export const init = (
  survey: any,
  domService: DomService,
  dialog: MatDialog,
  environment: any,
  referenceDataService: SafeReferenceDataService
): void => {
  const widget = {
    name: 'custom-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: any): any => true,
    init: (): void => {
      const serializer: JsonMetadata = survey.Serializer;
      serializer.addProperty('question', {
        name: 'tooltip:text',
        category: 'general',
        isLocalizable: true,
      });
      serializer.addProperty('comment', {
        name: 'allowEdition:boolean',
        type: 'boolean',
        dependsOn: ['readOnly'],
        default: false,
        category: 'general',
        visibleIf: (obj: any) => {
          if (!obj || !obj.readOnly) {
            return false;
          } else {
            return true;
          }
        },
      });
      serializer.removeProperty('expression', 'readOnly');
      serializer.removeProperty('survey', 'focusFirstQuestionAutomatic');
      serializer.addProperty('expression', {
        name: 'readOnly:boolean',
        type: 'boolean',
        visibleIndex: 6,
        default: false,
        category: 'general',
        required: true,
      });
      // Pass token before the request to fetch choices by URL if it's targeting SAFE API
      survey.ChoicesRestfull.onBeforeSendRequest = (
        sender: ChoicesRestful,
        options: { request: XMLHttpRequest }
      ) => {
        if (sender.url.includes(environment.apiUrl)) {
          const token = localStorage.getItem('idtoken');
          options.request.setRequestHeader('Authorization', `Bearer ${token}`);
        }
      };
      serializer.addProperty('survey', {
        name: 'onCompleteExpression:expression',
        type: 'expression',
        visibleIndex: 350,
        category: 'logic',
      });

      // === REFERENCE DATA SELECTION ===
      serializer.addProperty('selectbase', {
        name: 'referenceData',
        category: 'Choices from Reference data',
        type: 'referenceDataDropdown',
        visibleIndex: 1,
      });

      serializer.addProperty('selectbase', {
        name: 'referenceDataDisplayField',
        displayName: 'Display field',
        category: 'Choices from Reference data',
        required: true,
        dependsOn: 'referenceData',
        visibleIf: (obj: any) => {
          if (!obj || !obj.referenceData) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 2,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.referenceData) {
            referenceDataService
              .loadReferenceData(obj.referenceData)
              .then((referenceData) =>
                choicesCallback(referenceData.fields || [])
              );
          }
        },
      });

      const referenceDataEditor = {
        render: (editor: any, htmlElement: any) => {
          const question = editor.object;
          const dropdown = domService.appendComponentToBody(
            SafeReferenceDataDropdownComponent,
            htmlElement
          );
          const instance: SafeReferenceDataDropdownComponent =
            dropdown.instance;
          instance.referenceData = question.referenceData;
          instance.choice.subscribe((res) => editor.onChanged(res));
        },
      };
      SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
        'referenceDataDropdown',
        referenceDataEditor
      );
    },
    isDefaultRender: true,
    afterRender: (question: any, el: any): void => {
      // Correction of date inputs
      if (
        question.value &&
        ['date', 'datetime', 'datetime-local', 'time'].includes(
          question.inputType
        )
      ) {
        const date = new Date(question.value);
        if (date.toString() !== 'Invalid Date') {
          const year = date.getFullYear();
          const month = addZero(date.getMonth() + 1);
          const day = addZero(date.getDate());
          const hour = addZero(date.getUTCHours());
          const minutes = addZero(date.getUTCMinutes());
          switch (question.inputType) {
            case 'date':
              question.value = `${year}-${month}-${day}`;
              break;
            case 'datetime':
              break;
            case 'datetime-local':
              question.value = `${year}-${month}-${day}T${hour}:${minutes}`;
              break;
            case 'time':
              question.value = `${hour}:${minutes}`;
              break;
            default:
              break;
          }
          el.value = question.value;
        }
      }
      // Display of edit button for comment question
      if (question.getType() === 'comment' && question.allowEdition) {
        el.parentElement.querySelector('#editComment')?.remove();
        const mainDiv = document.createElement('div');
        mainDiv.id = 'editComment';
        mainDiv.style.height = '23px';
        mainDiv.style.marginBottom = '0.5em';
        const btnEl = document.createElement('button');
        btnEl.innerText = 'Edit';
        btnEl.style.width = '50px';
        mainDiv.appendChild(btnEl);
        el.parentElement.insertBefore(mainDiv, el);
        mainDiv.style.display = !question.allowEdition ? 'none' : '';
        question.registerFunctionOnPropertyValueChanged('allowEdition', () => {
          mainDiv.style.display = !question.allowEdition ? 'none' : '';
        });
        question.registerFunctionOnPropertyValueChanged('readOnly', () => {
          mainDiv.style.display = !question.readOnly ? 'none' : '';
        });
        btnEl.onclick = () => {
          question.readOnly = false;
        };
      }
      // Display of tooltip
      if (question.tooltip) {
        const header =
          el.parentElement.parentElement.querySelector('.sv_q_title');
        if (header) {
          header.title =
            question.localizableStrings?.tooltip?.renderedText || '';
          header.querySelector('span.material-icons')?.remove();
          const span = document.createElement('span');
          span.innerText = 'help';
          span.className = 'material-icons';
          span.style.fontSize = '1em';
          span.style.cursor = 'pointer';
          span.style.color = '#008DC9';
          header.appendChild(span);
          span.style.display = !question.tooltip ? 'none' : '';
          question.registerFunctionOnPropertyValueChanged('tooltip', () => {
            span.style.display = !question.tooltip ? 'none' : '';
          });
        }
      }
      // Display of add button for resource question
      if (question.getType() === 'resource') {
        // support the placeholder field
        if (question.placeholder) {
          question.contentQuestion.optionsCaption =
            question.localizableStrings?.placeholder?.renderedText || '';
        }
        // const dropdownComponent = buildRecordDropdown(question, el);
        if (question.survey.mode !== 'display' && question.resource) {
          el.parentElement.querySelector('#actionsButtons')?.remove();
          const actionsButtons = document.createElement('div');
          actionsButtons.id = 'actionsButtons';
          actionsButtons.style.display = 'flex';
          actionsButtons.style.marginBottom = '0.5em';

          const searchBtn = buildSearchButton(
            question,
            question.gridFieldsSettings,
            false
          );
          actionsButtons.appendChild(searchBtn);

          const addBtn = buildAddButton(question, false);
          actionsButtons.appendChild(addBtn);

          el.parentElement.insertBefore(actionsButtons, el);

          // actionsButtons.style.display = ((!question.addRecord || !question.addTemplate) && !question.gridFieldsSettings) ? 'none' : '';

          question.registerFunctionOnPropertyValueChanged(
            'gridFieldsSettings',
            () => {
              searchBtn.style.display = question.gridFieldsSettings
                ? ''
                : 'none';
            }
          );
          question.registerFunctionOnPropertyValueChanged('canSearch', () => {
            searchBtn.style.display = question.canSearch ? '' : 'none';
          });
          question.registerFunctionOnPropertyValueChanged('addTemplate', () => {
            addBtn.style.display =
              question.addRecord && question.addTemplate ? '' : 'none';
          });
          question.registerFunctionOnPropertyValueChanged('addRecord', () => {
            addBtn.style.display =
              question.addRecord && question.addTemplate ? '' : 'none';
          });
        }
      }
      // Display of add button | grid for resources question
      if (question.getType() === 'resources' && question.resource) {
        const gridComponent = buildRecordsGrid(question, el);

        if (question.survey.mode !== 'display') {
          el.parentElement.querySelector('#actionsButtons')?.remove();
          const actionsButtons = document.createElement('div');
          actionsButtons.id = 'actionsButtons';
          actionsButtons.style.display = 'flex';
          actionsButtons.style.marginBottom = '0.5em';

          const searchBtn = buildSearchButton(
            question,
            question.gridFieldsSettings,
            true
          );
          actionsButtons.appendChild(searchBtn);

          const addBtn = buildAddButton(question, true, gridComponent);
          actionsButtons.appendChild(addBtn);

          el.parentElement.insertBefore(actionsButtons, el);
          // actionsButtons.style.display = ((!question.addRecord || !question.addTemplate) && !question.gridFieldsSettings) ? 'none' : '';

          question.registerFunctionOnPropertyValueChanged(
            'gridFieldsSettings',
            () => {
              searchBtn.style.display = question.gridFieldsSettings
                ? ''
                : 'none';
            }
          );
          question.registerFunctionOnPropertyValueChanged('canSearch', () => {
            searchBtn.style.display = question.canSearch ? '' : 'none';
          });
          question.registerFunctionOnPropertyValueChanged('addTemplate', () => {
            addBtn.style.display =
              question.addRecord && question.addTemplate ? '' : 'none';
          });
          question.registerFunctionOnPropertyValueChanged('addRecord', () => {
            addBtn.style.display =
              question.addRecord && question.addTemplate ? '' : 'none';
          });
        }
      }
      // Adding an open url icon for urls inputs
      if (question.inputType === 'url') {
        // Generate the dynamic component with its parameters
        const button = domService.appendComponentToBody(
          SafeButtonComponent,
          el.parentElement
        );
        const instance: SafeButtonComponent = button.instance;
        instance.isIcon = true;
        instance.icon = 'open_in_new';
        instance.size = ButtonSize.SMALL;
        instance.category = ButtonCategory.TERTIARY;
        instance.variant = 'default';
        // we override the css of the component
        const domElem = (button.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;
        (domElem.firstChild as HTMLElement).style.minWidth = 'unset';
        (domElem.firstChild as HTMLElement).style.backgroundColor = 'unset';
        (domElem.firstChild as HTMLElement).style.color = 'black';

        // Set the default styling of the parent
        el.parentElement.style.display = 'flex';
        el.parentElement.style.alignItems = 'center';
        el.parentElement.style.flexDirection = 'row';
        el.parentElement.style.pointerEvents = 'auto';
        el.parentElement.style.justifyContent = 'space-between';
        el.parentElement.title =
          'The URL should start with "http://" or "https://"';

        // Create an <a> HTMLElement only used to verify the validity of the URL
        const urlTester = document.createElement('a');
        if (
          el.value &&
          !(el.value.startsWith('https://') || el.value.startsWith('http://'))
        ) {
          urlTester.href = 'https://' + el.value;
        } else {
          urlTester.href = el.value || '';
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        urlTester.host && urlTester.host !== window.location.host
          ? (instance.disabled = false)
          : (instance.disabled = true);

        question.survey.onValueChanged.add((_: any, options: any) => {
          if (options.question.name === question.name) {
            if (
              el.value &&
              !(
                el.value.startsWith('https://') ||
                el.value.startsWith('http://')
              )
            ) {
              urlTester.href = 'https://' + el.value;
            } else {
              urlTester.href = el.value || '';
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            urlTester.host && urlTester.host !== window.location.host
              ? (instance.disabled = false)
              : (instance.disabled = true);
          }
        });

        button.instance.emittedEventSubject.subscribe((eventType: string) => {
          if (
            eventType === 'click' &&
            urlTester.host &&
            urlTester.host !== window.location.host
          ) {
            window.open(urlTester.href, '_blank', 'noopener,noreferrer');
          }
        });
      }
      if (question.getType() === 'file') {
        question.maxSize = 7340032;
      }
      // === REFERENCE DATA CHOICES ===
      if (SELECTABLE_TYPES.includes(question.getType())) {
        question.registerFunctionOnPropertyValueChanged('referenceData', () => {
          question.referenceDataDisplayField = null;
        });
        if (question.referenceData && question.referenceDataDisplayField) {
          if (
            question.populatedReferenceData !==
            question.referenceData + question.referenceDataDisplayField
          ) {
            question.populatedReferenceData =
              question.referenceData + question.referenceDataDisplayField;
            referenceDataService
              .getChoices(
                question.referenceData,
                question.referenceDataDisplayField
              )
              .then((choices) => {
                question.choices = choices;
              });
          }
        }
      }
    },
    willUnmount: (): void => {},
  };

  const buildSearchButton = (
    question: any,
    fieldsSettingsForm: FormGroup,
    multiselect: boolean
  ): any => {
    const searchButton = document.createElement('button');
    searchButton.innerText = 'Search';
    searchButton.style.marginRight = '8px';
    if (fieldsSettingsForm) {
      searchButton.onclick = () => {
        const dialogRef = dialog.open(SafeResourceGridModalComponent, {
          data: {
            multiselect,
            gridSettings: fieldsSettingsForm,
            selectedRows: Array.isArray(question.value)
              ? question.value
              : question.value
              ? [question.value]
              : [],
            selectable: true,
          },
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

  const buildAddButton = (
    question: any,
    multiselect: boolean,
    gridComponent?: SafeCoreGridComponent
  ): any => {
    const addButton = document.createElement('button');
    addButton.innerText = 'Add new record';
    if (question.addRecord && question.addTemplate) {
      addButton.onclick = () => {
        const dialogRef = dialog.open(SafeFormModalComponent, {
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
        dialogRef.afterClosed().subscribe((res) => {
          if (res) {
            // TODO: call reload method
            // if (question.displayAsGrid && gridComponent) {
            //   gridComponent.availableRecords.push({
            //     value: res.data.id,
            //     text: res.data.data[question.displayField]
            //   });
            // }
            if (multiselect) {
              const newItem = {
                value: res.data.id,
                text: res.data.data[question.displayField],
              };
              question.contentQuestion.choices = [
                newItem,
                ...question.contentQuestion.choices,
              ];
              question.value = question.value.concat(res.data.id);
            } else {
              const newItem = {
                value: res.data.id,
                text: res.data.data[question.displayField],
              };
              question.contentQuestion.choices = [
                newItem,
                ...question.contentQuestion.choices,
              ];
              question.value = res.data.id;
            }
          }
        });
      };
    }
    addButton.style.display =
      question.addRecord && question.addTemplate ? '' : 'none';
    return addButton;
  };

  const buildRecordDropdown = (question: any, el: any): any => {
    const dropdown = domService.appendComponentToBody(
      SafeRecordDropdownComponent,
      el.parentElement
    );
    const instance: SafeRecordDropdownComponent = dropdown.instance;
    instance.resourceId = question.resource;
    instance.filter = question.filters;
    instance.field = question.displayField;
    instance.placeholder = question.placeholder;
    instance.record = question.value;
    question.survey.onValueChanged.add((_: any, options: any) => {
      if (options.name === question.name) {
        instance.record = question.value;
      }
    });
    instance.choice.subscribe((res) => (question.value = res));
    return instance;
  };

  const buildRecordsGrid = (question: any, el: any): any => {
    let instance: SafeCoreGridComponent;
    if (question.displayAsGrid) {
      const grid = domService.appendComponentToBody(
        SafeCoreGridComponent,
        el.parentElement
      );
      instance = grid.instance;
      setGridInputs(instance, question);
      question.survey.onValueChanged.add((_: any, options: any) => {
        if (options.name === question.name) {
          setGridInputs(instance, question);
        }
      });
      return instance;
    }
    return null;
  };

  /**
   * Sets the inputs of the grid.
   *
   * @param instance grid instance.
   * @param question survey question.
   */
  const setGridInputs = (
    instance: SafeCoreGridComponent,
    question: any
  ): void => {
    instance.multiSelect = true;
    const query = question.gridFieldsSettings || {};
    const settings = {
      query: {
        ...query,
        filter: {
          logic: 'and',
          filters: [
            {
              field: 'ids',
              operator: 'eq',
              value: question.value || [],
            },
          ],
        },
      },
    };
    if (!question.readOnlyGrid) {
      Object.assign(settings, {
        actions: {
          delete: question.canDelete,
          history: question.history,
          convert: question.convert,
          update: question.update,
          inlineEdition: question.inlineEdition,
          export: question.export,
        },
      });
    }
    instance.settings = settings;
    instance.ngOnChanges();
  };

  survey.CustomWidgetCollection.Instance.addCustomWidget(
    widget,
    'customwidget'
  );
};
