import { MatDialog } from '@angular/material/dialog';
import { SafeFormModalComponent } from '../components/form-modal/form-modal.component';
import { DomService } from '../services/dom.service';
import { SafeResourceGridModalComponent } from '../components/search-resource-grid-modal/search-resource-grid-modal.component';
import { FormGroup } from '@angular/forms';
import { SafeResourceGridComponent } from '../components/resource-grid/resource-grid.component';
import { ChoicesRestful } from 'survey-angular';
import { SafeButtonComponent } from '../components/ui/button/button.component';
import { ButtonSize } from '../components/ui/button/button-size.enum';
import { ButtonCategory } from '../components/ui/button/button-category.enum';
import { EmbeddedViewRef } from '@angular/core';

function addZero(i: any): string {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

export function init(Survey: any, domService: DomService, dialog: MatDialog, environment: any): void {
  const widget = {
    name: 'custom-widget',
    widgetIsLoaded(): boolean {
      return true;
    },
    isFit(question: any): any {
      return true;
    },
    init(): void {
      Survey.Serializer.addProperty('question', {
        name: 'tooltip:text',
        category: 'general'
      });
      Survey.Serializer.addProperty('comment', {
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
        }
      });
      Survey.Serializer.removeProperty('expression', 'readOnly');
      Survey.Serializer.addProperty('expression', {
        name: 'readOnly:boolean',
        type: 'boolean',
        visibleIndex: 6,
        default: false,
        category: 'general',
        required: true,
      });
      // Pass token before the request to fetch choices by URL if it's targeting SAFE API
      Survey.ChoicesRestfull.onBeforeSendRequest = (sender: ChoicesRestful, options: { request: XMLHttpRequest }) => {
        if (sender.url.includes(environment.API_URL)) {
          const token = localStorage.getItem('msal.idtoken');
          options.request.setRequestHeader('Authorization', `Bearer ${token}`);
        }
      };
    },
    isDefaultRender: true,
    afterRender(question: any, el: any): void {
      // Correction of date inputs
      if (question.value && ['date', 'datetime', 'datetime-local', 'time'].includes(question.inputType)) {
        const date = new Date(question.value);
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
        question.registerFunctionOnPropertyValueChanged('allowEdition',
          () => {
            mainDiv.style.display = !question.allowEdition ? 'none' : '';
          });
        question.registerFunctionOnPropertyValueChanged('readOnly',
          () => {
            mainDiv.style.display = !question.readOnly ? 'none' : '';
          });
        btnEl.onclick = () => {
          question.readOnly = false;
        };
      }
      // Display of tooltip
      if (question.tooltip) {
        const header = el.parentElement.parentElement.querySelector('.sv-title-actions__title');
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
          question.registerFunctionOnPropertyValueChanged('tooltip',
            () => {
              span.style.display = !question.tooltip ? 'none' : '';
            });
        }
      }
      // Display of add button for resource question
      if (question.getType() === 'resource' && question.resource) {

        if (question.survey.mode !== 'display') {
          const actionsButtons = document.createElement('div');
          actionsButtons.id = 'actionsButtons';
          actionsButtons.style.display = 'flex';
          actionsButtons.style.marginBottom = '0.5em';

          const searchBtn = buildSearchButton(question, question.gridFieldsSettings, false);
          actionsButtons.appendChild(searchBtn);

          const addBtn = buildAddButton(question, false);
          actionsButtons.appendChild(addBtn);

          el.parentElement.insertBefore(actionsButtons, el);

          // actionsButtons.style.display = ((!question.canAddNew || !question.addTemplate) && !question.gridFieldsSettings) ? 'none' : '';

          question.registerFunctionOnPropertyValueChanged('gridFieldsSettings',
            () => {
              searchBtn.style.display = question.gridFieldsSettings ? '' : 'none';
            });
          question.registerFunctionOnPropertyValueChanged('canSearch',
            () => {
              searchBtn.style.display = question.canSearch ? '' : 'none';
            });
          question.registerFunctionOnPropertyValueChanged('addTemplate',
            () => {
              addBtn.style.display = (question.canAddNew && question.addTemplate) ? '' : 'none';
            });
          question.registerFunctionOnPropertyValueChanged('canAddNew',
            () => {
              addBtn.style.display = (question.canAddNew && question.addTemplate) ? '' : 'none';
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

          const searchBtn = buildSearchButton(question, question.gridFieldsSettings, true);
          actionsButtons.appendChild(searchBtn);

          const addBtn = buildAddButton(question, true, gridComponent);
          actionsButtons.appendChild(addBtn);

          el.parentElement.insertBefore(actionsButtons, el);
          // actionsButtons.style.display = ((!question.canAddNew || !question.addTemplate) && !question.gridFieldsSettings) ? 'none' : '';

          question.registerFunctionOnPropertyValueChanged('gridFieldsSettings',
            () => {
              searchBtn.style.display = question.gridFieldsSettings ? '' : 'none';
            });
          question.registerFunctionOnPropertyValueChanged('canSearch',
            () => {
              searchBtn.style.display = question.canSearch ? '' : 'none';
            });
          question.registerFunctionOnPropertyValueChanged('addTemplate',
            () => {
              addBtn.style.display = (question.canAddNew && question.addTemplate) ? '' : 'none';
            });
          question.registerFunctionOnPropertyValueChanged('canAddNew',
            () => {
              addBtn.style.display = (question.canAddNew && question.addTemplate) ? '' : 'none';
            });
        }
      }
      // Adding an open url icon for urls inputs
      if (question.inputType === 'url') {

        // Generate the dynamic component with its parameters
        let instance: SafeButtonComponent;
        const button = domService.appendComponentToBody(SafeButtonComponent, el.parentElement);
        instance = button.instance;
        instance.isIcon = true;
        instance.icon = 'open_in_new';
        instance.size = ButtonSize.SMALL;
        instance.category = ButtonCategory.TERTIARY;
        instance.variant = 'default';
        // we override the css of the component
        const domElem = (button.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        (domElem.firstChild as HTMLElement).style.minWidth = 'unset';
        (domElem.firstChild as HTMLElement).style.backgroundColor = 'unset';
        (domElem.firstChild as HTMLElement).style.color = 'black';

        // Set the default styling of the parent
        el.parentElement.style.display = 'flex';
        el.parentElement.style.alignItems = 'center';
        el.parentElement.style.flexDirection = 'row';
        el.parentElement.style.pointerEvents = 'auto';
        el.parentElement.style.justifyContent = 'space-between';
        el.parentElement.title = 'The URL should start with "http://" or "https://"';

        // Create an <a> HTMLElement only used to verify the validity of the URL
        const URLtester = document.createElement('a');
        URLtester.href = el.value;
        (URLtester.host && URLtester.host !== window.location.host) ? instance.disabled = false : instance.disabled = true;

        question.survey.onValueChanged.add((survey: any, options: any) => {
          if (options.question.name === question.name) {
            URLtester.href = el.value;
            (URLtester.host && URLtester.host !== window.location.host) ? instance.disabled = false : instance.disabled = true;
          }
        });

        button.instance.emittedEventSubject.subscribe((eventType: string) => {
          if (eventType === 'click' && URLtester.host && URLtester.host !== window.location.host) {
            window.open(URLtester.href, '_blank', 'noopener,noreferrer');
          }
        });
      }
    }
  };

  const buildSearchButton = (question: any, fieldsSettingsForm: FormGroup, multiselect: boolean): any => {
    const searchButton = document.createElement('button');
    searchButton.innerText = 'Search';
    searchButton.style.marginRight = '8px';
    if (fieldsSettingsForm) {
      searchButton.onclick = () => {
        const dialogRef = dialog.open(SafeResourceGridModalComponent, {
          data: {
            multiselect,
            gridSettings: fieldsSettingsForm,
            selectedRows: Array.isArray(question.value) ? question.value : question.value ? [question.value] : []
          }
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
    searchButton.style.display = (!question.isReadOnly && question.canSearch) ? '' : 'none';
    return searchButton;
  };

  const buildAddButton = (question: any, multiselect: boolean, gridComponent?: SafeResourceGridComponent): any => {
    const addButton = document.createElement('button');
    addButton.innerText = 'Add new record';
    if (question.canAddNew && question.addTemplate) {
      addButton.onclick = () => {
        const dialogRef = dialog.open(SafeFormModalComponent, {
          data: {
            template: question.addTemplate,
            locale: question.resource.value,
            askForConfirm: false
          },
          autoFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            if (question.displayAsGrid && gridComponent) {
              gridComponent.availableRecords.push({
                value: res.data.id,
                text: res.data.data[question.displayField]
              });
            }
            if (multiselect) {
              const newItem = {
                value: res.data.id,
                text: res.data.data[question.displayField]
              };
              question.contentQuestion.choices = [newItem, ...question.contentQuestion.choices];
              question.value = question.value.concat(res.data.id);
            } else {
              const newItem = {
                value: res.data.id,
                text: res.data.data[question.displayField]
              };
              question.contentQuestion.choices = [newItem, ...question.contentQuestion.choices];
              question.value = res.data.id;
            }
          }
        });
      };
    }
    addButton.style.display = (question.canAddNew && question.addTemplate) ? '' : 'none';
    return addButton;
  };

  const buildRecordsGrid = (question: any, el: any): any => {
    let instance: SafeResourceGridComponent;
    if (question.displayAsGrid) {
      const grid = domService.appendComponentToBody(SafeResourceGridComponent, el.parentElement);
      instance = grid.instance;
      instance.multiSelect = true;
      // instance.selectedRows = question.value || [];
      instance.readOnly = true;
      const questionQuery = question.gridFieldsSettings || {};
      // const questionFilter = questionQuery.filter || {};
      instance.settings = {
        query: {
          ...questionQuery, filter: {
            logic: 'and',
            filters: [{
              field: 'ids',
              operator: 'eq',
              value: question.value || []
            }]
            // ...questionFilter
          }
        }
      };
      question.survey.onValueChanged.add((survey: any, options: any) => {
        if (options.name === question.name) {
          instance.settings = {
            query: {
              ...questionQuery, filter: {
                logic: 'and',
                filters: [{
                  field: 'ids',
                  operator: 'eq',
                  value: question.value || []
                }]
                // ...questionFilter
              }
            }
          };
          instance.init();
        }
      });
      return instance;
    }
    return null;
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, 'customwidget');
}
