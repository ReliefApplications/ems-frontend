import { Component, ContentChildren, QueryList } from '@angular/core';
import { Variant } from '../shared/variant.enum';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { TabComponent } from '../tab/tab.component';

/**
 * UI Navigation Tab Component
 */
@Component({
  selector: 'ui-navigation-tabs',
  templateUrl: './navigation-tabs.component.html',
  styleUrls: ['./navigation-tabs.component.scss'],
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
export class NavigationTabsComponent {
  @ContentChildren(TabComponent, { descendants: true })
  tabs!: QueryList<TabComponent>;

  triggerAnimation = false;
  vertical = false;
  variant: Variant = Variant.DEFAULT;

  /** @returns general resolved position classes for navigation tabs*/
  get resolveTabPositionClasses(): string[] {
    const classes = [];
    if (this.vertical) {
      classes.push('col-span-3');
      classes.push('flex-col');
      classes.push('h-full');
    } else {
      classes.push('border-b');
    }
    return classes;
  }
}
