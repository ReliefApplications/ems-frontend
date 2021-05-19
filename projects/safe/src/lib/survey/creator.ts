/*  Edit general settings of SurveyJS
*/
export function initCreatorSettings(survey: any): void {
    survey.Serializer.findProperty('question', 'name').readOnly = true;
    survey.Serializer.findProperty('question', 'name').dependsOn = 'valueName';
    survey.Serializer.findProperty('question', 'name').onGetValue = (obj: any) => {
        return obj.valueName ? obj.valueName : obj.name;
    };
    survey.Serializer.findProperty('question', 'valueName').isRequired = true;
    survey.Serializer.findProperty('file', 'storeDataAsText').defaultValue = false;
    survey.Serializer.findProperty('file', 'storeDataAsText').readOnly = true;
    survey.Serializer.findProperty('file', 'storeDataAsText').visible = false;
}
