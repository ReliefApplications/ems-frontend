import { Component, Inject, Input } from '@angular/core';
import { FilterPosition } from './enums/dashboard-filters.enum';

@Component({
  selector: 'safe-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class SafeDashboardFilterComponent {
  @Input() position: FilterPosition = FilterPosition.TOP;
  public isDrawerOpen = false;
  public positionList = [
    {
      position: FilterPosition.BOTTOM,
      icon: 'home',
    },
    {
      position: FilterPosition.TOP,
      icon: 'home',
    },
    {
      position: FilterPosition.LEFT,
      icon: 'home',
    },
    {
      position: FilterPosition.RIGHT,
      icon: 'home',
    },
  ];
  public themeColor!: string;
  public filterPosition = FilterPosition;

  constructor(@Inject('environment') environment: any) {
    this.themeColor = environment.theme.primary;
  }

  public changeFilterPosition(position: FilterPosition) {
    // Needed when switching to left and right, otherwise open/close feature not working
    // (probably a bug, checkable in their example  code as well: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Drawer/LeftOrRightPosition/Angular/Light/)
    if (position === FilterPosition.LEFT || position === FilterPosition.RIGHT) {
      const isDrawerOpenState = this.isDrawerOpen;
      this.isDrawerOpen = true;
      setTimeout(() => {
        this.isDrawerOpen = isDrawerOpenState;
      }, 0);
    }
    this.position = position;
  }

  public toggleCollapse() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
