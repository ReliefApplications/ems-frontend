import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterPosition } from './enums/dashboard-filters.enum';

/**
 *
 */
@Component({
  selector: 'safe-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class SafeDashboardFilterComponent implements OnInit, AfterViewInit {
  @Input() position: FilterPosition = FilterPosition.TOP;
  @Input() filters = [
    {
      name: 'region',
      options: ['Madrid', 'Paris', 'Berlin', 'London'],
      multiple: true,
    },
    {
      name: 'countries',
      options: ['Spain', 'France', 'Germany', 'England'],
      multiple: true,
    },
    {
      name: 'Hazard',
      options: ['None', 'Low', 'Medium', 'High'],
      multiple: false,
    },
    {
      name: 'Status',
      options: ['Open', 'Close'],
      multiple: false,
    },
  ];

  public positionList = [
    FilterPosition.LEFT,
    FilterPosition.TOP,
    FilterPosition.BOTTOM,
    FilterPosition.RIGHT,
  ] as const;
  public isDrawerOpen = true;
  public filterFormGroup!: FormGroup;
  public themeColor!: string;
  public filterPosition = FilterPosition;
  public containerWidth!: string;
  public containerHeight!: string;

  /**
   * Class constructor
   *
   * @param environment environment
   * @param cdr ChangeDetectorRef
   */
  constructor(
    @Inject('environment') environment: any,
    private cdr: ChangeDetectorRef
  ) {
    this.themeColor = environment.theme.primary;
  }

  ngOnInit(): void {
    if (this.filters) {
      let controlsObj = {};
      this.filters.forEach((filterData) => {
        controlsObj = {
          ...controlsObj,
          [filterData.name]: new FormControl(),
        };
      });
      this.filterFormGroup = new FormGroup(controlsObj);
    }
  }

  // We need the set the fix values first as we do not know the number of filters the component is going to receive
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isDrawerOpen = false;
      this.setFixedStyles();
    }, 0);
  }

  /**
   * Set the dashboard-filter content fix width and height
   * in order to make the drawer work correctly
   */
  private setFixedStyles() {
    this.containerHeight =
      this.position === FilterPosition.TOP ||
      this.position === FilterPosition.BOTTOM
        ? document
            .getElementsByClassName('dashboard-filter-content')
            .item(0)
            ?.clientHeight.toString() + 'px'
        : 'auto';
    this.containerWidth =
      this.position === FilterPosition.LEFT ||
      this.position === FilterPosition.RIGHT
        ? document
            .getElementsByClassName('dashboard-filter-content')
            .item(0)
            ?.clientWidth.toString() + 'px'
        : 'auto';
    this.cdr.detectChanges();
  }

  /**
   * Set the current position of the filter wrapper
   *
   * @param position Position to set
   */
  public changeFilterPosition(position: FilterPosition) {
    // Needed when switching to left and right, otherwise open/close feature not working
    // (probably a bug, checkable in their example code as well: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Drawer/LeftOrRightPosition/Angular/Light/)
    if (position === FilterPosition.LEFT || position === FilterPosition.RIGHT) {
      const isDrawerOpenState = this.isDrawerOpen;
      this.isDrawerOpen = true;
      setTimeout(() => {
        this.isDrawerOpen = isDrawerOpenState;
      }, 0);
    }
    this.position = position;
    setTimeout(() => {
      this.setFixedStyles();
    }, 0);
  }
}
