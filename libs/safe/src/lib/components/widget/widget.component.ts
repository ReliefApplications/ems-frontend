import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostBinding,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { SafeChartComponent } from '../widgets/chart/chart.component';
import { SafeEditorComponent } from '../widgets/editor/editor.component';
import { SafeGridWidgetComponent } from '../widgets/grid/grid.component';
import { SafeMapWidgetComponent } from '../widgets/map/map.component';
import { SafeSummaryCardComponent } from '../widgets/summary-card/summary-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SafeApplicationWidgetService } from '../../services/application/application-widget.service';
import { SafeApplicationService } from '../../services/application/application.service';
import { v4 as uuidv4 } from 'uuid';
import get from 'lodash/get';
import { SafeRestService } from '../../services/rest/rest.service';

/** Component for the widgets */
@Component({
  selector: 'safe-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  providers: [SafeApplicationWidgetService],
})
export class SafeWidgetComponent implements OnInit, OnDestroy {
  @Input() widget: any;
  @Input() header = true;
  @Input() canUpdate = false;

  private activeComponentSubscriptions = new Subscription();
  buildName!: string;

  /** @returns would component block navigation */
  get canDeactivate() {
    if (this.widgetContentComponent instanceof SafeGridWidgetComponent) {
      return this.widgetContentComponent.canDeactivate;
    } else {
      return true;
    }
  }

  private customStyle?: HTMLStyleElement;

  @HostBinding()
  id = `widget-${uuidv4()}`;

  @ViewChild('widgetContent')
  widgetContentComponent!:
    | SafeChartComponent
    | SafeGridWidgetComponent
    | SafeMapWidgetComponent
    | SafeEditorComponent
    | SafeSummaryCardComponent;

  // === EMIT EVENT ===
  @Output() edit: EventEmitter<any> = new EventEmitter();

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() changeStep: EventEmitter<number> = new EventEmitter();

  /**
   * Widget constructor
   *
   * @param router Router
   * @param activatedRoute ActivatedRoute
   * @param applicationService SafeApplicationService
   * @param applicationWidgetService SafeApplicationWidgetService
   * @param restService SafeRestService
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private applicationService: SafeApplicationService,
    private applicationWidgetService: SafeApplicationWidgetService,
    private restService: SafeRestService
  ) {}

  ngOnInit(): void {
    // Get style from widget definition
    const style = get(this.widget, 'settings.widgetDisplay.style') || '';
    if (style) {
      const scss = `#${this.id} {
            ${style}
          }`;
      // Compile to css ( we store style as scss )
      this.restService
        .post('style/scss-to-css', { scss }, { responseType: 'text' })
        .subscribe((css) => {
          // Add to head of document
          const head = document.getElementsByTagName('head')[0];
          this.customStyle = document.createElement('style');
          this.customStyle.appendChild(document.createTextNode(css));
          head.appendChild(this.customStyle);
        });
    }

    if (this.widget.component === 'tabs') {
      this.buildName = `applicationWidget${
        this.applicationService.application
          .getValue()
          ?.pages?.filter((p) => p.id === 'tabs').length
      }`;
      //@ TODO Improve this access to the route config with the outlet
      const newSubRoute = [
        (
          this.router['config'][1]?.['children']?.[1]?.['children']?.[0] as any
        )?.(['_loadedRoutes']?.[0]?.['children' as any]?.[3] as any)?.[
          '_loadedRoutes'
        ]?.[0]?.['children'],
      ];
      // Set the outlet name
      newSubRoute[0].outlet = this.buildName;
      // Merge with the current route config
      const newRoutes = [
        // 4
        ...this.router.config,
        ...newSubRoute,
      ];
      // Reset the config with the outleted config and see if it goes to that router-outlet
      this.router.resetConfig(newRoutes);

      this.applicationWidgetService.widgetState = {
        header: this.header,
        widget: this.widget,
        settings: this.widget.settings,
      };
      if (this.buildName) {
        setTimeout(() => {
          this.router.navigate(
            ['./', { outlets: { [this.buildName]: 'tab' } }],
            {
              relativeTo: this.activatedRoute,
              skipLocationChange: true,
            }
          );
        }, 0);
      }
    }
  }

  /**
   * Add listeners to listen for application widget changes
   */
  setApplicationWidgetListeners() {
    this.activeComponentSubscriptions
      .add
      // this.applicationWidgetService.applicationWidgetTile$
      //   .pipe(
      //     filter((applicationSettings: any | null) => !!applicationSettings)
      //   )
      //   .subscribe({
      //     next: (applicationSettings: any) => {
      //       this.edit.emit({
      //         id: this.widget.id,
      //         options: applicationSettings,
      //         type: 'data',
      //       });
      //     },
      //   })
      ();
  }

  /**
   * Remove all listeners for application widget changes
   */
  removeApplicationWidgetListeners() {
    this.activeComponentSubscriptions.unsubscribe();
  }

  ngOnDestroy(): void {
    this.activeComponentSubscriptions.unsubscribe();
    // Remove style from head if exists, to avoid too many styles to be active at same time
    if (this.customStyle) {
      document.getElementsByTagName('head')[0].removeChild(this.customStyle);
    }
  }
}
