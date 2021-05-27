export function init(Survey: any): void {

  const multiLevelMap = new Map([]);

  function getSourceFields(obj: any): any[] {
    if (obj.choicesByJson) {
      const jsonObj = JSON.parse(obj.choicesByJson);
      if (jsonObj) {
        return !jsonObj[0] ? [] : Object.keys(jsonObj[0]);
      }
    }
    return [];
  }

  const component = {
    name: 'multi-level dropdown',
    title: 'Multi-level dropdown',
    type: 'multi-level dropdown',
    category: 'Custom Questions',
    elementsJSON: [
      {
        name: 'sourceData',
        title: 'Source data',
        type: 'dropdown',
        optionsCaption: 'Select...',
        choices: [] as any[]
      }
    ],
    onInit(): void {
      buildQuestionProperties();
    },
    onLoaded(question: any): void {
      if (question.survey) {
        const allQuestions = question.survey.getAllQuestions();
        allQuestions.map((q: any) => {
          if (q.getType() === 'multi-level dropdown') {
            const filteredQuestion = allQuestions.filter((f: any) => `${q.valueName}_filtered_data` === f.valueName);
            if (filteredQuestion.length > 0 && !multiLevelMap.get(q.valueName)) {
              multiLevelMap.set(q.valueName, filteredQuestion[0]);
            }
          }
        });

      }

      if (question.displaySourceField && question.filterBy && question.displayFilteredField) {
        const items: any = [];
        if (question.choicesByJson) {
          const jsonObj = JSON.parse(question.choicesByJson);
          if (jsonObj) {
            jsonObj.map((r: any) => items.push({value: r, text: r[question.displaySourceField].toString()}));
          }
        }
        question.contentPanel.getQuestionByName('sourceData').choices = items;

        if (question.survey) {
          question.survey.onValueChanged.add((survey: any, options: any) => {
            if (question.name === options.question.name) {
              const result: any[] = [];
              question.contentPanel.getQuestionByName('sourceData').choices.filter((r: any) => {
                if (options.value.sourceData &&
                  r.value[question.filterBy].toString() === options.value.sourceData[question.filterBy].toString()) {
                  result.push(r.value[question.displayFilteredField].toString());
                }
              });
              question.survey.getQuestionByValueName(`${question.name}_filtered_data`).value = Array.from(new Set(result)).toString();
            }
          });
        }
      }
    },
    onAfterRender: (question: any, element: any) => {
      question.valueName = question.valueName ? question.valueName : question.name;

      if (question.survey) {
        question.survey.onQuestionRemoved.add((survey: any, options: any) => {
          const filteredQuestion: any = multiLevelMap.get(options.question.valueName);
          if (filteredQuestion) {
            multiLevelMap.delete(options.question.valueName);
            question.survey.pages[question.survey.currentPageNo].removeElement(filteredQuestion);
          } else {
            multiLevelMap.forEach((value: any, key: any) => {
              if (value.valueName === options.question.valueName) {
                multiLevelMap.delete(key);
                const sourceQuestion = question.survey.getQuestionByValueName(key);
                question.survey.pages[question.survey.currentPageNo].removeElement(sourceQuestion);
              }
            });
          }
        });
      }

      if (question.getType() === 'multi-level dropdown' && !multiLevelMap.get(question.valueName)) {
        // create filtered data question
        const valueName = `${question.valueName}_filtered_data`;
        const questionName = `${question.valueName} filtered data`;
        question.survey.pages[question.survey.currentPageNo].addNewQuestion('text', questionName);
        const newQuestion = question.survey.getQuestionByName(questionName);
        newQuestion.readOnly = true;
        newQuestion.valueName = valueName;
        newQuestion.title = questionName;
        multiLevelMap.set(question.valueName, newQuestion);
      }

    }
  };

  function buildQuestionProperties(): void {
    Survey.Serializer.addProperty('multi-level dropdown', {
        category: 'Choices',
        type: 'text',
        name: 'choicesByJson',
      }
    );
    Survey.Serializer.addProperty('multi-level dropdown', {
      category: 'Choices',
      name: 'displaySourceField',
      type: 'dropdown',
      dependsOn: ['choicesByJson'],
      visibleIf: (obj: any) => !!obj && !!obj.choicesByJson,
      choices: (obj: any) => getSourceFields(obj)
    });
    Survey.Serializer.addProperty('multi-level dropdown', {
      category: 'Choices',
      name: 'filterBy',
      type: 'dropdown',
      dependsOn: ['choicesByJson'],
      visibleIf: (obj: any) => !!obj && !!obj.choicesByJson,
      choices: (obj: any) => getSourceFields(obj)
    });
    Survey.Serializer.addProperty('multi-level dropdown', {
      category: 'Choices',
      name: 'displayFilteredField',
      type: 'dropdown',
      dependsOn: ['choicesByJson'],
      visibleIf: (obj: any) => !!obj && !!obj.choicesByJson,
      choices: (obj: any) => getSourceFields(obj)
    });
  }


  return Survey.ComponentCollection.Instance.add(component);
}
