/**
 * Edits general settings of the survey builder.
 *
 * @param Survey Survey library
 */
export const initCreatorSettings = (Survey: any): void => {
  Survey.Serializer.findProperty('question', 'name').readOnly = true;
  Survey.Serializer.findProperty('question', 'name').dependsOn = 'valueName';
  Survey.Serializer.findProperty('question', 'name').onGetValue = (obj: any) =>
    obj.valueName ? obj.valueName : obj.name;
  Survey.Serializer.findProperty('question', 'valueName').isRequired = true;
  Survey.Serializer.findProperty('file', 'storeDataAsText').onGetValue = (
    obj: any
  ) => false;
  Survey.Serializer.findProperty('file', 'storeDataAsText').readOnly = true;
  Survey.Serializer.findProperty('file', 'storeDataAsText').visible = false;
  Survey.Serializer.findProperty('file', 'maxSize').onGetValue = (obj: any) =>
    7340032;
};
