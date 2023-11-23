import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
} from '@oort-front/ui';
import { EDIT_DASHBOARD } from '../../dashboard/pages/dashboard/graphql/mutations';
import { Apollo } from 'apollo-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '@oort-front/ui';
import { valueFromASTUntyped } from 'graphql';

/**
 * Settings filter of dashboards
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
    TooltipModule,
    TranslateModule,
    ButtonModule,
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
  /** On open edit filter modal, listen to structure changes */
  public openEditStructure = false;
  /** Event to parent update dashboard after changes */
  @Output() update = new EventEmitter();

  /**
   *  Settings filter of dashboards
   *
   * @param apollo Apollo service
   * @param dashboardService Dashboard service
   * @param contextService Context service
   * @param translate Translate service
   * @param fb Form builder
   */
  constructor(
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

    if (this.openEditStructure) {
      this.contextService.filterStructure$
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            const filter = {
              ...this.dashboard?.filter,
              structure: valueFromASTUntyped,
            };
            this.dashboardService.openDashboard({
              ...this.dashboard,
              filter,
            });
            this.update.emit(filter);
          }
        });
    }
  }

  /**
   * Create the settings form
   *
   * @returns Form group
   */
  private createSettingsForm() {
    return this.fb.group({
      showFilter: this.dashboard?.filter?.show ?? false,
      variant: [this.dashboard?.filter?.variant || ''],
      closable: this.dashboard?.filter?.closable ?? false, // verify what is default on the system
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
    if (!this.dashboard.filter) {
      this.dashboard.filter = {};
    }
    this.dashboard.filter.show = value;
    if (this.dashboard) {
      this.apollo
        .mutate<EditDashboardMutationResponse>({
          mutation: EDIT_DASHBOARD,
          variables: {
            id: this.dashboard.id,
            filter: { ...this.dashboard.filter, show: value },
          },
        })
        .subscribe({
          next: ({ data, errors }) => {
            this.dashboardService.handleEditionMutationResponse(
              errors,
              this.translate.instant('common.dashboard.one')
            );
            if (!errors) {
              const filter = {
                ...this.dashboard?.filter,
                show: data?.editDashboard.filter?.show,
              };
              this.dashboardService.openDashboard({
                ...this.dashboard,
                ...(data && { filter }),
              });
              this.update.emit(filter);
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
    if (!this.dashboard.filter) {
      this.dashboard.filter = {};
    }
    this.dashboard.filter.variant = value;
    if (this.dashboard) {
      this.apollo
        .mutate<EditDashboardMutationResponse>({
          mutation: EDIT_DASHBOARD,
          variables: {
            id: this.dashboard.id,
            filter: { ...this.dashboard.filter, variant: value },
          },
        })
        .subscribe({
          next: ({ data, errors }) => {
            this.dashboardService.handleEditionMutationResponse(
              errors,
              this.translate.instant('common.dashboard.one')
            );
            if (!errors) {
              const filter = {
                ...this.dashboard?.filter,
                variant: data?.editDashboard.filter?.variant,
              };
              this.dashboardService.openDashboard({
                ...this.dashboard,
                ...(data && { filter }),
              });
              this.update.emit(filter);
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
    if (!this.dashboard.filter) {
      this.dashboard.filter = {};
    }
    this.dashboard.filter.closable = value;
    if (this.dashboard) {
      this.apollo
        .mutate<EditDashboardMutationResponse>({
          mutation: EDIT_DASHBOARD,
          variables: {
            id: this.dashboard.id,
            filter: { ...this.dashboard.filter, closable: value },
          },
        })
        .subscribe({
          next: ({ data, errors }) => {
            this.dashboardService.handleEditionMutationResponse(
              errors,
              this.translate.instant('common.dashboard.one')
            );
            if (!errors) {
              const filter = {
                ...this.dashboard?.filter,
                closable: data?.editDashboard.filter?.closable,
              };
              this.dashboardService.openDashboard({
                ...this.dashboard,
                ...(data && { filter }),
              });
              this.update.emit(filter);
            }
          },
        });
    }
  }
}
