import * as widgets from 'surveyjs-widgets';

export function init(Survey: any): void{
  widgets.select2tagbox(Survey);
  const component = {
    // Unique component name. It becomes a new question type. Please note, it should be written in lowercase.
    name: 'countries',
    // The text that shows on toolbox
    title: 'Countries',
    category: 'Resource',
    // The actual question that will do the job
    questionJSON: {
      type: 'tagbox',
      optionsCaption: 'Select countries...',
      choicesByUrl: {
        url: 'https://restcountries.eu/rest/v2/all',
      },
    },
  };
  Survey.ComponentCollection.Instance.add(component);
}


