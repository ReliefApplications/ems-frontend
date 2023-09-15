import { ChangeDetectorRef, Component, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionResourceSelectTextModel } from './resource-select-text.model';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@oort-front/ui';

/**
 * This component is used to display an informational tag to user in the survey creator if no resource is selected.
 */
@Component({
  selector: 'safe-resource-select-text',
  standalone: true,
  imports: [CommonModule, TranslateModule, IconModule],
  template: `<ui-icon icon="info"></ui-icon>
    {{
      'components.formBuilder.propertyGrid.resource.resourceSelectText'
        | translate
    }}`,
})
export class SafeResourceSelectTextComponent extends QuestionAngular<QuestionResourceSelectTextModel> {
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
