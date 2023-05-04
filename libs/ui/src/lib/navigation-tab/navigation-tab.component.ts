import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-navigation-tab',
  templateUrl: './navigation-tab.component.html',
  styleUrls: ['./navigation-tab.component.scss'],
})
export class NavigationTabComponent {
  @Input() selectedIndex = 0;
  @Input() vertical = false;
  @Output() selectedIndexChange = new EventEmitter<number>();

  currentSelected = this.selectedIndex;

  selectedIndexChangeEvent(event: any) {
    this.selectedIndexChange.emit(event);
  }
}
