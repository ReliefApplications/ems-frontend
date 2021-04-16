import { SafeFormModalComponent } from '../../components/form-modal/form-modal.component';
import { MatDialog } from '@angular/material/dialog';

export function init(Survey: any, API_URL: string, dialog: MatDialog): void {
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
          const xhr = new XMLHttpRequest();
          const query = {
            query: `{
                            resources {
                              id
                              name
                            }
                          }`,
          };
          xhr.responseType = 'json';
          xhr.open('POST', API_URL);
          const token = localStorage.getItem('msal.idtoken');
          // Apollo client doesn't intercept the request, so it has to be built 'manually'
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.onload = () => {
            const serverRes = xhr.response.data.resources;
            const res: any[] = [];
            res.push({ value: null });
            for (const item of serverRes) {
              res.push({ value: item.id, text: item.name });
            }
            choicesCallback(res);
          };
          xhr.send(JSON.stringify(query));
        },
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
          if (obj.resource) {
            const xhr = new XMLHttpRequest();
            const query = {
              query: `
                                  query GetResourceById($id: ID!) {
                                    resource(id: $id) {
                                        id
                                        name
                                        fields
                                      }
                                  }`,
              variables: {
                id: obj.resource,
              },
            };
            xhr.responseType = 'json';
            xhr.open('POST', API_URL);
            const token = localStorage.getItem('msal.idtoken');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
              const serverRes = xhr.response.data.resource.fields;
              const res: any[] = [];
              res.push({ value: null });
              this.resourceFieldsName = [];
              for (const item of serverRes) {
                res.push({ value: item.name });
                this.resourceFieldsName.push(item.name);
              }
              choicesCallback(res);
            };
            xhr.send(JSON.stringify(query));
          }
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
            const xhr = new XMLHttpRequest();
            const query = {
              query: `
                                  query GetResourceById($id: ID!) {
                                    resource(id: $id) {
                                        id
                                        name
                                        records {
                                            id
                                            data
                                        }
                                      }
                                  }`,
              variables: {
                id: obj.resource,
              },
            };
            xhr.responseType = 'json';
            xhr.open('POST', API_URL);
            const token = localStorage.getItem('msal.idtoken');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
              const serverRes = xhr.response.data.resource.records;
              const res: any[] = [];
              res.push({ value: null });
              for (const item of serverRes) {
                res.push({ value: item.id, text: item.data[obj.displayField] });
              }
              choicesCallback(res);
            };
            xhr.send(JSON.stringify(query));
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
            return true;
          }
        },
        visibleIndex: 3,
      });
      Survey.Serializer.addProperty('resource', {
        name: 'addTemplate',
        category: 'Custom Questions',
        dependsOn: 'canAddNew',
        visibleIf: (obj: any) => {
          if (!obj || !obj.canAddNew) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource && obj.canAddNew) {
            const xhr = new XMLHttpRequest();
            const query = {
              query: `
                                  query GetResourceById($id: ID!) {
                                    resource(id: $id) {
                                        id
                                        name
                                        forms {
                                            id
                                            name
                                        }
                                      }
                                  }`,
              variables: {
                id: obj.resource,
              },
            };
            xhr.responseType = 'json';
            xhr.open('POST', API_URL);
            const token = localStorage.getItem('msal.idtoken');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
              const serverRes = xhr.response.data.resource.forms;
              const res: any[] = [];
              res.push({ value: null });
              for (const item of serverRes) {
                res.push({ value: item.id, text: item.name });
              }
              choicesCallback(res);
            };
            xhr.send(JSON.stringify(query));
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
      if (!question.filterByQuestions || question.filterByQuestions.length < 1) {
        this.populateChoices(question);
      }
    },
    onPropertyChanged(question: any, propertyName: string, newValue: any): void {
      if (propertyName === 'resource') {
          question.filterByQuestions = [];
          question.displayField = null;
          this.filters = [];
          this.resourceFieldsName = [];
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
      const xhr = new XMLHttpRequest();
      const query = {
        query: `query GetResourceById($id: ID!) {
                    resource(id: $id) {
                        id
                        name
                        records(containsFilters: ${this.filtersAsString()}) {
                            id
                            data
                        }
                    }
                }`,
        variables: {
          id: question.resource,
        }
      };
      xhr.responseType = 'json';
      xhr.open('POST', API_URL);
      const token = localStorage.getItem('msal.idtoken');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = () => {
        const serverRes = xhr.response.data.resource.records;
        const res: any[] = [];
        for (const item of serverRes) {
          res.push({ value: item.id, text: item.data[question.displayField] });
        }
        question.contentQuestion.choices = res;
      };
      xhr.send(JSON.stringify(query));
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
          if (detail.template === question.addTemplate) {
            const xhr = new XMLHttpRequest();
            const query = {
              query: `query GetResourceById($id: ID!) {
                                resource(id: $id) {
                                    id
                                    name
                                    records {
                                        id
                                        data
                                    }
                                }
                            }`,
              variables: {
                id: question.resource,
              },
            };
            xhr.responseType = 'json';
            xhr.open('POST', API_URL);
            const token = localStorage.getItem('msal.idtoken');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
              const serverRes = xhr.response.data.resource.records;
              const res: any[] = [];
              for (const item of serverRes) {
                res.push({
                  value: item.id,
                  text: item.data[question.displayField],
                });
              }
              question.contentQuestion.choices = res;
              question.survey.render();
            };
            xhr.send(JSON.stringify(query));
          }
        });
      }
    },
  };
  Survey.ComponentCollection.Instance.add(component);
  const widget = {
    name: 'addResource',
    isFit: (question: any) => {
      if (question.getType() === 'resource') {
        return question.canAddNew && question.addTemplate;
      } else {
        return false;
      }
    },
    isDefaultRender: true,
    afterRender: (question: any, el: any) => {
      const mainDiv = document.createElement('div');
      const btnEl = document.createElement('button');
      btnEl.innerText = 'Add';
      btnEl.style.width = '120px';
      btnEl.onclick = () => {
        const dialogRef = dialog.open(SafeFormModalComponent, {
          data: {
            template: question.addTemplate,
          }
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            const e = new CustomEvent('saveResourceFromEmbed', { detail: { resource: res.data, template: res.template } });
            document.dispatchEvent(e);
          }
        });
      };
      mainDiv.appendChild(btnEl);
      el.parentElement.insertBefore(mainDiv, el);
    },
  };
  Survey.CustomWidgetCollection.Instance.add(widget);
}
