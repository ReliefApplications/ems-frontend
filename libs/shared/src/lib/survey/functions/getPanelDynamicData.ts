/**
 * Return a array with all the objects or arrays that has as key the question.parentQuestion.name
 * (where all the data of the panel question we want is).
 * Works with nested panel dynamics as well.
 *
 * @param surveyData object with the complete survey data
 * @param questionParentName name of the question parent (panel dynamic parent name)
 * @returns arrays with all the info
 */
export const getPanelDynamicData = (
  surveyData: any,
  questionParentName: string
): any[] => {
  const results: any[] = [];

  const recurse = (currentObj: any) => {
    for (const key in currentObj) {
      if (key.startsWith(questionParentName)) {
        results.push(currentObj[key]);
      }
      if (
        typeof currentObj[key] === 'object' &&
        !Array.isArray(currentObj[key])
      ) {
        recurse(currentObj[key]);
      } else if (Array.isArray(currentObj[key])) {
        for (const item of currentObj[key]) {
          if (typeof item === 'object') {
            recurse(item);
          }
        }
      }
    }
  };

  recurse(surveyData);
  return results;
};
