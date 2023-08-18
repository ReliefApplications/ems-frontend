import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { WIDGET_TYPES } from '../../models/dashboard.model';
import {
  TileLayoutReorderEvent,
  TileLayoutResizeEvent,
} from '@progress/kendo-angular-layout';
import { SafeDashboardService } from '../../services/dashboard/dashboard.service';
import { SafeWidgetComponent } from '../widget/widget.component';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { ActivatedRoute, Router } from '@angular/router';
// import get from 'lodash/get';
import { differenceBy } from 'lodash';

/** Maximum height of the widget in row units */
const MAX_ROW_SPAN = 4;

/** Maximum width of the widget in column units */
const MAX_COL_SPAN = 8;

/**
 * Component definition for grid widgets
 */
@Component({
  selector: 'safe-widget-grid',
  templateUrl: './widget-grid.component.html',
  styleUrls: ['./widget-grid.component.scss'],
})
export class SafeWidgetGridComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnChanges
{
  public availableWidgets: any[] = WIDGET_TYPES;

  @Input() loading = false;
  /** Skeletons for loading */
  public skeletons: { colSpan: number; rowSpan: number }[] = [];

  @Input() widgets: any[] = [];
  @Input() canUpdate = false;

  // === GRID ===
  colsNumber = MAX_COL_SPAN;
  displayedAsTabWidget = false;

  // === EVENT EMITTER ===
  @Output() move: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() style: EventEmitter<any> = new EventEmitter();

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() changeStep: EventEmitter<number> = new EventEmitter();

  @ViewChildren(SafeWidgetComponent)
  widgetComponents!: QueryList<SafeWidgetComponent>;

  /**
   * Indicate if the widget grid can be deactivated or not.
   *
   * @returns indicate if one of the widget children cannot be deactivated.
   */
  get canDeactivate() {
    return !this.widgetComponents.some((x) => !x.canDeactivate);
  }

  public isBackOffice = false;

  /**
   * Get widgets that are tabs type
   *
   * @returns tabs type widgets
   */
  get tabWidgets() {
    return this.widgets.filter((widget) => widget.component === 'tabs');
  }
  tabWidgetHeight!: string;

  /**
   * Changes display when windows size changes.
   *
   * @param event window resize event
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.colsNumber = this.setColsNumber(event.target.innerWidth);
    this.skeletons = this.getSkeletons();
  }

  /**
   * Constructor of the grid widget component
   *
   * @param environment This is the environment in which we are running the application
   * @param dialog The Dialog service
   * @param dashboardService Shared dashboard service
   * @param router Router
   * @param activatedRoute ActivatedRoute
   */
  constructor(
    @Inject('environment') environment: any,
    public dialog: Dialog,
    private dashboardService: SafeDashboardService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    if (environment.module === 'backoffice') {
      this.isBackOffice = true;
    }
  }

  /**
   * Extracts the path to the outlet property of the given router config
   *
   * @param routeObj Router config
   * @param currPath Array of router config paths to outlet property
   * @returns currPath
   */
  // private getOutletPath(routeObj: any, currPath: string[]): string[] {
  //   if (routeObj.outlet) {
  //     return [''];
  //   }
  //   const pathFound: string[] = [];
  //   const path = routeObj.children ? 'children' : '_loadedRoutes';
  //   if (routeObj[path]?.length) {
  //     for (let index = 0; index < routeObj[path].length; index++) {
  //       if (routeObj[path][index].outlet !== undefined) {
  //         pathFound.push(path);
  //         currPath.push(...pathFound);
  //         return pathFound;
  //       } else {
  //         const actualPathFound = this.getOutletPath(
  //           routeObj[path][index],
  //           currPath
  //         );
  //         if (actualPathFound[0] !== '' || actualPathFound.length > 1) {
  //           pathFound.push(index.toString());
  //           pathFound.push(path);
  //           currPath.push(...pathFound);
  //           return pathFound;
  //         }
  //       }
  //     }
  //   }
  //   return [''];
  // }

  /**
   * Check and update current application router config in order to add a new tab route
   *
   * @param outletName outlet name to check/set
   * @param pathName path name to check/set
   * @returns true if a application router configuration is updated with a new tab
   */
  // private buildNewTabRouteConfig(outletName: string, pathName: string): any {
  //   const pathArray: string[] = [];
  //   const currentConfig = this.router['config'];
  //   this.getOutletPath(currentConfig[1], pathArray);

  //   const outletPath = pathArray.reverse();
  //   const outletRouteConfigArray = get(currentConfig[1], outletPath);

  //   let newRoute;
  //   if (
  //     !outletRouteConfigArray.find(
  //       (routeConfig: Route) => routeConfig.path === pathName
  //     )
  //   ) {
  //     const newOutletRouteConfig = { ...outletRouteConfigArray[0] };
  //     newOutletRouteConfig.outlet = outletName ?? '';
  //     newOutletRouteConfig.path = pathName;
  //     outletRouteConfigArray.push(newOutletRouteConfig);
  //     newRoute = currentConfig;
  //   }
  //   return newRoute;
  // }

