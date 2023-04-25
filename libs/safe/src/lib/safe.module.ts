import { NgModule } from '@angular/core';
import { SafeFormModule } from './components/form/form.module';
import { SafeAccessModule } from './components/access/access.module';
import { SafeLayoutModule } from './components/layout/layout.module';
import { SafeFormBuilderModule } from './components/form-builder/form-builder.module';
import { SafeChartSettingsModule } from './components/widgets/chart-settings/chart-settings.module';
import { SafeEditorSettingsModule } from './components/widgets/editor-settings/editor-settings.module';
import { SafeGridSettingsModule } from './components/widgets/grid-settings/grid-settings.module';
import { SafeMapSettingsModule } from './components/widgets/map-settings/map-settings.module';
import { SafeWidgetGridModule } from './components/widget-grid/widget-grid.module';
import { SafeUsersModule } from './components/users/users.module';
import { SafeRolesModule } from './components/roles/roles.module';
import { SafeRecordHistoryModule } from './components/record-history/record-history.module';
import { SafeButtonModule } from './components/ui/button/button.module';
import { SafeContentChoiceModule } from './components/content-choice/content-choice.module';
import { SafeWorkflowStepperModule } from './components/workflow-stepper/workflow-stepper.module';
import { SafeApplicationsSummaryModule } from './components/applications-summary/applications-summary.module';
import { SafeSearchMenuModule } from './components/search-menu/search-menu.module';
import { SafeAggregationBuilderModule } from './components/ui/aggregation-builder/aggregation-builder.module';
import { SafeTagboxModule } from './components/ui/tagbox/tagbox.module';
import { SafeSnackbarSpinnerModule } from './components/snackbar-spinner/snackbar-spinner.module';
import { SafeSkeletonTableModule } from './components/skeleton/skeleton-table/skeleton-table.module';
import { SafeSkeletonModule } from './directives/skeleton/skeleton.module';
import { SafeUserSummaryModule } from './components/user-summary/user-summary.module';
import { SafeDateModule } from './pipes/date/date.module';
import { SafeIconModule } from './components/ui/icon/icon.module';
import { SafeSummaryCardSettingsModule } from './components/widgets/summary-card-settings/summary-card-settings.module';
import { SafeRoleSummaryModule } from './components/role-summary/role-summary.module';
import { SafeGraphQLSelectModule } from './components/graphql-select/graphql-select.module';
import { SafeModalModule } from './components/ui/modal/modal.module';
import { SafeEmptyModule } from './components/ui/empty/empty.module';
import { SafeDividerModule } from './components/ui/divider/divider.module';
import { SafeLeftSidenavModule } from './components/left-sidenav/left-sidenav.module';
import { SafeReadableCronModule } from './pipes/readable-cron/readable-cron.module';
import { SafeCronParserModule } from './pipes/cron-parser/cron-parser.module';
import { SafeUnsubscribeModule } from './components/utils/unsubscribe/unsubscribe.module';
import { SafeViewsModule } from './views/views.module';
import { SafeEditableTextModule } from './components/editable-text/editable-text.module';
import { CronExpressionControlModule } from './components/cron-expression-control/cron-expression-control.module';
import { FullScreenModule } from './directives/fullscreen/fullscreen.module';
import { DashboardFilterModule } from './components/dashboard-filter/dashboard-filter.module';

/** Main module for the safe project */
@NgModule({
  exports: [
    SafeLayoutModule,
    SafeAccessModule,
    SafeFormModule,
    SafeFormBuilderModule,
    SafeChartSettingsModule,
    SafeEditorSettingsModule,
    SafeGridSettingsModule,
    SafeMapSettingsModule,
    SafeWidgetGridModule,
    SafeUsersModule,
    SafeRolesModule,
    SafeRecordHistoryModule,
    SafeButtonModule,
    SafeContentChoiceModule,
    SafeWorkflowStepperModule,
    SafeApplicationsSummaryModule,
    SafeSearchMenuModule,
    SafeAggregationBuilderModule,
    SafeTagboxModule,
    SafeSnackbarSpinnerModule,
    SafeSkeletonTableModule,
    SafeUserSummaryModule,
    SafeEditableTextModule,
    CronExpressionControlModule,
    DashboardFilterModule,
    // === Pipes ===
    SafeDateModule,
    SafeReadableCronModule,
    SafeCronParserModule,
    SafeIconModule,
    SafeSummaryCardSettingsModule,
    SafeRoleSummaryModule,
    SafeGraphQLSelectModule,
    SafeModalModule,
    SafeEmptyModule,
    SafeDividerModule,
    SafeLeftSidenavModule,
    // === Directives
    SafeSkeletonModule,
    FullScreenModule,
    // === UTILS COMPONENTS ===
    SafeUnsubscribeModule,
    // === VIEWS ===
    SafeViewsModule,
  ],
})
export class SafeModule {}
