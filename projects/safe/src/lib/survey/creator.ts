/*  Edit general settings of SurveyJS
*/
export function initCreatorSettings(survey: any): void {
  survey.Serializer.findProperty('question', 'name').readOnly = true;
  survey.Serializer.findProperty('question', 'name').dependsOn = 'valueName';
  survey.Serializer.findProperty('question', 'name').onGetValue = (obj: any) => {
    return obj.valueName ? obj.valueName : obj.name;
  };
  survey.Serializer.findProperty('question', 'valueName').isRequired = true;

  // needs to hide valueName to don't give access to change it filteredData question.
  survey.Serializer.findProperty('text', 'valueName').visibleIf = ((obj: any) =>
    !obj.valueName || obj.valueName && !obj.valueName.match(/filtered_data$/));
}
