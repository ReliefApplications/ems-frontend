import { HttpClient } from '@angular/common/http';

export function init(Survey: any, http: HttpClient): void {

  function getSourceFields(obj: any, choicesCallback: any): void {
    if (obj.choicesByUrl) {
      http.get<any>(obj.choicesByUrl).subscribe((res: any) => {
        choicesCallback(!res || !res[0] ? [] : Object.keys(res[0]));
      }, _ => choicesCallback([]));
    } else {
      choicesCallback([]);
    }
    choicesCallback([]);
  }

  const component = {
    name: 'Multi-level dropdown',
    title: 'Multi-level dropdown',
    category: 'Custom Questions',
    elementsJSON: [
      {
        name: 'sourceData',
        title: 'Source data',
        type: 'dropdown',
        optionsCaption: 'Select...',
        choices: [] as any[]
      },
      {
        name: 'filteredData',
        title: 'Filtered data',
        type: 'text',
        readOnly: true
      }
    ],
    onInit(): void {
      buildQuestionProperties();
    },
    onLoaded(question: any): void {
      question.choicesByUrl = 'https://restcountries.eu/rest/v2/all';
      if (question.displaySourceField && question.filterBy && question.displayFilteredField) {
        http.get<any>(question.choicesByUrl).subscribe((res: any) => {
          const items: any = [];
          res.map((r: any) => {
            items.push({value: r, text: r[question.displaySourceField]});
          });
          question.contentPanel.getQuestionByName('sourceData').choices = items;
        });

        question.survey.onValueChanged.add((survey: any, options: any) => {
          const result: any[] = [];
          question.contentPanel.getQuestionByName('sourceData').choices.filter((r: any) => {
            if (r.value[question.filterBy] === options.value.sourceData[question.filterBy]) {
              result.push(r.value[question.displayFilteredField]);
            }
          });
          question.contentPanel.getQuestionByName('filteredData').value = Array.from(new Set(result)).toString();
        });

      }
    },
  };

  function buildQuestionProperties(): void {
    Survey.Serializer.addProperty('multi-level dropdown', {
      name: 'choicesByUrl',
      title: 'Source data by url',
      category: 'Choices',
    });
    Survey.Serializer.addProperty('multi-level dropdown', {
      name: 'displaySourceField',
      type: 'dropdown',
      category: 'Choices',
      dependsOn: 'choicesByUrl',
      visibleIf: (obj: any) => !!obj && !!obj.choicesByUrl,
      choices: (obj: any, choicesCallback: any) => getSourceFields(obj, choicesCallback)
    });
    Survey.Serializer.addProperty('multi-level dropdown', {
      name: 'filterBy',
      type: 'dropdown',
      category: 'Choices',
      dependsOn: 'choicesByUrl',
      visibleIf: (obj: any) => !!obj && !!obj.choicesByUrl,
      choices: (obj: any, choicesCallback: any) => getSourceFields(obj, choicesCallback)
    });
    Survey.Serializer.addProperty('multi-level dropdown', {
      name: 'displayFilteredField',
      type: 'dropdown',
      category: 'Choices',
      dependsOn: 'choicesByUrl',
      visibleIf: (obj: any) => !!obj && !!obj.choicesByUrl,
      choices: (obj: any, choicesCallback: any) => getSourceFields(obj, choicesCallback)
    });
  }

  Survey.ComponentCollection.Instance.add(component);
}
