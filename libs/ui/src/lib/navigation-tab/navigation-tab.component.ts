import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-navigation-tab',
  templateUrl: './navigation-tab.component.html',
  styleUrls: ['./navigation-tab.component.scss'],
})
export class NavigationTabComponent {
  @Input() selectedIndex = 0;
  @Input() vertical = false;
}
