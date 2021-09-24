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
      Survey.ChoicesRestfull.onBeforeSendRequest = (sender: ChoicesRestful, options: {request: XMLHttpRequest}) => {
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
      if (question.getType() === 'resource') {
        const searchBtn = buildSearchButton(question, question.gridFieldsSettings, false);
        const mainDiv = document.createElement('div');
        mainDiv.id = 'addRecordDiv';
        const btnEl = document.createElement('button');
        btnEl.innerText = 'Add new record';
        btnEl.style.float = 'left';
        btnEl.style.width = '150px';
        if (question.canAddNew && question.addTemplate) {
          btnEl.onclick = () => {
            const dialogRef = dialog.open(SafeFormModalComponent, {
              data: {
                template: question.addTemplate,
                locale: question.resource.value
              }
            });
            dialogRef.afterClosed().subscribe(res => {
              if (res) {
                const e = new CustomEvent('saveResourceFromEmbed',
                  { detail: { resource: res.data, template: res.template } });
                document.dispatchEvent(e);
                question.value = res.data.id;
              }
            });
          };
        }
        mainDiv.appendChild(btnEl);
        el.parentElement.insertBefore(searchBtn, el);
        el.parentElement.insertBefore(mainDiv, el);
        mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';

        question.registerFunctionOnPropertyValueChanged('addTemplate',
          () => {
            mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';
          });
        question.registerFunctionOnPropertyValueChanged('canAddNew',
          () => {
            mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';
          });
      }
      // Display of add button | grid for resources question
      if (question.getType() === 'resources') {
        if (question.resource) {
          const searchBtn = buildSearchButton(question, question.gridFieldsSettings, true);
          el.parentElement.insertBefore(searchBtn, el);

          let instance: SafeResourceGridComponent;
          if (question.displayAsGrid) {
            const grid = domService.appendComponentToBody(SafeResourceGridComponent, el.parentElement);
            instance = grid.instance;
            instance.multiSelect = true;
            // instance.selectedRows = question.value || [];
            instance.readOnly = true;
            const questionQuery = question.gridFieldsSettings || {};
            const questionFilter = questionQuery.filter || {};
            instance.settings = {
              query: {
                ...questionQuery, filter: {
                  ...questionFilter,
                  ids: question.value || []
                }
              }
            };
            question.survey.onValueChanged.add((survey: any, options: any) => {
              if (options.name === question.name) {
                instance.settings = {
                  query: {
                    ...questionQuery, filter: {
                      ...questionFilter,
                      ids: options.value || []
                    }
                  }
                };
                instance.init();
              }
            });
          }
          if (question.survey.mode !== 'display') {
            const mainDiv = document.createElement('div');
            mainDiv.id = 'addRecordDiv';
            const btnEl = document.createElement('button');
            btnEl.innerText = 'Add new record';
            btnEl.style.width = '150px';
            if (question.canAddNew && question.addTemplate) {
              btnEl.onclick = () => {
                const dialogRef = dialog.open(SafeFormModalComponent, {
                  data: {
                    template: question.addTemplate,
                    locale: question.resource
                  }
                });
                dialogRef.afterClosed().subscribe(res => {
                  if (res) {
                    if (question.displayAsGrid) {
                      instance.availableRecords.push({
                        value: res.data.id,
                        text: res.data.data[question.displayField]
                      });
                    } else {
                      const e = new CustomEvent('saveResourceFromEmbed', {
                        detail: {
                          resource: res.data,
                          template: res.template
                        }
                      });
                      document.dispatchEvent(e);
                    }
                    // there we really change the value and so trigger the method
                    question.value = question.value.concat(res.data.id);
                  }
                });
              };
            }
            mainDiv.appendChild(btnEl);
            el.parentElement.insertBefore(mainDiv, el);
            mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';

            question.registerFunctionOnPropertyValueChanged('addTemplate',
              () => {
                mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';
              });
            question.registerFunctionOnPropertyValueChanged('canAddNew',
              () => {
                mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';
              });
          }
        }
      }
    }
  };

  function buildSearchButton(question: any, fieldsSettingsForm: FormGroup, multiselect: boolean): any {
    const mainDiv = document.createElement('div');
    mainDiv.id = 'searchDiv';
    mainDiv.style.height = '23px';
    mainDiv.style.marginBottom = '0.5em';
    if (fieldsSettingsForm) {
      const btnEl = document.createElement('button');
      btnEl.innerText = 'Search';
      btnEl.style.width = '100px';
      btnEl.style.float = 'left';
      btnEl.style.marginRight = '5px';
      btnEl.onclick = () => {
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
      mainDiv.appendChild(btnEl);
    }
    return mainDiv;
  }

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, 'customwidget');
}
