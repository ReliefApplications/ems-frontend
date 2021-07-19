/*  Edit general settings of SurveyJS
*/
export function initCreatorSettings(survey: any): void {
  survey.Serializer.findProperty('question', 'name').readOnly = true;
  survey.Serializer.findProperty('question', 'name').dependsOn = 'valueName';
  survey.Serializer.findProperty('question', 'name').onGetValue = (obj: any) => {
    return obj.valueName ? obj.valueName : obj.name;
  };
  survey.Serializer.findProperty('question', 'valueName').isRequired = true;

  // hide value name to prevent access to filteredData question.
  survey.Serializer.findProperty('text', 'valueName').visibleIf =
    ((obj: any) => obj.getType() !== 'multi-level dropdown' && (!obj.valueName || obj.valueName && !obj.valueName.match(/filtered_data$/)));

  // hide value name to prevent access to filteredData question.
  survey.Serializer.findProperty('multi-level dropdown', 'valueName').visibleIf =
    ((obj: any) => obj.getType() !== 'multi-level dropdown' && (!obj.valueName || obj.valueName && !obj.valueName.match(/filtered_data$/)));
  // This is needed for file question, to prevent files to be stored as plain text.
  survey.Serializer.findProperty('file', 'storeDataAsText').onGetValue = (obj: any) => {
    return false;
  };
  survey.Serializer.findProperty('file', 'storeDataAsText').readOnly = true;
  survey.Serializer.findProperty('file', 'storeDataAsText').visible = false;
}
