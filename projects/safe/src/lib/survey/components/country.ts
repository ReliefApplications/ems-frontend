export function init(Survey: any): void {
  const component = {
    // Unique component name. It becomes a new question type. Please note, it should be written in lowercase.
    name: 'country',
    // The text that shows on toolbox
    title: 'Country',
    category: 'Custom Questions',
    // The actual question that will do the job
    questionJSON: {
      type: 'dropdown',
      optionsCaption: 'Select a country...',
      choicesByUrl: {
        url: 'https://restcountries.eu/rest/v2/all',
      },
    },
    onInit(): void {
      // SurveyJS will create a new class "countries". We can add properties for this class onInit()
      Survey.Serializer.addProperty('country', {
        name: 'choicesByUrl',
        category: 'Choices',
      });
    },
    onLoaded(question: any): void {
      question.choicesByUrl = 'https://restcountries.eu/rest/v2/all';
      Survey.Serializer.findProperty('country', 'choicesByUrl').readOnly = true;
    },
  };
  Survey.ComponentCollection.Instance.add(component);
}
