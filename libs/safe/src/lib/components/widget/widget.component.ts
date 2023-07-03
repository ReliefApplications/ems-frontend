import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { SafeChartComponent } from '../widgets/chart/chart.component';
import { SafeEditorComponent } from '../widgets/editor/editor.component';
import { SafeGridWidgetComponent } from '../widgets/grid/grid.component';
import { SafeMapWidgetComponent } from '../widgets/map/map.component';
import { SafeSummaryCardComponent } from '../widgets/summary-card/summary-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { SafeApplicationWidgetService } from '../../services/application/application-widget.service';

/** Component for the widgets */
@Component({
  selector: 'safe-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class SafeWidgetComponent implements OnInit, OnDestroy {
  @Input() widget: any;
  @Input() header = true;
  @Input() canUpdate = false;

  private activeComponentSubscriptions = new Subscription();

  /** @returns would component block navigation */
  get canDeactivate() {
    if (this.widgetContentComponent instanceof SafeGridWidgetComponent) {
      return this.widgetContentComponent.canDeactivate;
    } else {
      return true;
    }
  }

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
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private applicationWidgetService: SafeApplicationWidgetService
  ) {}

  ngOnInit(): void {
    if (this.widget.component === 'tabs') {
      this.router.navigate(['./', { outlets: { tabWidget: 'tab' } }], {
        state: {
          header: this.header,
          widget: this.widget,
          settings: this.widget?.settings,
        },
        relativeTo: this.activatedRoute,
        skipLocationChange: true,
      });
    }
  }

  setWidgetListeners() {
    this.activeComponentSubscriptions.add(
      this.applicationWidgetService.applicationWidgetTile$
        .pipe(
          filter((applicationSettings: any | null) => !!applicationSettings)
        )
        .subscribe({
          next: (applicationSettings: any) => {
            this.edit.emit({
              id: this.widget.id,
              options: applicationSettings,
              type: 'data',
            });
          },
        })
    );
  }

  removeWidgetListeners() {
    this.activeComponentSubscriptions.unsubscribe();
  }

  ngOnDestroy(): void {
    this.activeComponentSubscriptions.unsubscribe();
  }
}
