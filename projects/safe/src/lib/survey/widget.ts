import { MatDialog } from '@angular/material/dialog';
import { SafeFormModalComponent } from '../components/form-modal/form-modal.component';
import { DomService } from '../services/dom.service';
import { SafeResourceGridModalComponent } from '../components/search-resource-grid-modal/search-resource-grid-modal.component';
import { FormGroup } from '@angular/forms';
import { SafeResourceGridComponent } from '../components/resource-grid/resource-grid.component';
import { ChoicesRestful } from 'survey-angular';

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

        const svgHtmlPath = './assets/donut.svg';
        const svgHtml = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>';

        // Build HTMLElement from string and retrieve only the childNode without body
        const svgElem = (new DOMParser().parseFromString(svgHtml, 'text/html')).body.childNodes[0];

        // Create the anchor element that will contain the icon
        const linkContainer = document.createElement('a');

        // Set the default parameters and styling of the anchor
        linkContainer.target = '_blank';
        linkContainer.rel = 'noreferrer noopener';
        linkContainer.style.fill = '#d7d7d7';
        linkContainer.style.width = '24px';
        linkContainer.style.height = '24px';

        // Set the default styling of the parent
        el.parentElement.style.flexDirection = 'row';
        el.parentElement.style.justifyContent = 'space-between';
        el.parentElement.style.alignItems = 'center';
        el.parentElement. title = 'The URL should start with "http://" or "https://"';

        // Insert the icon in the anchor element
        linkContainer.appendChild(svgElem);

        // Update the link value when input change and update icon style in consequence
        el.addEventListener('input', (e: any) => {
          linkContainer.href = el.value;

          if (linkContainer.host && linkContainer.host !== window.location.host) {
            linkContainer.style.pointerEvents = 'auto';
            linkContainer.style.fill = '#008dc9';
          }
          else {
            linkContainer.style.pointerEvents = 'none';
            linkContainer.style.fill = '#d7d7d7';
          }
        });

        // Insert the elements in the DOM
        el.parentElement.insertBefore(linkContainer, null);

        // Execute the event listener to set the intial value and styling
        el.dispatchEvent(new Event('input'));
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
            locale: question.resource.value
          }
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
