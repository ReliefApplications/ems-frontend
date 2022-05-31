import { MatDialog } from '@angular/material/dialog';
import { SafeFormModalComponent } from '../components/form-modal/form-modal.component';
import { DomService } from '../services/dom.service';
import { SafeResourceGridModalComponent } from '../components/search-resource-grid-modal/search-resource-grid-modal.component';
import { FormGroup } from '@angular/forms';
import { ChoicesRestful } from 'survey-angular';
import { SafeButtonComponent } from '../components/ui/button/button.component';
import { ButtonSize } from '../components/ui/button/button-size.enum';
import { ButtonCategory } from '../components/ui/button/button-category.enum';
import { EmbeddedViewRef } from '@angular/core';
import { SafeRecordDropdownComponent } from '../components/record-dropdown/record-dropdown.component';
import { SafeCoreGridComponent } from '../components/ui/core-grid/core-grid.component';
import {
  DatePickerComponent,
  DateTimePickerComponent,
  TimePickerComponent,
} from '@progress/kendo-angular-dateinputs';
import * as SurveyCreator from 'survey-creator';

/**
 * Custom definition for survey. Definition of all additional code built on the default logic.
 *
 * @param survey Survey instance
 * @param domService Shared DOM service
 * @param dialog Material dialog service
 * @param environment Current environment
 */
