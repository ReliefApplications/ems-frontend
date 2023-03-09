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
    this.position = position;
  }

  public toggleCollapse() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
