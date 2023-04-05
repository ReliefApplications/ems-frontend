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
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SafeFilterBuilderComponent } from './filter-builder-modal/filter-builder.component';

/**
 *
 */
@Component({
  selector: 'safe-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class SafeDashboardFilterComponent implements OnInit, AfterViewInit {
  @Input() position: FilterPosition = FilterPosition.LEFT;
  public filters: any[] = [];

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
   * @param hostElement Host/Component Element
   * @param dialog The material dialog service
   */
  constructor(
    @Inject('environment') environment: any,
    private hostElement: ElementRef,
    private dialog: MatDialog
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

  /**
   * Event to close drawer on esc
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEsc() {
    this.isDrawerOpen = false;
  }

  ngOnInit(): void {
    if (this.filters) {
      this.setupFormGroup();
    }
  }

  // We need the set the fix values first as we do not know the number of filters the component is going to receive
  // And because the drawerPositioner directive makes the element fixed
  ngAfterViewInit(): void {
    // This settimeout is needed as this dashboard is currently placed inside a mat-drawer
    // We have to set a minimum timeout fix to get the real width of the host component until mat-drawer fully opens
    // If the dashboard filter is placed somewhere else that is not a mat-drawer this would not be needed
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

  /**
   * Opens the modal to edit filters
   */
  public onEditFilter() {
    const dialogRef = this.dialog.open(SafeFilterBuilderComponent, {
      height: '100%',
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((questions) => {
      console.log('filter modal closed', questions);
      this.filters = questions;
      this.setupFormGroup();
    });
  }

  /**
   * Sets up the formGroup from filters
   */
  public setupFormGroup() {
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
