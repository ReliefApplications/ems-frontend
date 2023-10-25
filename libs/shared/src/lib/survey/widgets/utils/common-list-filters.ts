import {
  ComboBoxComponent,
  MultiSelectComponent,
} from '@progress/kendo-angular-dropdowns';

/**
 * Default options length displayed in the widgets list
 */
const DEFAULT_VISIBLE_OPTIONS = 100;

/**
 * Update visible choices of the given widget and attached question choices with the given search value
 *
 * @param widget Widget shown in the surveyjs question
 * @param surveyQuestion surveyjs question instance for the given widget
 * @param searchValue search value to filter item list
 */
function updateChoices(
  widget: ComboBoxComponent | MultiSelectComponent,
  surveyQuestion: any,
  searchValue: string = ''
) {
  if (searchValue === '') {
    // Without search value uses virtualization
    widget.data = surveyQuestion.visibleChoices.map((choice: any) =>
      typeof choice === 'string'
        ? {
            text: choice,
            value: choice,
          }
        : {
            text: choice.text,
            value: choice.value,
          }
    );
  } else {
    // Filters the data to those that include the search value and sets the choices to the first 100
    if (
      surveyQuestion.visibleChoices &&
      Array.isArray(surveyQuestion.visibleChoices)
    ) {
      const filterData = surveyQuestion.visibleChoices.filter((choice: any) =>
        typeof choice === 'string'
          ? choice.toLowerCase().includes(searchValue)
          : choice.text?.toLowerCase().includes(searchValue)
      );
      const dataToShow = filterData
        .map((choice: any) =>
          typeof choice === 'string'
            ? {
                text: choice,
                value: choice,
              }
            : {
                text: choice.text,
                value: choice.value,
              }
        )
        .slice(0, DEFAULT_VISIBLE_OPTIONS);
      widget.data = dataToShow;
    }
  }

  widget.loading = false;
  widget.disabled = surveyQuestion.isReadOnly;
  widget.wrapper.nativeElement.click();
}
export default updateChoices;
