import { ChangeDetectorRef, Component, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionResourceCustomFiltersModel } from './resource-select-text.model';
import { IconModule } from '@oort-front/ui';

/**
 * Resource custom filter component for survey creator
 */
@Component({
  selector: 'safe-resource-custom-filters',
  standalone: true,
  imports: [CommonModule, IconModule],
  template: `
    <p>
      <ui-icon icon="info"></ui-icon> You can use curly brackets to get access
      to the question values.
    </p>
    <p><b>field</b>: select the field to be filter by:</p>
    <p><b>operator</b>: contains, =, !=, >, <, >=, <=</p>
    <p class="mb-1"><b>value</b>: &#123;question1&#125; or static value</p>
    <p><b>Example</b>:</p>
    <pre><code>[{{filterExample1 | json}}, {{filterExample2 | json}}]</code></pre>
  `,
})
export class SafeResourceCustomFiltersComponent extends QuestionAngular<QuestionResourceCustomFiltersModel> {
  filterExample1 = { field: 'name', operator: 'contains', value: 'Laura' };
  filterExample2 = { field: 'age', operator: '>', value: '{question1}' };

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {ChangeDetectorRef} changeDetectorRef - Angular - This is angular change detector ref of the component instance needed for the survey AngularQuestion class
   * @param {ViewContainerRef} viewContainerRef - Angular - This is angular view container ref of the component instance needed for the survey AngularQuestion class
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef
  ) {
    super(changeDetectorRef, viewContainerRef);
  }
}
