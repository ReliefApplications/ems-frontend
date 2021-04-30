import { Apollo } from 'apollo-angular';
import {
  GET_BASIC_RESOURCE_BY_ID,
  GET_RESOURCES,
  GetResourceByIdQueryResponse,
  GetResourcesQueryResponse
} from '../../graphql/queries';
import * as SurveyCreator from 'survey-creator';
import { resourceConditions, resourcesFilterValues } from './resources';

export function init(Survey: any, apollo: Apollo): void {
  let resourcesForms: any[] = [];
  const getResources = () => apollo.query<GetResourcesQueryResponse>({
    query: GET_RESOURCES,
  });

  const getResourceById = (data: {
    id: string, filters?:
      { field: string, operator: string, value: string }[]
  }) => apollo.query<GetResourceByIdQueryResponse>({
    query: GET_BASIC_RESOURCE_BY_ID,
    variables: {
      id: data.id,
      filters: data.filters
    }
  });

  let filters: { field: string, operator: string, value: string }[] = [{field: '', operator: '', value: ''}];

  const hasUniqueRecord = ((id: string) =>
    resourcesForms.filter(r => (r.id === id && r.coreForm && r.coreForm.uniqueRecord)).length > 0);

  const component = {
    name: 'resource',
    title: 'Resource',
    category: 'Custom Questions',
    questionJSON: {
      name: 'resource',
      type: 'dropdown',
      optionsCaption: 'Select a record...',
      choicesOrder: 'asc',
      choices: [] as any[],
    },
    filters: [] as any[],
    resourceFieldsName: [] as any[],
    onInit(): void {
      Survey.Serializer.addProperty('resource', {
        name: 'resource',
        category: 'Custom Questions',
        visibleIndex: 3,
        required: true,
        choices: (obj: any, choicesCallback: any) => {
          getResources().subscribe(
            (response: any) => {
              const serverRes = response.data.resources;
              resourcesForms = response.data.resources;
              const res = [];
              res.push({value: null});
              for (const item of serverRes) {
                res.push({value: item.id, text: item.name});
              }
              choicesCallback(res);
            }
          );
        }
      });
      Survey.Serializer.addProperty('resource', {
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
          getResourceById({id: obj.resource}).subscribe(response => {
            const serverRes = response.data.resource.fields;
            const res = [];
            res.push({value: null});
            for (const item of serverRes) {
              res.push({value: item.name});
            }
            choicesCallback(res);
          });
        },
      });
      Survey.Serializer.addProperty('resource', {
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
            getResourceById({id: obj.resource}).subscribe(response => {
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
      Survey.Serializer.addProperty('resource', {
        name: 'canAddNew:boolean',
        category: 'Custom Questions',
        dependsOn: ['resource'],
        visibleIf: (obj: any) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return !hasUniqueRecord(obj.resource);
          }
        },
        visibleIndex: 3,
      });
      Survey.Serializer.addProperty('resource', {
        name: 'addTemplate',
        category: 'Custom Questions',
        dependsOn: ['canAddNew', 'resource'],
        visibleIf: (obj: any) => {
          if (!obj || !obj.canAddNew) {
            return false;
          } else {
            return !hasUniqueRecord(obj.resource);
          }
        },
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource && obj.canAddNew) {
            getResourceById({id: obj.resource}).subscribe(response => {
              const serverRes = response.data.resource.forms || [];
              const res: any[] = [];
              res.push({value: null});
              for (const item of serverRes) {
                res.push({value: item.id, text: item.name});
              }
              choicesCallback(res);
            });
          }
        },
      });
      Survey.Serializer.addProperty('resource', {
        name: 'placeholder',
        category: 'Custom Questions'
      });

      Survey.Serializer.addProperty('resource', {
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
      Survey.Serializer.addProperty('resource', {
        type: 'string',
        name: 'staticValue',
        category: 'Filter by Questions',
        dependsOn: 'selectQuestion',
        visibleIf: (obj: any) => obj.selectQuestion === '#staticValue',
        visibleIndex: 3,
      });
      Survey.Serializer.addProperty('resource', {
        type: 'dropdown',
        name: 'filterBy',
        category: 'Filter by Questions',
        dependsOn: ['resource', 'selectQuestion'],
        visibleIf: (obj: any) => obj.selectQuestion,
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
      Survey.Serializer.addProperty('resource', {
        type: 'dropdown',
        name: 'filterCondition',
        category: 'Filter by Questions',
        dependsOn: 'selectQuestion',
        visibleIf: (obj: any) => obj.selectQuestion,
        choices: (obj: any, choicesCallback: any) => {
          choicesCallback(resourceConditions);
        },
        visibleIndex: 3
      });
      Survey.Serializer.addProperty('resource', {
          category: 'Filter by Questions',
          type: 'selectResourceText',
          name: 'selectResourceText',
          displayName: 'Select a resource',
          dependsOn: ['resource', 'selectQuestion'],
          visibleIf: (obj: any) => !obj.resource,
          visibleIndex: 3
        }
      );

      const selectResourceText = {
        render: (editor: any, htmlElement: any): void => {
          const text = document.createElement('div');
          text.innerHTML = 'First you have to select a resource before set filters';
          htmlElement.appendChild(text);
        }
      };
      SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor('selectResourceText', selectResourceText);

      Survey.Serializer.addProperty('resource', {
          category: 'Filter by Questions',
          type: 'customFilter',
          name: 'customFilterEl',
          displayName: 'Custom Filter',
          dependsOn: ['resource', 'selectQuestion'],
          visibleIf: (obj: any) => obj.resource && !obj.selectQuestion,
          visibleIndex: 3
        }
      );

      const customFilterElements = {
        render: (editor: any, htmlElement: any): void => {
          const text = document.createElement('div');
          text.innerHTML = 'You can use curly brackets to get access to the question values.' +
            '<br><b>field</b>: select the field to be filter by.' +
            '<br><b>operator</b>: contains, eq, gt, gte, lt, lte' +
            '<br><b>value:</b> {question1} or static value' +
            '<br><b>Example:</b>' +
            '<br>[{' +
            '<br>"field": "name",' +
            '<br>"operator":"contains",' +
            '<br>"value": "Laura"' +
            '<br>},' +
            '<br>{' +
            '<br>"field":"age",' +
            '<br>"operator": "gt",' +
            '<br>"value": "{question1}"' +
            '<br>}]';
          htmlElement.appendChild(text);
        }
      };

      SurveyCreator.SurveyPropertyEditorFactory.registerCustomEditor('customFilter', customFilterElements);

      Survey.Serializer.addProperty('resource', {
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
          filters[0].operator = question.filterCondition;
          filters[0].field = question.filterBy;
          if (question.selectQuestion) {
            question.registerFunctionOnPropertyValueChanged('filterCondition',
              () => {
                filters.map((i: any) => {
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
            const watchedQuestion = question.survey.getQuestionByName(question.selectQuestion);
            watchedQuestion.valueChangedCallback = () => {
              setAdvanceFilter(watchedQuestion.value, question);
              if (question.displayAsGrid) {
                resourcesFilterValues.next(filters);
              } else {
                this.populateChoices(question);
              }
            };
          }
        } else if (!question.selectQuestion && question.customFilter && question.customFilter.trim().length > 0) {
          const obj = JSON.parse(question.customFilter);
          if (obj) {
            for (const objElement of obj) {
              if (objElement.value.match(/^{*.*}$/)) {
                const quest = objElement.value.substr(1, objElement.value.length - 2);
                objElement.value = '';
                const watchedQuestion = question.survey.getQuestionByName(quest);
                watchedQuestion.valueChangedCallback = () => {
                  setAdvanceFilter(watchedQuestion.value, objElement.field);
                  this.populateChoices(question);
                };
              }
            }
            filters = obj;
            this.populateChoices(question);
          }
        }
      }
    },
    onPropertyChanged(question: any, propertyName: string, newValue: any): void {
      if (propertyName === 'resource') {
        question.filterBy = [];
        question.displayField = null;
        this.filters = [];
        this.resourceFieldsName = [];
        question.canAddNew = false;
        question.addTemplate = null;
      }
    },
    populateChoices(question: any): void {
      if (question.resource) {
        getResourceById({id: question.resource, filters}).subscribe((response) => {
          const serverRes = response.data.resource.records || [];
          const res: any[] = [];
          for (const item of serverRes) {
            res.push({value: item.id, text: item.data[question.displayField]});
          }
          question.contentQuestion.choices = res;
        });
      } else {
        question.contentQuestion.choices = [];
      }
    },
    onAfterRender(question: any, el: any): void {
      if (question.canAddNew && question.addTemplate) {
        document.addEventListener('saveResourceFromEmbed', (e: any) => {
          const detail = e.detail;
          if (detail.template === question.addTemplate && question.resource) {
            getResourceById({id: question.resource}).subscribe(response => {
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
    },
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
