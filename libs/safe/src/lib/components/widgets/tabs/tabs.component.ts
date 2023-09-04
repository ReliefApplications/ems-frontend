import { Component, Input } from '@angular/core';

/**
 * Tabs widget component.
 */
@Component({
  selector: 'safe-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  /** Should display header */
  @Input() header = true;
  /** Widget settings */
  @Input() settings: any;
}
