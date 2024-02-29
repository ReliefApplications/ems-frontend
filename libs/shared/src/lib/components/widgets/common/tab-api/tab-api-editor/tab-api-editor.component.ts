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
  AutomationEvents,
  WidgetAutomationEvent,
  WidgetAutomationRule,
} from '../../../../../models/automation.model';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { of, switchMap, takeUntil, tap } from 'rxjs';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { MapLayersService } from '../../../../../services/map/map-layers.service';
import { TranslateService } from '@ngx-translate/core';

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
        subItems: [[]],
        event: [null],
      }),
    ]),
  });

  /** Current dashboard widgets */
  widgets: any[] = [];
  /** Selected widget map available layers */
  widgetOptions: Array<{ id: string; name: string }[]> = [];
  /** Available events automation */
  private availableEvents = [
    {
      value: 'expand',
      text: this.translate.instant(
        'models.widget.automation.eventTypes.expand'
      ),
    },
    {
      value: 'collapse',
      text: this.translate.instant(
        'models.widget.automation.eventTypes.collapse'
      ),
    },
    {
      value: 'open',
      text: this.translate.instant('models.widget.automation.eventTypes.open'),
    },
    {
      value: 'show',
      text: this.translate.instant('models.widget.automation.eventTypes.show'),
    },
    {
      value: 'hide',
      text: this.translate.instant('models.widget.automation.eventTypes.hide'),
    },
  ];
  /** Events available for the current selected widget */
  currentEventsToSelect: Array<{ value: AutomationEvents; text: string }[]> =
    [];
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
   * @param translate Translate service
   * @param data Injected dialog data
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<TabApiEditorComponent>,
    private dashboardService: DashboardService,
    private mapLayersService: MapLayersService,
    private translate: TranslateService,
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
            subItems: [event?.subItems ?? []],
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
          .subscribe((layers) => (this.widgetOptions[index] = layers));
      } else if (selectedWidget.component == 'tabs') {
        this.widgetOptions[index] = selectedWidget.settings.tabs.map(
          (tab: any) => {
            return { id: tab.label, name: tab.label };
          }
        );
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
          if (this.selectedWidgets[index].component !== 'tabs') {
            if (this.selectedWidgets[index].component === 'map') {
              this.currentEventsToSelect[index] = this.availableEvents.filter(
                (event) => event.value !== 'open'
              );
            } else {
              this.currentEventsToSelect[index] = this.availableEvents.filter(
                (event) =>
                  event.value !== 'show' &&
                  event.value !== 'hide' &&
                  event.value !== 'open'
              );
            }
          } else {
            this.currentEventsToSelect[index] = this.availableEvents;
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
          } else if (this.selectedWidgets[eventIndex]?.component === 'tabs') {
            return of(
              this.selectedWidgets[eventIndex].settings.tabs.map((tab: any) => {
                return { id: tab.label, name: tab.label };
              })
            );
          } else {
            return of([]);
          }
        }),
        tap((subItems) => (this.widgetOptions[eventIndex] = subItems)),
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
      subItems: [[]],
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
