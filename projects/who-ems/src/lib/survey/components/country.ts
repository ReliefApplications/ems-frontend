export function init(Survey: any): void{
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
    };
    Survey.ComponentCollection.Instance.add(component);
}
