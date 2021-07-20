import { Apollo } from 'apollo-angular';
import {
  GET_RESOURCE_BY_ID,
  GET_RESOURCES,
  GetResourceByIdQueryResponse,
  GetResourcesQueryResponse
} from '../../graphql/queries';
import { BehaviorSubject } from 'rxjs';
import * as SurveyCreator from 'survey-creator';
import { ConfigDisplayGridFieldsModalComponent } from '../../components/config-display-grid-fields-modal/config-display-grid-fields-modal.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

export const resourcesFilterValues =
  new BehaviorSubject<{ field: string, operator: string, value: string }[]>([{field: '', operator: '', value: ''}]);

export const resourceConditions = [
  {value: '=', text: 'equals'},
  {value: '!=', text: 'not equals'},
  {value: 'contains', text: 'contains'},
  {value: '>', text: 'greater'},
  {value: '<', text: 'less'},
  {value: '>=', text: 'greater or equals'},
  {value: '<=', text: 'less or equals'}
];

export function init(Survey: any, apollo: Apollo, dialog: MatDialog, formBuilder: FormBuilder): void {
  let resourcesForms: any[] = [];
  const getResources = () => apollo.query<GetResourcesQueryResponse>({
    query: GET_RESOURCES,
  });

  const getResourceById = (data: {
    id: string, filters?:
      { field: string, operator: string, value: string }[]
  }) => {
    return apollo.query<GetResourceByIdQueryResponse>({
      query: GET_RESOURCE_BY_ID,
      variables: {
        id: data.id,
        filters: data.filters
      }
    });
  };

  const hasUniqueRecord = ((id: string) =>
    resourcesForms.filter(r => (r.id === id && r.coreForm && r.coreForm.uniqueRecord)).length > 0);

  let filters: { field: string, operator: string, value: string }[] = [{
    field: '',
    operator: '',
    value: ''
  }];

  const component = {
    name: 'resources',
    title: 'Resources',
    category: 'Custom Questions',
    questionJSON: {
      name: 'resources',
      type: 'tagbox',
      optionsCaption: 'Select a record...',
      choicesOrder: 'asc',
      choices: [] as any[],
    },
    resourceFieldsName: [] as any[],
    onInit: (): void => {
      Survey.Serializer.addProperty('resources', {
        name: 'resource',
        category: 'Custom Questions',
        visibleIndex: 3,
        required: true,
        choices: (obj: any, choicesCallback: any) => {
          getResources().subscribe((response) => {
            const serverRes = response.data.resources;
            resourcesForms = response.data.resources;
            const res = [];
            res.push({value: null});
            for (const item of serverRes) {
              res.push({value: item.id, text: item.name});
            }
            choicesCallback(res);
          });
        },
      });
      Survey.Serializer.addProperty('resources', {
        name: 'displayField',
        category: 'Custom Questions',
        dependsOn: 'resource',
        required: true,
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource) {
            getResourceById({id: obj.resource}).subscribe((response) => {
              const serverRes = response.data.resource.fields;
              const res = [];
              res.push({value: null});
              for (const item of serverRes) {
                if (item.type !== 'matrix') {
                  res.push({value: item.name});
                }
              }
              choicesCallback(res);
            });
          }
        },
      });

      // Build set available grid fields button
      Survey
        .JsonObject
        .metaData
        .addProperty('resources', {
          name: 'Search resource table',
          type: 'availableFieldsBtn',
          isRequired: true,
          category: 'Custom Questions',
          dependsOn: 'resource',
          visibleIf: (obj: any) => !!obj && !!obj.resource,
          visibleIndex: 4
        });

      const setGridFieldsBtn = {
        render: (editor: any, htmlElement: any) => {
          const btn = document.createElement('button');
          btn.innerText = 'Available grid fields';
          btn.style.width = '100%';
          btn.style.border = 'none';
          btn.style.padding = '10px';
          htmlElement.appendChild(btn);
          btn.onclick = (ev: any) => {
            const currentQuestion = editor.object;
            getResourceById({id: currentQuestion.resource}).subscribe(response => {
              if (response.data.resource && response.data.resource.name) {
                const nameTrimmed = response.data.resource.name.replace(/\s/g, '').toLowerCase();
                const dialogRef = dialog.open(ConfigDisplayGridFieldsModalComponent, {
                  data: {
                    form: !currentQuestion.gridFieldsSettings ? null :
                      convertFromRawToFormGroup(currentQuestion.gridFieldsSettings),
                    resourceName: nameTrimmed
                  }
                });
                dialogRef.afterClosed().subscribe((res: any) => {
                  if (res && res.value.fields) {
                    currentQuestion.gridFieldsSettings = res.getRawValue();
                  }
                });
              }
            });

          };

          function convertFromRawToFormGroup(gridSettingsRaw: any): FormGroup | null {
            if (!gridSettingsRaw.fields) {
              return null;
            }
            const auxForm = formBuilder.group(gridSettingsRaw);
            auxForm.controls.fields.setValue(gridSettingsRaw.fields);
            return auxForm;
          }
        }
      };

      SurveyCreator
        .SurveyPropertyEditorFactory
        .registerCustomEditor('availableFieldsBtn', setGridFieldsBtn);


      Survey.Serializer.addProperty('resources', {
        name: 'test service',
        category: 'Custom Questions',
        dependsOn: ['resource', 'displayField'],
        required: true,
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource || !obj.displayField) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource) {
            getResourceById({id: obj.resource}).subscribe((response) => {
              const serverRes = response.data.resource.records || [];
              const res = [];
              res.push({value: null});
              for (const item of serverRes) {
                res.push({value: item.id, text: item.data[obj.displayField]});
              }
              choicesCallback(res);
            });
          }
        },
      });
      Survey.Serializer.addProperty('resources', {
        name: 'displayAsGrid:boolean',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
      });
      Survey.Serializer.addProperty('resources', {
        name: 'canAddNew:boolean',
        category: 'Custom Questions',
        dependsOn: 'resource',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return !hasUniqueRecord(obj.resource);
          }
        },
        visibleIndex: 3,
      });
      Survey.Serializer.addProperty('resources', {
        name: 'addTemplate',
        category: 'Custom Questions',
        dependsOn: ['canAddNew', 'resource'],
        visibleIf: (obj: any) => {
          if (!obj.resource || !obj.canAddNew) {
            return false;
          } else {
            const uniqueRecord = hasUniqueRecord(obj.resource);
            if (uniqueRecord) {
              obj.canAddNew = false;
            }
            return !uniqueRecord;
          }
        },
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource && obj.canAddNew) {
            getResourceById({id: obj.resource}).subscribe((response) => {
              const serverRes = response.data.resource.forms || [];
              const res = [];
              res.push({value: null});
              for (const item of serverRes) {
                res.push({value: item.id, text: item.name});
              }
              choicesCallback(res);
            });
          }
        },
      });
      Survey.Serializer.addProperty('resources', {
        name: 'selectQuestion:dropdown',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField'],
        required: true,
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource || !obj.displayField) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj && obj.resource) {
            const questions: any[] = ['', {value: '#staticValue', text: 'Set from static value'}];
            obj.survey.getAllQuestions().forEach((question: any) => {
              if (question.id !== obj.id) {
                questions.push(question.name);
              }
            });
            choicesCallback(questions);
          }
        },
      });
      Survey.Serializer.addProperty('resources', {
          name: 'gridFieldsSettings',
          dependsOn: 'resource',
          visibleIf: (obj: any) => {
            obj.gridFieldsSettings = obj.resource ? obj.gridFieldsSettings : new FormGroup({}).getRawValue();
            return false;
          }
        }
      ),
        Survey.Serializer.addProperty('resources', {
          type: 'string',
          name: 'staticValue',
          category: 'Filter by Questions',
          dependsOn: ['resource', 'selectQuestion', 'displayField'],
          visibleIf: (obj: any) => obj.selectQuestion === '#staticValue' && obj.displayField,
          visibleIndex: 3,
        });
      Survey.Serializer.addProperty('resources', {
        type: 'dropdown',
        name: 'filterBy',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField', 'selectQuestion'],
        visibleIf: (obj: any) => obj.selectQuestion && obj.displayField,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource) {
            getResourceById({id: obj.resource}).subscribe((response) => {
              const serverRes = response.data.resource.fields;
              const res = [];
              for (const item of serverRes) {
                res.push({value: item.name});
              }
              choicesCallback(res);
            });
          }
        },
        visibleIndex: 3,
      });
      Survey.Serializer.addProperty('resources', {
        type: 'dropdown',
        name: 'filterCondition',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'displayField', 'selectQuestion'],
        visibleIf: (obj: any) => obj.resource && obj.displayField && obj.selectQuestion,
        choices: (obj: any, choicesCallback: any) => {
          const questionByName = !!obj.survey.getQuestionByName(obj.selectQuestion) ?
            obj.survey.getQuestionByName(obj.selectQuestion) : obj.customQuestion;
          if (questionByName && questionByName.inputType === 'date') {
            choicesCallback(resourceConditions.filter(r => r.value !== 'contains'));
          } else if (!!questionByName.customQuestion && questionByName.customQuestion.name === 'countries') {
            choicesCallback(resourceConditions.filter(r => r.value === 'contains'));
          } else {
            choicesCallback(resourceConditions);
          }
        },
        visibleIndex: 3
      });
      Survey.Serializer.addProperty('resources', {
          category: 'Filter by Questions',
          type: 'selectResourceText',
          name: 'selectResourceText',
          displayName: 'Select a resource',
          dependsOn: ['resource', 'displayField'],
          visibleIf: (obj: any) => !obj.resource || !obj.displayField,
          visibleIndex: 3
        }
      );

      const selectResourceText = {
        render: (editor: any, htmlElement: any): void => {
          const text = document.createElement('div');
          text.innerHTML = 'First you have to select a resource and select display field before set filters';
          htmlElement.appendChild(text);
        }
      };
      SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor('selectResourceText', selectResourceText);

      Survey.Serializer.addProperty('resources', {
          category: 'Filter by Questions',
          type: 'customFilter',
          name: 'customFilterEl',
          displayName: 'Custom Filter',
          dependsOn: ['resource', 'selectQuestion'],
          visibleIf: (obj: any) => obj.resource && !obj.selectQuestion,
          visibleIndex: 3
        }
      );

      Survey.Serializer.addProperty('resources', {
          category: 'Filter by Questions',
          type: 'text',
          name: 'customFilter',
          displayName: ' ',
          dependsOn: ['resource', 'selectQuestion'],
          visibleIf: (obj: any) => obj.resource && !obj.selectQuestion,
          visibleIndex: 4
        }
      );

    },
    onLoaded(question: any): void {
      if (question.placeholder) {
        question.contentQuestion.optionsCaption = question.placeholder;
      }
      if (question.resource) {
        if (question.selectQuestion) {
          if (filters.length === 0) {
            filters = [{
              field: '',
              operator: '',
              value: ''
            }];
          }
          filters[0].operator = question.filterCondition;
          filters[0].field = question.filterBy;
          if (question.displayAsGrid) {
            resourcesFilterValues.next(filters);
          }
          if (question.selectQuestion) {
            question.registerFunctionOnPropertyValueChanged('filterCondition',
              () => {
                const resourcesFilters = resourcesFilterValues.getValue();
                resourcesFilters[0].operator = question.filterCondition;
                resourcesFilterValues.next(resourcesFilters);
                resourcesFilters.map((i: any) => {
                  i.operator = question.filterCondition;
                });
              });
          }
        }
        getResourceById({id: question.resource}).subscribe(response => {
          const serverRes = response.data.resource.records || [];
          const res = [];
          for (const item of serverRes) {
            res.push({value: item.id, text: item.data[question.displayField]});
          }
          question.contentQuestion.choices = res;
          if (!question.placeholder) {
            question.contentQuestion.optionsCaption = 'Select a record from ' + response.data.resource.name + '...';
          }
          if (!question.filterBy || question.filterBy.length < 1) {
            this.populateChoices(question);
          }
          question.survey.render();
        });
        if (question.selectQuestion) {
          if (question.selectQuestion === '#staticValue') {
            setAdvanceFilter(question.staticValue, question);
            this.populateChoices(question);
          } else {
            question.survey.onValueChanged.add((survey: any, options: any) => {
              if (options.name === question.selectQuestion) {
                if (!!options.value || options.question.customQuestion) {
                  const valueType = options.question.customQuestion ? options.question.customQuestion.name :
                    question.survey.getQuestionByName(question.selectQuestion).inputType;
                  const value = valueType === 'countries' && options.value.length === 0 ? '' : options.value;
                  setAdvanceFilter(value, question);
                  if (question.displayAsGrid) {
                    resourcesFilterValues.next(filters);
                  } else {
                    this.populateChoices(question);
                  }
                }
              }
            });
          }
        } else if (!question.selectQuestion && question.customFilter && question.customFilter.trim().length > 0) {
          const obj = JSON.parse(question.customFilter);
          if (obj) {
            for (const objElement of obj) {
              const value = objElement.value;
              if (typeof value === 'string' && value.match(/^{*.*}$/)) {
                const quest = value.substr(1, value.length - 2);
                objElement.value = '';
                question.survey.onValueChanged.add((survey: any, options: any) => {
                  if (options.question.name === quest) {
                    if (!!options.value) {
                      setAdvanceFilter(options.value, objElement.field);
                      if (question.displayAsGrid) {
                        resourcesFilterValues.next(filters);
                      } else {
                        this.populateChoices(question, objElement.field);
                      }
                    }
                  }
                });
              }
            }
            filters = obj;
            this.populateChoices(question);
          }
        }
      }
    },
    populateChoices(question: any, field?: string): void {
      if (question.displayAsGrid) {
        if (question.selectQuestion) {
          const f = field ? field : question.filteryBy;
          const obj = filters.filter((i: any) => i.field === f);
          if (obj.length > 0) {
            resourcesFilterValues.next(obj);
          }
        } else if (question.customFilter) {
          resourcesFilterValues.next(filters);
        }
      } else {
        getResourceById({id: question.resource, filters}).subscribe((response) => {
          const serverRes = response.data.resource.records || [];
          const res: any[] = [];
          for (const item of serverRes) {
            res.push({value: item.id, text: item.data[question.displayField]});
          }
          question.contentQuestion.choices = res;
        });
      }
    },
    onPropertyChanged(question: any, propertyName: string, newValue: any): void {
      if (propertyName === 'resource') {
        question.displayField = null;
        filters = [];
        this.resourceFieldsName = [];
        question.canAddNew = false;
        question.addTemplate = null;
      }
    },
    onAfterRender(question: any, el: any): void {
      if (question.displayAsGrid) {
        // hide tagbox if grid view is enable
        const element = el.getElementsByClassName('select2 select2-container')[0].parentElement;
        element.style.display = 'none';
      }

      if (question.canAddNew && question.addTemplate) {
        document.addEventListener('saveResourceFromEmbed', (e: any) => {
          const detail = e.detail;
          if (detail.template === question.addTemplate && question.resource) {
            getResourceById({id: question.resource}).subscribe((response) => {
              const serverRes = response.data.resource.records || [];
              const res = [];
              for (const item of serverRes) {
                res.push({
                  value: item.id,
                  text: item.data[question.displayField],
                });
              }
              question.contentQuestion.choices = res;
              question.survey.render();
            });
          }
        });
      }
    }
  };
  Survey.ComponentCollection.Instance.add(component);

  const setAdvanceFilter = (value: string, question: string | any) => {
    const field = typeof question !== 'string' ? question.filterBy : question;
    if (!filters.some((x: any) => x.field === field)) {
      filters.push({field: question.filterBy, operator: question.filterCondition, value});
    } else {
      filters.map((x: any) => {
        if (x.field === field) {
          x.value = value;
        }
      });
    }
  };
}
