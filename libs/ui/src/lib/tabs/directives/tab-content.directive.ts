import { Directive, TemplateRef } from '@angular/core';

/**
 * UI Tab content directive.
 * Can be used for lazy-loading of tabs.
 */
@Directive({
  selector: '[uiTabContent]',
})
export class TabContentDirective {
  /**
   * UI Tab content directive.
   * Can be used for lazy-loading of tabs.
   *
   * @param template template reference
   */
  constructor(public template: TemplateRef<any>) {}
}
