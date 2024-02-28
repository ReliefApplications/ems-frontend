import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  DialogModule,
  ExpansionPanelModule,
  FormWrapperModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  WidgetAutomationEvent,
  WidgetAutomationRule,
} from '../../../../../models/automation.model';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { of, switchMap, takeUntil, tap } from 'rxjs';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { MapLayersService } from '../../../../../services/map/map-layers.service';

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
    ExpansionPanelModule,
    TooltipModule,
  ],
  templateUrl: './tab-api-editor.component.html',
})
export class TabApiEditorComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Automation rule form group */
  public automationRuleForm: FormGroup<{
    name: FormControl<string | null>;
    id: FormControl<string | null>;
    events: FormArray<FormGroup>;
  }> = new FormGroup({
    name: new FormControl('', Validators.required),
    id: new FormControl(''),
    events: new FormArray([
      this.fb.group({
        targetWidget: [null],
        layers: [[]],
        event: [null],
      }),
    ]),
  });

  /** Current dashboard widgets */
  widgets: any[] = [];
  /** Selected widget map available layers */
  widgetLayers: any[] = [];
  /** Available events automation */
  private availableEvents = ['expand', 'collapse', 'show', 'hide'];
  /** Events available for the current selected widget */
  currentEventsToSelect: Array<string[]> = [];
  /** Current selected widget properties */
  selectedWidgets: any[] = [];
  /** Form even listeners */
  eventFormListeners: any[] = [];

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
    public data: WidgetAutomationRule
  ) {
    super();
    if (data) {
      this.automationRuleForm.controls.name.setValue(data.name);
      this.automationRuleForm.controls.id.setValue(data.id);
      this.automationRuleForm.controls.events = this.fb.array(
        (data.events ?? []).map((event: WidgetAutomationEvent) => {
          return this.fb.group({
            targetWidget: [event?.targetWidget ?? null],
            layers: [event?.layers ?? []],
            event: [event?.event ?? null],
          });
        })
      );
    }
  }

  ngOnInit(): void {
    this.dashboardService.currentDashboardWidgets$
      .pipe(takeUntil(this.destroy$))
      .subscribe((widgets: any[]) => {
        this.widgets = widgets ?? [];
      });
    this.automationRuleForm.controls.events.controls.forEach(
      (eventForm, index) => {
        this.setEventFormListeners(eventForm, index);
      }
    );

    this.updateEventListForEachEvent();
    this.selectedWidgets.forEach((selectedWidget, index) => {
      if (selectedWidget.component === 'map') {
        this.mapLayersService
          .getLayers(selectedWidget.settings?.layers ?? [])
          .subscribe((layers) => (this.widgetLayers[index] = layers));
      }
    });
  }

  /**
   * Update current selected widget value and the available events accordingly
   */
  private updateEventListForEachEvent() {
    this.automationRuleForm.controls.events.controls.forEach(
      (eventForm, index) => {
        const selectedWidget = this.widgets.find(
          (widget) => eventForm.get('targetWidget')?.value === widget.id
        );
        if (!selectedWidget) {
          this.currentEventsToSelect[index] = [];
        } else {
          this.selectedWidgets[index] = selectedWidget;
          switch (this.selectedWidgets[index].component) {
            case 'map':
              this.currentEventsToSelect[index] = this.availableEvents.filter(
                (event) => event == 'open' || event == 'close'
              );
              break;
            default:
              this.currentEventsToSelect[index] = this.availableEvents.filter(
                (event) => event != 'open' && event != 'close'
              );
              break;
          }
        }
      }
    );
  }

  /**
   * Initializes needed event listeners for the given event form
   *
   * @param eventForm Event form in the expansion panel
   * @param eventIndex Event form index in the events form array
   */
  private setEventFormListeners(eventForm: FormGroup, eventIndex: number) {
    this.eventFormListeners[eventIndex] = eventForm
      .get('targetWidget')
      ?.valueChanges.pipe(
        tap(() => {
          this.updateEventListForEachEvent();
        }),
        switchMap(() => {
          if (this.selectedWidgets[eventIndex]?.component === 'map') {
            return this.mapLayersService.getLayers(
              this.selectedWidgets[eventIndex].settings?.layers ?? []
            );
          } else {
            return of([]);
          }
        }),
        tap((layers) => (this.widgetLayers[eventIndex] = layers)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        eventForm.get('event')?.setValue(null, { emitEvent: false });
      });
  }

  /**
   * Add a new event to the current rule
   */
  addEvent() {
    const eventForm = this.fb.group({
      targetWidget: [null],
      layers: [[]],
      event: [null],
    });
    this.setEventFormListeners(
      eventForm,
      this.automationRuleForm.controls.events.length
    );
    this.automationRuleForm.controls.events.push(eventForm);
  }

  /**
   * Delete event with the given index from the current rule
   *
   * @param eventIndex Event index in the rule form
   */
  deleteEvent(eventIndex: number) {
    this.eventFormListeners[eventIndex]?.unsubscribe();
    this.automationRuleForm.controls.events.removeAt(eventIndex);
  }
}
