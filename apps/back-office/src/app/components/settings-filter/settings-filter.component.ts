import { Component, Input, OnInit } from '@angular/core';
import {
  ApplicationService,
  ContextService,
  Dashboard,
  DashboardService,
  EditDashboardMutationResponse,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { FormWrapperModule, ToggleModule, DialogModule } from '@oort-front/ui';
import { EDIT_DASHBOARD } from '../../dashboard/pages/dashboard/graphql/mutations';
import { Apollo } from 'apollo-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '@oort-front/ui';
/**
 * Filter choices
 */
export enum variantFilterChoices {
  modern = 'modern',
  default = 'default',
}
/**
 * Dashboard settings filter component.
 */
@Component({
  selector: 'app-settings-filter',
  standalone: true,
  templateUrl: './settings-filter.component.html',
  styleUrls: ['./settings-filter.component.scss'],
  imports: [
    ToggleModule,
    DialogModule,
    FormWrapperModule,
    ReactiveFormsModule,
    UiModule,
  ],
})
export class SettingsFilterComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Current dashboard */
  @Input() dashboard?: Dashboard;
  /** Reactive Form */
  public settingsForm!: ReturnType<typeof this.createSettingsForm>;
  /** Show dashboard filter */
  public showFilter!: boolean;

  /**
   *  Settings filter
   *
   * @param applicationService Application service
   * @param apollo Apollo service
   * @param dashboardService Dashboard service
   * @param contextService Context service
   * @param translate Translate service
   * @param fb Form builder
   */
  constructor(
    private applicationService: ApplicationService,
    private apollo: Apollo,
    private dashboardService: DashboardService,
    private contextService: ContextService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    // erase the option to show the filter in the top menu
    this.settingsForm = this.createSettingsForm();

    this.settingsForm?.controls.showFilter.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean | null) => {
        if (typeof value === 'boolean') this.toggleFiltering(value);
      });

    this.settingsForm?.controls.variant.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string | null) => {
        if (typeof value === 'string') this.selectFilterVariant(value);
      });

    this.settingsForm?.controls.closable.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean | null) => {
        if (typeof value === 'boolean') this.toggleClosable(value);
      });
  }

  /**
   * Create the settings form
   *
   * @returns Form group
   */
  private createSettingsForm() {
    return this.fb.group({
      showFilter: this.dashboard?.showFilter ?? true,
      variant: this.dashboard?.filterVariant ?? '',
      closable: this.dashboard?.closable ?? false, // verify what is default on the system
    });
  }

  /**
   * Toggles the filter for the current .
   *
   * @param value Value to activate or deactivate the filter
   */
  toggleFiltering(value: boolean): void {
    if (!this.dashboard) {
      return;
    }
    this.dashboard.showFilter = value;
    if (this.dashboard) {
      this.apollo
        .mutate<EditDashboardMutationResponse>({
          mutation: EDIT_DASHBOARD,
          variables: {
            id: this.dashboard.id,
            showFilter: value,
          },
        })
        .subscribe({
          next: ({ data, errors }) => {
            this.applicationService.handleEditionMutationResponse(
              errors,
              this.translate.instant('common.dashboard.one')
            );
            if (!errors) {
              this.dashboardService.openDashboard({
                ...this.dashboard,
                ...(data && { showFilter: data?.editDashboard.showFilter }),
              });
            }
          },
          complete: () => {
            this.contextService.isFilterEnabled.next(value);
          },
        });
    }
  }

  /**
   * Toggles the filter for the current .
   *
   * @param value Value to activate or deactivate the filter
   */
  selectFilterVariant(value: string): void {
    if (!this.dashboard) {
      return;
    }
    this.dashboard.filterVariant = value;
    if (this.dashboard) {
      this.apollo
        .mutate<EditDashboardMutationResponse>({
          mutation: EDIT_DASHBOARD,
          variables: {
            id: this.dashboard.id,
            filterVariant: value,
          },
        })
        .subscribe({
          next: ({ data, errors }) => {
            this.applicationService.handleEditionMutationResponse(
              errors,
              this.translate.instant('common.dashboard.one')
            );
            if (!errors) {
              this.dashboardService.openDashboard({
                ...this.dashboard,
                ...(data && { showFilter: data?.editDashboard.showFilter }),
              });
            }
          },
        });
    }
  }

  /**
   * Toggles the filter for the current .
   *
   * @param value Value to activate or deactivate the filter
   */
  toggleClosable(value: boolean): void {
    if (!this.dashboard) {
      return;
    }
    this.dashboard.closable = value;
    if (this.dashboard) {
      this.apollo
        .mutate<EditDashboardMutationResponse>({
          mutation: EDIT_DASHBOARD,
          variables: {
            id: this.dashboard.id,
            closable: value,
          },
        })
        .subscribe({
          next: ({ data, errors }) => {
            this.applicationService.handleEditionMutationResponse(
              errors,
              this.translate.instant('common.dashboard.one')
            );
            if (!errors) {
              this.dashboardService.openDashboard({
                ...this.dashboard,
                ...(data && { showFilter: data?.editDashboard.showFilter }),
              });
            }
          },
          complete: () => {
            this.contextService.isFilterEnabled.next(value);
          },
        });
    }
  }
}
