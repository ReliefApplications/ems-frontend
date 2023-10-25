import { Component, Input, TemplateRef } from '@angular/core';

/**
 * Empty state component, this component can be used in different situation when no data is present, all parameters are optional.
 */
@Component({
  selector: 'shared-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
})
export class EmptyComponent {
  /**  Icon name, has priority over an image */
  @Input() icon?: string;
  /** Image URL */
  @Input() image?: string;
  /** Title of the component */
  @Input() title?: string;
  /** Subtitle of the component */
  @Input() subtitle?: string;
  /** Footer template, will be inserted after everything else */
  @Input() footerTemplate?: TemplateRef<any>;
}
