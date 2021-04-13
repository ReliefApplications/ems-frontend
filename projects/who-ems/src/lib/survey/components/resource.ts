import { WhoFormModalComponent } from '../../components/form-modal/form-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import {
  GET_RESOURCE_BY_ID,
  GET_RESOURCES,
  GetResourceByIdQueryResponse,
  GetResourcesQueryResponse
} from '../../graphql/queries';

export function init(Survey: any, API_URL: string, dialog: MatDialog, apollo: Apollo): void {
  const getResources = () => apollo.query<GetResourcesQueryResponse>({
    query: GET_RESOURCES,
  });

  const getResourcesById = (id: string) => apollo.query<GetResourceByIdQueryResponse>({
    query: GET_RESOURCE_BY_ID,
    variables: {
      id
    }
  });

  const component = {
    name: 'resource',
    title: 'Resource',
    category: 'Custom Questions',
    questionJSON: {
      name: 'resource',
      type: 'dropdown',
      optionsCaption: 'Select a record...',
      choicesOrder: 'asc',
      choices: [],
    },
    onInit(): void {
      Survey.Serializer.addProperty('resource', {
        name: 'resource',
        category: 'Custom Questions',
        visibleIndex: 3,
        required: true,
        choices: (obj: any, choicesCallback: any) => {
          getResources().subscribe(
            (response: any) => {
              console.log('GET RESOURCES', response);
              const serverRes = response.data.resources;
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
          getResourcesById(obj.resource).subscribe(response => {
            console.log('RESOURCE BY ID', response);
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
            getResourcesById(obj.resource).subscribe(response => {
              console.log('GET RESOURCES BT ID 2', response);
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
          res.push({ value: item.id, text: item.data[question.displayField] });
        }
        // question.choices = res;
        question.contentQuestion.choices = res;
        if (!question.placeholder) {
          question.contentQuestion.optionsCaption = 'Select a record from ' + xhr.response.data.resource.name + '...';
        }
        question.survey.render();
      };
      xhr.send(JSON.stringify(query));
    },
    onAfterRender(question: any, el: any): void {
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
        const dialogRef = dialog.open(WhoFormModalComponent, {
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
