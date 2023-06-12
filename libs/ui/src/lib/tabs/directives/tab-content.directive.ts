import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uiTabContent]',
})
export class TabContentDirective {
  constructor(public template: TemplateRef<any>) {}
}
