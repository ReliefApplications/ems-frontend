import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WidgetAutomation } from '../../../../../models/automation.model';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { of, switchMap, takeUntil, tap } from 'rxjs';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { MapLayersService } from 'libs/shared/src/lib/services/map/map-layers.service';

/**
 * Tab API editor dialog component
 */
@Component({
  selector: 'shared-tab-api-editor',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  templateUrl: './tab-api-editor.component.html',
})
export class TabApiEditorComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Automation rule form group */
  public automationRuleForm: FormGroup = this.fb.group({
    name: [this.data?.name ?? '', Validators.required],
    id: [this.data?.id ?? null],
    targetWidget: [this.data?.targetWidget ?? null],
    layers: [this.data?.layers ?? []],
    event: [this.data?.event ?? null],
  });

  /** Current dashboard widgets */
  widgets: any[] = [];
  /** Selected widget map available layers */
  widgetLayers: any[] = [];
  /** Available events automation */
  private availableEvents = ['expand', 'collapse', 'open', 'close', 'hide'];
  /** Events available for the current selected widget */
  currentEventsToSelect: string[] = [];
  //
  selectedWidget!: any;

  /**
   * Channel component, act as modal.
   * Used for both edition and addition of channels.
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   * @param dashboardService DashboardService
   * @param mapLayersService Map layers service
   * @param data Injected dialog data
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<TabApiEditorComponent>,
    private dashboardService: DashboardService,
    private mapLayersService: MapLayersService,
    @Optional()
    @Inject(DIALOG_DATA)
    public data: WidgetAutomation
  ) {
    super();
  }

  ngOnInit(): void {
    this.dashboardService.currentDashboardWidgets$
      .pipe(takeUntil(this.destroy$))
      .subscribe((widgets: any[]) => {
        this.widgets = widgets ?? [];
      });
    this.automationRuleForm
      .get('targetWidget')
      ?.valueChanges.pipe(
        tap(() => {
          this.updateEventList();
        }),
        switchMap(() => {
          if (this.selectedWidget?.component === 'map') {
            return this.mapLayersService.getLayers(
              this.selectedWidget.settings?.layers ?? []
            );
          } else {
            return of([]);
          }
        }),
        tap((layers) => (this.widgetLayers = layers)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.automationRuleForm
          .get('event')
          ?.setValue(null, { emitEvent: false });
      });
    this.updateEventList();
    if (this.selectedWidget?.component === 'map') {
      this.mapLayersService
        .getLayers(this.selectedWidget.settings?.layers ?? [])
        .subscribe((layers) => (this.widgetLayers = layers));
    }
  }

  /**
   * Update current selected widget value and the available events accordingly
   */
  private updateEventList() {
    this.selectedWidget = this.widgets.filter(
      (widget) =>
        this.automationRuleForm.get('targetWidget')?.value === widget.id
    )?.[0];
    if (!this.selectedWidget) {
      this.currentEventsToSelect = [];
    } else {
      switch (this.selectedWidget.component) {
        case 'map':
          this.currentEventsToSelect = this.availableEvents.filter(
            (event) => event == 'open' || event == 'close'
          );
          break;
        default:
          this.currentEventsToSelect = this.availableEvents.filter(
            (event) => event != 'open' && event != 'close'
          );
          break;
      }
    }
  }
}
