import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
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
  public isDrawerOpen = false;
  public filterFormGroup!: FormGroup;
  public themeColor!: string;
  public filterPosition = FilterPosition;
  public containerWidth!: string;
  public containerHeight!: string;

  /**
   * Class constructor
   *
   * @param environment environment
   * @param hostElement HostElement
   */
  constructor(
    @Inject('environment') environment: any,
    private hostElement: ElementRef
  ) {
    this.themeColor = environment.theme.primary;
  }

  /**
   * Set the drawer height and width on resize
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.containerWidth =
      this.hostElement.nativeElement?.offsetWidth.toString() + 'px';
    this.containerHeight =
      this.hostElement.nativeElement?.offsetHeight.toString() + 'px';
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
      this.containerWidth =
        this.hostElement.nativeElement?.offsetWidth.toString() + 'px';
      this.containerHeight =
        this.hostElement.nativeElement?.offsetHeight.toString() + 'px';
    }, 0);
  }

  /**
   * Set the current position of the filter wrapper
   *
   * @param position Position to set
   */
  public changeFilterPosition(position: FilterPosition) {
    this.position = position;
  }
}