export const init = (
  survey: any,
  domService: DomService,
  dialog: MatDialog,
  environment: any
): void => {
  const widget = {
    name: 'custom-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: any): any => true,
    init: (): void => {
      survey.Serializer.addProperty('question', {
        name: 'tooltip:text',
        category: 'general',
      });
      survey.Serializer.addProperty('comment', {
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
      survey.Serializer.removeProperty('expression', 'readOnly');
      survey.Serializer.addProperty('expression', {
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
      survey.Serializer.addProperty('survey', {
        name: 'onCompleteExpression:expression',
        type: 'expression',
        visibleIndex: 350,
        category: 'logic',
      });
      // hide the min and max property for date, datetime and time types
      survey.Serializer.getProperty('text', 'min').visibleIf = (obj: any) =>
        ['number', 'month', 'week'].includes(obj.inputType || '');
      survey.Serializer.getProperty('text', 'max').visibleIf = (obj: any) =>
        ['number', 'month', 'week'].includes(obj.inputType || '');
      // create new min and max properties for date, datetime and time types
      survey.Serializer.addProperty('text', {
        name: 'dateMin',
        type: 'date',
        category: 'general',
        visibleIndex: 8,
        dependsOn: 'inputType',
        visibleIf: (obj: any) =>
          ['date', 'datetime', 'datetime-local', 'time'].includes(
            obj.inputType || ''
          ),
        onPropertyEditorUpdate: (obj: any, propertyEditor: any) => {
          if (!!obj && !!obj.inputType) {
            propertyEditor.inputType = obj.inputType;
          }
        },
        onSetValue: (obj: any, value: any) => {
          obj.setPropertyValue('dateMin', value);
          obj.setPropertyValue('min', value);
        },
      });
      survey.Serializer.addProperty('text', {
        name: 'dateMax',
        type: 'date',
        category: 'general',
        visibleIndex: 9,
        dependsOn: 'inputType',
        visibleIf: (obj: any) =>
          ['date', 'datetime', 'datetime-local', 'time'].includes(
            obj.inputType || ''
          ),
        onPropertyEditorUpdate: (obj: any, propertyEditor: any) => {
          if (!!obj && !!obj.inputType) {
            propertyEditor.inputType = obj.inputType;
          }
        },
        onSetValue: (obj: any, value: any) => {
          obj.setPropertyValue('dateMax', value);
          obj.setPropertyValue('max', value);
        },
      });
      // register the editor for type "date" with kendo date picker
      const dateEditor = {
        render: (editor: any, htmlElement: any) => {
          const question = editor.object;
          const updatePickerInstance = () => {
            htmlElement.querySelector('.k-widget')?.remove();
            const pickerInstance = createPickerInstance(
              question.inputType,
              htmlElement
            );
            if (question[editor.property.name]) {
              pickerInstance.value = getDateDisplay(
                question[editor.property.name],
                question.inputType
              );
            }
            pickerInstance.registerOnChange((value: Date | null) => {
              if (value) {
                editor.onChanged(setDateValue(value, question.inputType));
              } else {
                editor.onChanged(null);
              }
            });
          };
          question.registerFunctionOnPropertyValueChanged(
            'inputType',
            updatePickerInstance,
            // eslint-disable-next-line no-underscore-dangle
            editor.property_.name // a unique key to distinguish multiple date properties
          );
          updatePickerInstance();
        },
      };
      SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor(
        'date',
        dateEditor
      );
    },
    isDefaultRender: true,
    afterRender: (question: any, el: any): void => {
      // add kendo date pickers for text inputs with dates types
      if (question.getType() === 'text') {
        const updateTextInput = () => {
          el.parentElement.querySelector('.k-widget')?.remove();
          if (
            ['date', 'datetime', 'datetime-local', 'time'].includes(
              question.inputType
            )
          ) {
            const pickerInstance = createPickerInstance(
              question.inputType,
              el.parentElement
            );
            if (question.value) {
              pickerInstance.value = getDateDisplay(
                question.value,
                question.inputType
              );
            }
            if (question.min) {
              pickerInstance.min = getDateDisplay(
                question.min,
                question.inputType
              );
            }
            if (question.max) {
              pickerInstance.max = getDateDisplay(
                question.max,
                question.inputType
              );
            }
            pickerInstance.readonly = question.isReadOnly;
            pickerInstance.disabled = question.isReadOnly;
            pickerInstance.registerOnChange((value: Date | null) => {
              if (value) {
                question.value = setDateValue(value, question.inputType);
              } else {
                question.value = null;
              }
            });
            el.style.display = 'none';
          } else {
            el.style.display = 'initial';
          }
        };
        question.registerFunctionOnPropertyValueChanged(
          'inputType',
          updateTextInput,
          el.id // a unique key to distinguish fields
        );
        updateTextInput();
      }
      // Display of edit button for comment question
      if (question.getType() === 'comment' && question.allowEdition) {
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
      const header =
        el.parentElement.parentElement.querySelector('.sv_q_title');
      if (header) {
        header.title = question.tooltip;
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
          header.title = question.tooltip;
        });
      }
      // Display of add button for resource question
      if (question.getType() === 'resource') {
        // const dropdownComponent = buildRecordDropdown(question, el);
        if (question.survey.mode !== 'display' && question.resource) {
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
    },
  };

  /**
   * Get date for input display.
   *
   * @param value question value
   * @param inputType question input type
   * @returns formatted date
   */
  const getDateDisplay = (value: any, inputType: string): Date => {
    const date = new Date(value);
    if (inputType === 'time') {
      return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    } else {
      return date;
    }
  };

  /**
   * Set date for question / parameter value
   *
   * @param value input value
   * @param inputType question input type
   * @returns formatted date
   */
  const setDateValue = (value: Date, inputType: string): Date | string => {
    if (inputType === 'time') {
      // for time fields, translate the date to UTC
      return new Date(
        Date.UTC(1970, 0, 1, value.getHours(), value.getMinutes())
      );
    } else {
      return value.toISOString();
    }
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
        },
      });
    }
    instance.settings = settings;
    instance.ngOnChanges();
  };

  /**
   * It creates a date, datetime or time picker instance based on the input type
   *
   * @param inputType - The type of the input element.
   * @param element - The element that the directive is attached to.
   * @returns The picker instance, or null if the type is not allowed
   */
  const createPickerInstance = (
    inputType: 'date' | 'datetime' | 'datetime-local' | 'time',
    element: any
  ): DatePickerComponent | DateTimePickerComponent | TimePickerComponent => {
    switch (inputType) {
      case 'date':
        const datePicker = domService.appendComponentToBody(
          DatePickerComponent,
          element
        );
        const datePickerInstance: DatePickerComponent = datePicker.instance;
        datePickerInstance.format = 'dd/MM/yyyy';
        return datePickerInstance;
      case 'datetime':
      case 'datetime-local':
        const dateTimePicker = domService.appendComponentToBody(
          DateTimePickerComponent,
          element
        );
        const dateTimePickerInstance: DateTimePickerComponent =
          dateTimePicker.instance;
        dateTimePickerInstance.format = 'dd/MM/yyyy HH:mm';
        return dateTimePickerInstance;
      case 'time':
        const timePicker = domService.appendComponentToBody(
          TimePickerComponent,
          element
        );
        const timePickerInstance: TimePickerComponent = timePicker.instance;
        timePickerInstance.format = 'HH:mm';
        return timePickerInstance;
    }
  };

  survey.CustomWidgetCollection.Instance.addCustomWidget(
    widget,
    'customwidget'
  );
};
