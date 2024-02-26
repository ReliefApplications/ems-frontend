import {
  ComboBoxComponent,
  MultiSelectComponent,
} from '@progress/kendo-angular-dropdowns';
import { isEqual } from 'lodash';

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
  const choices: { text: string | undefined | null; value: any }[] = (
    surveyQuestion.visibleChoices || []
  ).map((choice: any) =>
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
  if (searchValue === '') {
    // Without search value uses virtualization
    widget.data = choices;
  } else {
    // Filters the data to those that include the search value and sets the choices to the first 100
    if (
      surveyQuestion.visibleChoices &&
      Array.isArray(surveyQuestion.visibleChoices)
    ) {
      const filterData = choices.filter((choice) =>
        choice.text?.toLowerCase().includes(searchValue)
      );
      widget.data = filterData.slice(0, DEFAULT_VISIBLE_OPTIONS);
    }
  }

  // Tricky workaround because of how multi-select works.
  // Selection of elements in popup is done based on object reference ( if non primitive )
  // This is why we need to reset multi-select value based on the available choices of the multi-select itself
  if (
    widget instanceof MultiSelectComponent &&
    !surveyQuestion.isPrimitiveValue
  ) {
    const initialValue = widget.value || [];
    const value = choices.filter((x: any) =>
      initialValue.find((y) => isEqual(x, y))
    );
    widget.value = value;
  }

  widget.loading = false;
  widget.disabled = surveyQuestion.isReadOnly;
}
export default updateChoices;
