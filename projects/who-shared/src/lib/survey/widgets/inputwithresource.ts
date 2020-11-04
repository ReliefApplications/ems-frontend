export function init(Survey: any){
    const widget = {
        name: 'inputwithresource',
        isFit: (question) => {
            return question.getType() === 'text';
          },
        isDefaultRender: true,
        init(){
            Survey.Serializer.removeProperty('text', 'inputType');
            Survey.Serializer.addProperty('text', {
                name: 'inputType',
                default: 'text',
                choices: [
                  'color',
                  'date',
                  'datetime',
                  'datetime-local',
                  'email',
                  'month',
                  'number',
                  'password',
                  'range',
                  'resource',
                  'tel',
                  'text',
                  'time',
                  'url',
                  'week',
                ],
            });

            Survey.Serializer.addProperty('text', {
                name: 'resources',
                displayName: 'Resources',
                category: 'general',
                dependsOn: 'inputType',
                visibleIf: (obj: any) => {
                    if (!obj) { return false; }
                    return obj.inputType === 'resource';
                },
                choices: (obj, choicesCallback) => {
                  const url = 'http://localhost:3000/graphql';
                  const xhr = new XMLHttpRequest();
                  const query = {
                    query: `{
                      resources {
                        id
                        name
                      }
                    }`
                  };
                  xhr.responseType = 'json';
                  xhr.open('POST', url);
                  xhr.setRequestHeader('Content-Type', 'application/json');
                  xhr.onload = () => {
                    const serverRes = xhr.response.data.resources;
                    const res = [];
                    res.push({ value: null});
                    for (const item of serverRes) {
                      res.push({value: item.id, text: item.name});
                    }
                    choicesCallback(res);
                  };
                  xhr.send(JSON.stringify(query));
                }
              });

            Survey.Serializer.addProperty('text', {
                name: 'resourcefield',
                displayName: 'Resource field',
                category: 'general',
                dependsOn: 'resources',
                visibleIf: (obj) => {
                    if (!obj || !obj.resources) { return false; }
                    return obj.inputType === 'resource';
                },
                choices: (obj, choicesCallback) => {
                    if (obj.resources) {
                        const url = 'http://localhost:3000/graphql';
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
                                id: obj.resources
                            }
                        };
                        xhr.responseType = 'json';
                        xhr.open('POST', url);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.onload = () => {
                            const serverRes = xhr.response.data.resource.fields;
                            const res = [];
                            res.push({ value: null });
                            for (const item of serverRes) {
                                res.push({ value: item.name });
                            }
                            choicesCallback(res);
                        };
                        xhr.send(JSON.stringify(query));
                    }
                }
            });
        }
    };
    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
}
