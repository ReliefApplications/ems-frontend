import { Component, Input } from '@angular/core';

/**
 * UI Form Wrapper Component (useful only for stories)
 */
@Component({
  selector: 'ui-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
})
export class FormWrapperComponent {
  @Input() outline = false;
}
