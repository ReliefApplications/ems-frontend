export function init(Survey: any){
    const component = {
    // Unique component name. It becomes a new question type. Please note, it should be written in lowercase.
    name: 'country',
    // The text that shows on toolbox
    title: 'Country',
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
