import { Component, Inject, Input, OnInit } from '@angular/core';
import { FilterPosition } from './enums/dashboard-filters.enum';

@Component({
  selector: 'safe-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class SafeDashboardFilterComponent implements OnInit {
  @Input() position: FilterPosition = FilterPosition.BOTTOM;
  public filterPosition = FilterPosition;
  public isCollapsed = true;
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

  constructor(@Inject('environment') environment: any) {
    this.themeColor = environment.theme.primary;
  }

  ngOnInit(): void {
    console.log(this.position);
  }

  public changeFilterPosition(position: FilterPosition) {
    this.position = position;
  }

  public toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
