import { NgModule } from '@angular/core';
import { SafeFormModule } from './components/form/form.module';
import { SafeAccessModule } from './components/access/access.module';
import { SafeLayoutModule } from './components/layout/layout.module';
import { SafeFormBuilderModule } from './components/form-builder/form-builder.module';
import { SafeChartModule } from './components/widgets/chart/chart.module';
import { SafeChartSettingsModule } from './components/widgets/chart-settings/chart-settings.module';
import { SafeEditorModule } from './components/widgets/editor/editor.module';
import { SafeEditorSettingsModule } from './components/widgets/editor-settings/editor-settings.module';
import { SafeGridWidgetModule } from './components/widgets/grid/grid.module';
import { SafeGridSettingsModule } from './components/widgets/grid-settings/grid-settings.module';
import { SafeMapModule } from './components/widgets/map/map.module';
import { SafeMapSettingsModule } from './components/widgets/map-settings/map-settings.module';
import { SafeSchedulerModule } from './components/widgets/scheduler/scheduler.module';
import { SafeSchedulerSettingsModule } from './components/widgets/scheduler-settings/scheduler-settings.module';
import { SafeWidgetModule } from './components/widget/widget.module';
import { SafeWidgetGridModule } from './components/widget-grid/widget-grid.module';
import { SafeUsersModule } from './components/users/users.module';
import { SafeRolesModule } from './components/roles/roles.module';
import { SafeConvertModalModule } from './components/convert-modal/convert-modal.module';
import { SafeRecordHistoryModule } from './components/record-history/record-history.module';
import { SafeRecordModalModule } from './components/record-modal/record-modal.module';
import { SafeStatusModalModule } from './components/status-modal/status-modal.module';
import { SafeProfileModule } from './pages/profile/profile.module';
import { SafeSearchResourceGridModalModule } from './components/search-resource-grid-modal/search-resource-grid-modal.module';
import { SafeButtonModule } from './components/ui/button/button.module';
import { SafeContentChoiceModule } from './components/content-choice/content-choice.module';
import { SafeWorkflowStepperModule } from './components/workflow-stepper/workflow-stepper.module';
import { SafeApplicationsSummaryModule } from './components/applications-summary/applications-summary.module';
import { SafeSearchMenuModule } from './components/search-menu/search-menu.module';
import { SafeAggregationBuilderModule } from './components/ui/aggregation-builder/aggregation-builder.module';
import { SafeTagboxModule } from './components/ui/tagbox/tagbox.module';
import { SafeEditLayoutModalModule } from './components/grid-layout/edit-layout-modal/edit-layout-modal.module';
import { SafeSnackbarSpinnerModule } from './components/snackbar-spinner/snackbar-spinner.module';
import { SafeSkeletonTableModule } from './components/skeleton/skeleton-table/skeleton-table.module';
import { SafeSkeletonModule } from './directives/skeleton/skeleton.module';
import { SafeUserSummaryModule } from './components/user-summary/user-summary.module';
import { SafeDateModule } from './pipes/date/date.module';
import { SafeIconModule } from './components/ui/icon/icon.module';
import { SafeRoleSummaryModule } from './components/role-summary/role-summary.module';
import { SafeGraphQLSelectModule } from './components/graphql-select/graphql-select.module';
import { SafeModalModule } from './components/ui/modal/modal.module';
import { SafeEmptyModule } from './components/ui/empty/empty.module';
import { SafeDividerModule } from './components/ui/divider/divider.module';
import { SafeLeftSidenavModule } from './components/left-sidenav/left-sidenav.module';
import { SafeApplicationTemplatesModule } from './pages/application-templates/application-templates.module';
import { SafeApplicationDistributionListsModule } from './pages/application-distribution-lists/application-distribution-lists.module';
import { SafeReadableCronModule } from './pipes/readable-cron/readable-cron.module';
import { SafeCronParserModule } from './pipes/cron-parser/cron-parser.module';
import { SafeUnsubscribeModule } from './components/utils/unsubscribe/unsubscribe.module';

/** Main module for the safe project */
@NgModule({
  exports: [
    SafeLayoutModule,
    SafeAccessModule,
    SafeFormModule,
    SafeFormBuilderModule,
    SafeChartModule,
    SafeChartSettingsModule,
    SafeEditorModule,
    SafeEditorSettingsModule,
    SafeGridWidgetModule,
    SafeGridSettingsModule,
    SafeMapModule,
    SafeMapSettingsModule,
    SafeSchedulerModule,
    SafeSchedulerSettingsModule,
    SafeWidgetModule,
    SafeWidgetGridModule,
    SafeStatusModalModule,
    SafeUsersModule,
    SafeRolesModule,
    SafeConvertModalModule,
    SafeRecordHistoryModule,
    SafeRecordModalModule,
    SafeProfileModule,
    SafeSearchResourceGridModalModule,
    SafeButtonModule,
    SafeContentChoiceModule,
    SafeWorkflowStepperModule,
    SafeApplicationsSummaryModule,
    SafeSearchMenuModule,
    SafeAggregationBuilderModule,
    SafeTagboxModule,
    SafeEditLayoutModalModule,
    SafeSnackbarSpinnerModule,
    SafeSkeletonTableModule,
    SafeSkeletonModule,
    SafeUserSummaryModule,
    // === Pipes ===
    SafeDateModule,
    SafeReadableCronModule,
    SafeCronParserModule,
    SafeIconModule,
    SafeRoleSummaryModule,
    SafeGraphQLSelectModule,
    SafeModalModule,
    SafeEmptyModule,
    SafeDividerModule,
    SafeLeftSidenavModule,
    SafeApplicationTemplatesModule,
    SafeApplicationDistributionListsModule,
    // === UTILS COMPONENTS ===
    SafeUnsubscribeModule,
  ],
})
export class SafeModule {}
