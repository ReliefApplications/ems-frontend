import { Component, Input, OnInit, Optional } from '@angular/core';
import {
  ContextService,
  Dashboard,
  DashboardService,
  EditDashboardMutationResponse,
  UnsubscribeComponent,
} from '@oort-front/shared';
import {
  FormWrapperModule,
  ToggleModule,
  DialogModule,
  TooltipModule,
  ButtonModule,
  IconModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { EDIT_DASHBOARD } from '../../dashboard/pages/dashboard/graphql/mutations';
import { Apollo } from 'apollo-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '@oort-front/ui';
import get from 'lodash/get';
import { ViewSettingsModalComponent } from '../view-settings-modal/view-settings-modal.component';
import { CommonModule } from '@angular/common';

/**
 * Settings filter of dashboards
 */
@Component({
  selector: 'app-dashboard-filter-settings',
  standalone: true,
  templateUrl: './dashboard-filter-settings.component.html',
  styleUrls: ['./dashboard-filter-settings.component.scss'],
  imports: [
    CommonModule,
    ToggleModule,
    DialogModule,
    FormWrapperModule,
    ReactiveFormsModule,
    UiModule,
    TooltipModule,
    TranslateModule,
    ButtonModule,
    IconModule,
    SelectMenuModule,
  ],
})
export class DashboardFilterSettingsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Current dashboard */
  @Input() dashboard!: Dashboard;
  /** Reactive Form */
  public formGroup!: ReturnType<typeof this.createSettingsForm>;
  /** On open edit filter modal, listen to structure changes */
  public openEditStructure = false;
  /** Available positions */
  public positions = ['top', 'right', 'bottom', 'left'];

  /**
   *  Settings filter of dashboards
   *
   * @param parentComponent Parent view settings modal component
   * @param apollo Apollo service
   * @param dashboardService Dashboard service
   * @param contextService Context service
   * @param translate Translate service
   * @param fb Form builder
   */
  constructor(
    @Optional() private parentComponent: ViewSettingsModalComponent,
    private apollo: Apollo,
    private dashboardService: DashboardService,
    public contextService: ContextService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    // erase the option to show the filter in the top menu
    this.formGroup = this.createSettingsForm();

    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onEdit(value);
      });

    this.contextService.filterStructure$.subscribe((value) => {
      this.formGroup.controls.structure.setValue(value, { emitEvent: false });
    });
  }

  /**
   * Call context service onEditFilter method.
   */
  public onEditStructure() {
    this.contextService.onEditFilter();
  }

  /**
   * Create the settings form
   *
   * @returns Form group
   */
  private createSettingsForm() {
    return this.fb.group({
      show: get(this.dashboard, 'filter.show', false),
      variant: get(this.dashboard, 'filter.variant', 'modern'),
      closable: get(this.dashboard, 'filter.closable', false),
      structure: get(this.dashboard, 'filter.structure'),
      position: get(this.dashboard, 'filter.position', 'bottom'),
    });
  }

  /**
   * Toggles the filter for the current dashboard.
   *
   * @param value Value to activate or deactivate the filter
   */
  onEdit(value: any): void {
    console.log(value.structure);
    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id: this.dashboard.id,
          filter: {
            ...this.dashboard.filter,
            ...value,
          },
        },
      })
      .subscribe({
        next: ({ errors }) => {
          console.log(this.parentComponent);
          this.dashboardService.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.dashboard.one')
          );
          if (!errors) {
            const filter = value;
            this.dashboard = {
              ...this.dashboard,
              filter,
            };
            // Updates parent component
            const updates = { filter };
            this.parentComponent.onUpdate.emit(updates);
          }
        },
        complete: () => {
          this.contextService.isFilterEnabled.next(value.show);
        },
      });
  }
}
