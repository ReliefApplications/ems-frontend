import { Apollo } from 'apollo-angular';
import {
  GET_RESOURCE_BY_ID,
  GET_RESOURCES,
  GetResourceByIdQueryResponse,
  GetResourcesQueryResponse
} from '../../graphql/queries';

export function init(Survey: any, apollo: Apollo): void {
  let resourcesForms: any[] = [];
  const getResources = () => apollo.query<GetResourcesQueryResponse>({
    query: GET_RESOURCES,
  });

  const getResourceById = (id: string, containsFilters?: any) => apollo.query<GetResourceByIdQueryResponse>({
    query: GET_RESOURCE_BY_ID,
    variables: {
      id,
      containsFilters
    }
  });

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
              res.push({ value: null });
              for (const item of serverRes) {
                res.push({ value: item.id, text: item.name });
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
          getResourceById(obj.resource).subscribe(response => {
            const serverRes = response.data.resource.fields;
            const res = [];
            res.push({ value: null });
            for (const item of serverRes) {
              res.push({ value: item.name });
            }
            choicesCallback(res);
          });
        },
      });
      Survey.Serializer.addProperty('resource', {
        name: 'filterByQuestions:multiplevalues',
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
          if (obj && obj.resource) {
            const questions: any[] = [];
            obj.survey.getAllQuestions().forEach((question: any) => {
              if (question.id !== obj.id && this.resourceFieldsName.includes(question.name)) {
                questions.push(question.name);
              }
            });
            choicesCallback(questions);
          }
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
            getResourceById(obj.resource).subscribe(response => {
              const serverRes = response.data.resource.records || [];
              const res = [];
              res.push({ value: null });
              for (const item of serverRes) {
                res.push({ value: item.id, text: item.data[obj.displayField] });
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
            getResourceById(obj.resource).subscribe(response => {
              const serverRes = response.data.resource.forms || [];
              const res: any[] = [];
              res.push({ value: null });
              for (const item of serverRes) {
                res.push({ value: item.id, text: item.name });
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
    },
    onLoaded(question: any): void {
      if (question.placeholder) {
        question.contentQuestion.optionsCaption = question.placeholder;
      }
      if (question.resource) {
        getResourceById(question.resource).subscribe(response => {
          const serverRes = response.data.resource.records || [];
          const res = [];
          for (const item of serverRes) {
            res.push({ value: item.id, text: item.data[question.displayField] });
          }
          question.contentQuestion.choices = res;
          if (!question.placeholder) {
            question.contentQuestion.optionsCaption = 'Select a record from ' + response.data.resource.name + '...';
          }
          if (!question.filterByQuestions || question.filterByQuestions.length < 1) {
            this.populateChoices(question);
          }
          question.survey.render();
        });
      }
    },
    onPropertyChanged(question: any, propertyName: string, newValue: any): void {
      if (propertyName === 'resource') {
        question.filterByQuestions = [];
        question.displayField = null;
        this.filters = [];
        this.resourceFieldsName = [];
        question.canAddNew = false;
        question.addTemplate = null;
      }
    },
    filtersAsString(): string {
      if (this.filters.length < 1) {
        return '[]';
      }
      let str = '[';
      for (const filter of this.filters) {
        str += '{';
        for (const p in filter) {
          if (filter.hasOwnProperty(p)) {
            str += p + ': ' + (typeof filter[p] === 'string' ? `"${filter[p]}"` : filter[p]) + ',\n';
          }
        }
        str += '},';
      }
      return str.substring(0, str.length - 1) + ']';
    },
    populateChoices(question: any): void {
      if (question.resource) {
        getResourceById(question.resource, this.filtersAsString()).subscribe(response => {
          const serverRes = response.data.resource.records || [];
          const res: any[] = [];
          for (const item of serverRes) {
            res.push({ value: item.id, text: item.data[question.displayField] });
          }
          question.contentQuestion.choices = res;
        });
      } else {
        question.contentQuestion.choices = [];
      }
    },
    onAfterRender(question: any, el: any): void {
      if (question.filterByQuestions && question.filterByQuestions.length > 0) {
        question.filterByQuestions.forEach((questionName: string) => {
          const value = question.survey.data[questionName];
          if (value) {
            this.filters.push({ name: questionName, value });
          }
          this.populateChoices(question);
          const watchedQuestion = question.survey.getQuestionByName(questionName);
          watchedQuestion.valueChangedCallback = () => {
            if (!this.filters.some(x => x.name === questionName)) {
              if (watchedQuestion.value) {
                this.filters.push({ name: questionName, value: watchedQuestion.value });
              }
            } else {
              this.filters = this.filters.map(x => {
                if (x.name === questionName) {
                  x.value = watchedQuestion.value;
                }
                return x;
              });
            }
            this.populateChoices(question);
          };
        });
      }
      if (question.canAddNew && question.addTemplate) {
        document.addEventListener('saveResourceFromEmbed', (e: any) => {
          const detail = e.detail;
          if (detail.template === question.addTemplate && question.resource) {
            getResourceById(question.resource).subscribe(response => {
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
}
