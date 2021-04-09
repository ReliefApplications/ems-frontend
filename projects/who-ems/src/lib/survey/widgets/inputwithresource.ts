export function init(Survey: any, API_URL: string): void {
  const widget = {
    name: 'inputwithresource',
    isFit: (question: any) => {
      return question.getType() === 'text';
    },
    isDefaultRender: true,
    init(): void {
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
        category: 'Question Library',
        dependsOn: 'inputType',
        visibleIf: (obj: any) => {
          if (!obj) { return false; }
          return obj.inputType === 'resource';
        },
        choices: (obj: any, choicesCallback: any) => {
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
          xhr.open('POST', API_URL);
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
        }
      });

      Survey.Serializer.addProperty('text', {
        name: 'resourcefield',
        displayName: 'Resource field',
        category: 'Question Library',
        dependsOn: 'resources',
        visibleIf: (obj: any) => {
          if (!obj || !obj.resources) { return false; }
          return obj.inputType === 'resource';
        },
        choices: (obj: any, choicesCallback: any) => {
          if (obj.resources) {
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
            xhr.open('POST', API_URL);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
              const serverRes = xhr.response.data.resource.fields;
              const res: any[] = [];
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
