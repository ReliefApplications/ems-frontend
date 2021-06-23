import { MatDialog } from '@angular/material/dialog';
import { SafeFormModalComponent } from '../components/form-modal/form-modal.component';
import { DomService } from '../services/dom.service';
import { SafeResourceGridModalComponent } from '../components/search-resource-grid-modal/search-resource-grid-modal.component';
import { FormGroup } from '@angular/forms';
import { SafeResourceGridComponent } from '../components/resource-grid/resource-grid.component';

function addZero(i: any): string {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

export function init(Survey: any, domService: DomService, dialog: MatDialog): void {
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
      Survey.Serializer.removeProperty('expression', 'readOnly');
      Survey.Serializer.addProperty('expression', {
        name: 'readOnly:boolean',
        type: 'boolean',
        default: false,
        category: 'general',
        required: true,
      });
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
      // Display of tooltip
      if (question.tooltip) {
        const header = el.parentElement.parentElement.querySelector('h5');
        if (header) {
          header.title = question.tooltip;
          const span = document.createElement('span');
          span.innerText = 'info';
          span.className = 'material-icons';
          span.style.fontSize = '1em';
          span.style.cursor = 'pointer';
          header.appendChild(span);
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
                  {detail: {resource: res.data, template: res.template}});
                document.dispatchEvent(e);
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
            const selectedRows: string[] = [];
            for (const item of question.value) {
              selectedRows.push(item);
            }
            const grid = domService.appendComponentToBody(SafeResourceGridComponent, el.parentElement);
            instance = grid.instance;
            instance.multiSelect = true;
            instance.selectedRows = selectedRows;
            instance.readOnly = true;
            const questionQuery = question.gridFieldsSettings || {};
            const questionFilter = questionQuery.filter || {};
            instance.settings = {
              query: { ...questionQuery, filter: { ...questionFilter,
                  ids: selectedRows
                }
              }
            };
            // instance.id = question.resource;
            // instance.field = question.displayField;
            // instance.readOnly = (question.survey.mode === 'display');
            // instance.selectedIds.subscribe((value: any[]) => {
            //   question.value = value;
            // });
            // instance.selectedIds.next(selectedIds);
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
        dialogRef.afterClosed().subscribe((row: any[]) => {
          if (!row) {
            return;
          }
          if (row.length > 0) {
            if (row.length === 1) {
              question.value = row[0].dataItem.id;
            } else {
              question.value = row.map(r => r.dataItem ? r.dataItem.id : r);
            }
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
