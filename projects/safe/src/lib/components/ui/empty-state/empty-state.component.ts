import { Component, Input, TemplateRef } from '@angular/core';

/**
 * Empty state component, this component can be used in different situation when no data is present, all parameters are optional.
 */
@Component({
  selector: 'safe-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class SafeEmptyStateComponent {
  // Material icon name, has priority over an image
  @Input() icon?: string;
  // Image URL
  @Input() image?: string;
  // Title of the component
  @Input() title?: string;
  // Subtitle of the component
  @Input() subtitle?: string;
  // Action template, will be inserted after everythin else
  @Input() action?: TemplateRef<any>;

  /**
   * Constructor for Empty state component
   */
  constructor() {}
}
