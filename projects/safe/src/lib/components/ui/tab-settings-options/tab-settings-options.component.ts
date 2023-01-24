import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  state,
} from '@angular/animations';
import { TabSettingsOptionConfig } from './tab-settings-options.interface';

@Component({
  selector: 'safe-tab-settings-options',
  templateUrl: './tab-settings-options.component.html',
  styleUrls: ['./tab-settings-options.component.scss'],
  animations: [
    trigger('tabContentDisplay', [
      // Initial state of content when loading component is visible(no animation)
      state('initial', style({ opacity: 1, transform: 'translateY(0%)' })),
      // Load content state is hidden when we load another tab that is not the default one
      state(
        'loadContent',
        style({ opacity: 0, transform: 'translateY(100%)' })
      ),
      // From the load content to content-in we would trigger the animation that loads the content in from bottom to top
      transition('loadContent => contentIn', [
        query(':self', [
          animate(
            '.3s ease-in-out',
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ]),
      ]),
    ]),
  ],
})
export class SafeTabSettingsOptionsComponent<T> implements OnInit {
  @Input() tabOptionsConfig: TabSettingsOptionConfig<T>[] = [];
  @Output() selectedTabEvent: EventEmitter<T> = new EventEmitter<T>();
  selectedTab!: T;
  triggerAnimation = 'initial';

  ngOnInit(): void {
    /**Default selected tab would be the first one */
    this.handleTabChange(this.tabOptionsConfig[0], true);
  }

  /**
   * Emits the selected tab to the parent component
   */
  public handleTabChange(
    selectedTab: TabSettingsOptionConfig<T>,
    isDefaultTab = false
  ): void {
    /** If the tab selected is disabled or the tab number is just one we won't trigger any action*/
    if (
      selectedTab.disabled ||
      (this.tabOptionsConfig.length === 1 && !isDefaultTab)
    ) {
      return;
    }
    this.selectedTab = selectedTab.tab;
    /** If is not the default tab we trigger the content animation
     */
    if (!isDefaultTab) {
      this.triggerAnimation = 'loadContent';
      setTimeout(() => {
        this.triggerAnimation = 'contentIn';
      }, 0);
    }
    this.selectedTabEvent.emit(selectedTab.tab);
  }
}
