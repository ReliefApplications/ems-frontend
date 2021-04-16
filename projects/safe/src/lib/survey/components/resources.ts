export function init(Survey: any, API_URL: string): void {
  const getFromServer = buildServerDispatcher(API_URL);

  let resourcesForms: any[] = [];

  const component = {
    name: 'resources',
    title: 'Resources',
    category: 'Custom Questions',
    questionJSON: {
      name: 'resources',
      type: 'tagbox',
      optionsCaption: 'Select a resource...',
      choicesOrder: 'asc',
      choices: [],
    },
    onInit(): void {
      Survey.Serializer.addProperty('resources', {
        name: 'resource',
        category: 'Custom Questions',
        visibleIndex: 3,
        required: true,
        choices: (obj: any, choicesCallback: any) => {
          getFromServer<{ resources: any }>({
            query: `{resources {
                                id
                                name
                                coreForm {
                                  uniqueRecord { id }
                                }
                              }
                            }`,
          }).then((data: any) => {
            const serverRes = data.resources;
            resourcesForms = data.resources;
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
            getFromServer<{ resource: any }>({
              query: `query GetResourceById($id: ID!) {
                                      resource(id: $id) {
                                          id
                                          name
                                          fields
                                          coreForm {
                                            uniqueRecord { id }
                                          }
                                        }
                                    }`,
              variables: {
                id: obj.resource,
              },
            }).then((data: any) => {
              const serverRes = data.resource.fields;
              const res = [];
              res.push({value: null});
              for (const item of serverRes) {
                res.push({value: item.name});
              }
              choicesCallback(res);
            });
          }
        },
      });
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
            getFromServer<{ resource: any }>({
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
                id: obj.resource,
              },
            }).then((data: any) => {
              const serverRes = data.resource.records;
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
          if (!obj || !obj.canAddNew) {
            return false;
          } else {
            return !hasUniqueRecord(obj.resource);
          }
        },
        visibleIndex: 3,
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resource && obj.canAddNew) {
            getFromServer<{ resource: any }>({
              query: `query GetResourceById($id: ID!) {
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
            }).then((data) => {
              const serverRes = data.resource.forms;
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
    },
    onLoaded(question: any): void {
      getFromServer<{ resource: any }>({
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
      }).then((data) => {
        const serverRes = data.resource.records;
        const res = [];
        for (const item of serverRes) {
          res.push({value: item.id, text: item.data[question.displayField]});
        }
        // question.choices = res;
        question.contentQuestion.choices = res;
        // data = res;
        question.survey.render();
      });
    },
    onPropertyChanged(question: any, propertyName: string, newValue: any): void {
      if (propertyName === 'resource') {
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
          if (detail.template === question.addTemplate) {
            getFromServer<{ resource: any }>({
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
            }).then((data) => {
              const serverRes = data.resource.records;
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

  const hasUniqueRecord = ((id: string) =>
    resourcesForms.filter(r => (r.id === id && r.coreForm && r.coreForm.uniqueRecord)).length > 0);
}

const buildServerDispatcher = (API_URL: string) => <T>(query: {query: string, variables?: object}): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', API_URL);
    const token = localStorage.getItem('msal.idtoken');
    // Apollo client doesn't intercept the request, so it has to be built 'manually'
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      resolve(xhr.response.data);
    };
    xhr.onerror = () => {
      reject(xhr);
    };
    xhr.send(JSON.stringify(query));
  });
};
