import { Component, Input } from '@angular/core';

/**
 * UI Tab Component : It is not usable without being inside a navigation tab
 */
@Component({
  selector: 'ui-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  @Input() label!: string;
}
