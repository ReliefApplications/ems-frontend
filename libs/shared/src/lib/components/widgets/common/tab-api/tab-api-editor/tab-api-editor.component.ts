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
import { takeUntil } from 'rxjs';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';

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
    id: [this.data?.name ?? null],
    targetWidget: [this.data?.targetWidget ?? null],
    event: [this.data?.event ?? null],
  });

  /** Current dashboard widgets */
  widgets: any[] = [];
  /** Selected widget map available layers */
  widgetLayers: any[] = [];

  /**
   * Channel component, act as modal.
   * Used for both edition and addition of channels.
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   * @param dashboardService DashboardService
   * @param data Injected dialog data
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<TabApiEditorComponent>,
    private dashboardService: DashboardService,
    @Optional()
    @Inject(DIALOG_DATA)
    public data: WidgetAutomation
  ) {
    super();
  }

  ngOnInit(): void {
    this.dashboardService.currentDashboard$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dashboard) => {
        this.widgets = dashboard?.structure ?? [];
      });
    this.automationRuleForm
      .get('targetWidget')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((targetWidget) => {
        this.widgetLayers = targetWidget?.settings?.layers ?? [];
        this.automationRuleForm
          .get('targetWidget')
          ?.setValue(targetWidget?.id ?? null, { emitEvent: false });
        this.automationRuleForm
          .get('event')
          ?.setValue(null, { emitEvent: false });
      });
    this.automationRuleForm
      .get('event')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        this.automationRuleForm
          .get('event')
          ?.setValue(`open-${event}`, { emitEvent: false });
      });
  }
}
