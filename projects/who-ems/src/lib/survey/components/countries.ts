export function init(Survey: any): void{
  const component = {
    // Unique component name. It becomes a new question type. Please note, it should be written in lowercase.
    name: 'countries',
    // The text that shows on toolbox
    title: 'Countries',
    category: 'Custom Questions',
    // The actual question that will do the job
    questionJSON: {
      type: 'tagbox',
      optionsCaption: 'Select countries...',
      choicesByUrl: {
        url: 'https://restcountries.eu/rest/v2/all',
      },
    },
    onInit(): void {
      // SurveyJS will create a new class "countries". We can add properties for this class onInit()
      Survey.Serializer.addProperty('countries', {
          name: 'choicesByUrl',
          category: 'Choices',
      });
    },
    onLoaded(question): void {
      question.choicesByUrl = 'https://restcountries.eu/rest/v2/all';
      Survey.Serializer.findProperty('countries', 'choicesByUrl').readOnly = true;
    },
  };
  Survey.ComponentCollection.Instance.add(component);
}


