import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Variant } from '../shared/variant.enum';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

/**
 * UI Navigation Tab Component
 */
@Component({
  selector: 'ui-navigation-tab',
  templateUrl: './navigation-tab.component.html',
  styleUrls: ['./navigation-tab.component.scss'],
  animations: [
    trigger('tabContentDisplay', [
      // Initial state of content when loading component is visible(no animation)
      state('initial', style({ opacity: 1, transform: 'translateX(0%)' })),
      // Load content state is hidden when we load another tab that is not the default one
      state(
        'loadContent',
        style({ opacity: 0.1, transform: 'translateX(100%)' })
      ),
      // From the load content to content-in we would trigger the animation that loads the content in from bottom to top
      transition('loadContent => initial', [animate('.3s ease-in-out')]),
      transition('initial => loadContent', [animate('.001s ease-in-out')]),
    ]),
  ],
})
export class NavigationTabComponent {
  ColorVariant = Variant;
  triggerAnimation = false;

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

  /**
   * Changes the state of the animation when displaying/destroying content
   *
   * @param event true if content is to be displayed, false when destroying
   */
  toggleAnimationEvent(event: any) {
    this.triggerAnimation = event;
  }
}