  /**
   * Set the path and outlet config for the given application tab widgets
   *
   */
  private buildTabWidgetRoutes() {
    // let isRouteCreated = false;
    for (let index = 0; index < this.tabWidgets.length; index++) {
      const widget = this.tabWidgets[index];
      widget.settings.outletName =
        index !== 0 ? `applicationWidget${index}` : null;
      widget.settings.pathName = `tab${this.tabWidgets.length - 1}`;
      // const newRoute = this.buildNewTabRouteConfig(
      //   widget.settings.outletName,
      //   widget.settings.pathName
      // );
      // if (newRoute) {
      //   this.router.resetConfig(newRoute);
      //   isRouteCreated = true;
      // }
    }
    // return isRouteCreated;
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.displayedAsTabWidget = data.source === 'widget';
      },
    });
    this.colsNumber = this.setColsNumber(window.innerWidth);
    this.skeletons = this.getSkeletons();
    this.availableWidgets = this.dashboardService.availableWidgets;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const isApplicationWidgetChange = differenceBy(
      changes['widgets']?.currentValue,
      changes['widgets']?.previousValue,
      'settings.applicationId'
    ).length;
    if (
      (changes['widgets'].currentValue && isApplicationWidgetChange !== 0) ||
      (isApplicationWidgetChange === 0 &&
        changes['widgets'].previousValue?.length !==
          changes['widgets'].currentValue?.length)
    ) {
      // Disable/enable option to add a new tabs widget component once we have/haven't one set
      if (this.tabWidgets.length) {
        this.availableWidgets = this.dashboardService.availableWidgets?.filter(
          (widget) => widget.component !== 'tabs'
        );
      } else {
        this.availableWidgets = this.dashboardService.availableWidgets;
      }
      this.buildTabWidgetRoutes();
      // const newRouteWasCreated = this.buildTabWidgetRoutes();
      // // Rerun navigation to set the new route config
      // if (newRouteWasCreated) {
      //   this.router.navigateByUrl(`${location.pathname}`);
      //   return;
      // }
      // Trigger navigation for each of the application tab widgets
      this.tabWidgets.forEach((widget) => {
        this.tabWidgetHeight = `${widget.defaultRows * 200 - 100}px`;
        // setTimeout(() => {
        const subRoute = widget.settings.outletName
          ? `(${widget.settings.outletName}:${widget.settings.pathName})`
          : `${widget.settings.pathName}`;
        this.router.navigateByUrl(`${location.pathname}/${subRoute}`, {
          skipLocationChange: true,
        });
        // }, 1000 * index);
      });
    }
  }

  /**
   * Changes the number of displayed columns.
   *
   * @param width width of the screen.
   * @returns new number of cols.
   */
  private setColsNumber(width: number): number {
    if (width <= 480) {
      return 1;
    }
    if (width <= 600) {
      return 2;
    }
    if (width <= 800) {
      return 4;
    }
    if (width <= 1024) {
      return 6;
    }
    return MAX_COL_SPAN;
  }

  /**
   * Emits edition event.
   *
   * @param e widget to edit.
   */
  onEditWidget(e: any): void {
    this.edit.emit(e);
  }

  /**
   * Emits delete event.
   *
   * @param e widget to delete.
   */
  onDeleteWidget(e: any): void {
    this.delete.emit(e);
  }

  /**
   * Emits style event.
   *
   * @param e widget to style.
   */
  onStyleWidget(e: any): void {
    const widgetComp = this.widgetComponents.find(
      (v) => v.widget.id == e.widget.id
    );
    this.style.emit({
      domId: widgetComp?.id,
      widget: e.widget,
    });
  }

  /**
   * Expands widget in a full size screen popup.
   *
   * @param e widget to open.
   */
  async onExpandWidget(e: any): Promise<void> {
    const widget = this.widgets.find((x) => x.id === e.id);
    const { SafeExpandedWidgetComponent } = await import(
      './expanded-widget/expanded-widget.component'
    );
    const dialogRef = this.dialog.open(SafeExpandedWidgetComponent, {
      data: {
        widget,
      },
      autoFocus: false,
    });
    dialogRef.componentInstance?.changeStep
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        this.changeStep.emit(event);
        dialogRef.close();
      });
  }

  /**
   * Emits addition event.
   *
   * @param e new widget.
   */
  onAdd(e: any): void {
    this.add.emit(e);
  }

  /**
   * Emits reorder event.
   *
   * @param e reorder event.
   */
  public onReorder(e: TileLayoutReorderEvent): void {
    this.move.emit(e);
  }

  /**
   * Handles resize widget event.
   *
   * @param e resize event.
   */
  public onResize(e: TileLayoutResizeEvent) {
    const widgetDefinition = this.dashboardService.availableWidgets.find(
      (x) => x.component === this.widgets[e.item.order].component
    );
    if (widgetDefinition && e.newRowSpan < widgetDefinition.minRow) {
      e.newRowSpan = widgetDefinition.minRow;
    }
    if (e.newRowSpan > MAX_ROW_SPAN) {
      e.newRowSpan = MAX_ROW_SPAN;
    }
    if (e.newColSpan > MAX_COL_SPAN) {
      e.newColSpan = MAX_COL_SPAN;
    }
    // Re calculate fix height in order to have scroll for overflown content within the tabs widget
    if (widgetDefinition?.component === 'tabs') {
      this.tabWidgetHeight = `${e.newRowSpan * 200 - 100}px`;
    }
    this.edit.emit({
      type: 'display',
      id: this.widgets[e.item.order].id,
      options: {
        id: this.widgets[e.item.order].id,
        cols: e.newColSpan,
        rows: e.newRowSpan,
      },
    });
  }

  /**
   * Generates a list of skeletongs, for loading.
   *
   * @returns List of skeletons.
   */
  private getSkeletons(): { colSpan: number; rowSpan: number }[] {
    const skeletons = [];
    let remainingColsNumber = this.colsNumber;
    for (let i = 0; i < 10; i++) {
      const colSpan = Math.floor(Math.random() * remainingColsNumber) + 1;
      remainingColsNumber -= colSpan;
      if (remainingColsNumber === 0) {
        remainingColsNumber = this.colsNumber;
      }
      skeletons.push({
        colSpan,
        rowSpan: Math.floor(Math.random() * MAX_ROW_SPAN) + 1,
      });
    }
    return skeletons;
  }
}
