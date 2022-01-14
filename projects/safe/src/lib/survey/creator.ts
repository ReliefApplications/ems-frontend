/**
 * Edits general settings of the survey builder.
 *
 * @param survey Survey instance
 */
export const initCreatorSettings = (survey: any): void => {
  survey.Serializer.findProperty('question', 'name').readOnly = true;
  survey.Serializer.findProperty('question', 'name').dependsOn = 'valueName';
  survey.Serializer.findProperty('question', 'name').onGetValue = (obj: any) =>
    obj.valueName ? obj.valueName : obj.name;
  survey.Serializer.findProperty('question', 'valueName').isRequired = true;
  survey.Serializer.findProperty('file', 'storeDataAsText').onGetValue = (
    obj: any
  ) => false;
  survey.Serializer.findProperty('file', 'storeDataAsText').readOnly = true;
  survey.Serializer.findProperty('file', 'storeDataAsText').visible = false;
  survey.Serializer.findProperty('file', 'maxSize').onGetValue = (obj: any) =>
    7340032;
};
