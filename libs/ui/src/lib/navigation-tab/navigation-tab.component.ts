import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Variant } from '../shared/variant.enum';

/**
 * UI Navigation Tab Component
 */
@Component({
  selector: 'ui-navigation-tab',
  templateUrl: './navigation-tab.component.html',
  styleUrls: ['./navigation-tab.component.scss'],
})
export class NavigationTabComponent {
  ColorVariant = Variant;

  @Input() selectedIndex = 0;
  @Input() vertical = false;
  @Input() variant: Variant = this.ColorVariant.DEFAULT;
  @Output() selectedIndexChange = new EventEmitter<number>();

  /**
   * Relay in order to emit the index of the selected tab
   *
   * @param event index of the currently selected tab
   */
  selectedIndexChangeEvent(event: any) {
    this.selectedIndexChange.emit(event);
  }
}
