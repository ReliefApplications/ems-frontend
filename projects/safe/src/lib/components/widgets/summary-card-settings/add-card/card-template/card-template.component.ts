import { Component, Input } from '@angular/core';

/**
 * Card template component, used by Add Card modal to display latest templates.
 */
@Component({
  selector: 'safe-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.scss'],
})
export class SafeCardTemplateComponent {
  @Input() title = '';
  @Input() dashboardName = '';
  @Input() isDynamic = false;
}
