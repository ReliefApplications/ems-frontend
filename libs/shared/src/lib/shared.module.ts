import { NgModule } from '@angular/core';
import { FormModule } from './components/form/form.module';
import { AccessModule } from './components/access/access.module';
import { LayoutModule } from './components/layout/layout.module';
import { FormBuilderModule } from './components/form-builder/form-builder.module';
import { ChartSettingsModule } from './components/widgets/chart-settings/chart-settings.module';
import { EditorSettingsModule } from './components/widgets/editor-settings/editor-settings.module';
import { GridSettingsModule } from './components/widgets/grid-settings/grid-settings.module';
import { MapSettingsModule } from './components/widgets/map-settings/map-settings.module';
import { WidgetGridModule } from './components/widget-grid/widget-grid.module';
import { UsersModule } from './components/users/users.module';
import { RolesModule } from './components/roles/roles.module';
import { RecordHistoryModule } from './components/record-history/record-history.module';
import { ContentChoiceModule } from './components/content-choice/content-choice.module';
import { WorkflowStepperModule } from './components/workflow-stepper/workflow-stepper.module';
import { ApplicationsSummaryModule } from './components/applications-summary/applications-summary.module';
import { SearchMenuModule } from './components/search-menu/search-menu.module';
import { AggregationBuilderModule } from './components/ui/aggregation-builder/aggregation-builder.module';
import { TagboxModule } from './components/ui/tagbox/tagbox.module';
import { SnackbarSpinnerModule } from './components/snackbar-spinner/snackbar-spinner.module';
import { SkeletonTableModule } from './components/skeleton/skeleton-table/skeleton-table.module';
import { SkeletonModule } from './directives/skeleton/skeleton.module';
import { UserSummaryModule } from './components/user-summary/user-summary.module';
import { DateModule } from './pipes/date/date.module';
import { SummaryCardSettingsModule } from './components/widgets/summary-card-settings/summary-card-settings.module';
import { RoleSummaryModule } from './components/role-summary/role-summary.module';
import { EmptyModule } from './components/ui/empty/empty.module';
import { NavbarModule } from './components/navbar/navbar.module';
import { ReadableCronModule } from './pipes/readable-cron/readable-cron.module';
import { CronParserModule } from './pipes/cron-parser/cron-parser.module';
import { UnsubscribeModule } from './components/utils/unsubscribe/unsubscribe.module';
import { ViewsModule } from './views/views.module';
import { EditableTextModule } from './components/editable-text/editable-text.module';
import { CronExpressionControlModule } from './components/cron-expression-control/cron-expression-control.module';
import { MapModule } from './components/ui/map';
import { FullScreenModule } from './directives/fullscreen/fullscreen.module';
import { DashboardFilterModule } from './components/dashboard-filter/dashboard-filter.module';
import { ButtonActionModule } from './components/button-action/button-action.module';
import { GraphQLSelectModule } from '@oort-front/ui';
import { SortingSettingsModule } from './components/widgets/common/sorting-settings/sorting-settings.module';
import { WidgetChoiceModule } from './components/widget-choice/widget-choice.module';
import { TabsSettingsModule } from './components/widgets/tabs-settings/tabs-settings.module';

/** Main module for the shared project */
@NgModule({
  exports: [
    LayoutModule,
    AccessModule,
    FormModule,
    FormBuilderModule,
    ChartSettingsModule,
    EditorSettingsModule,
    GridSettingsModule,
    MapSettingsModule,
    WidgetGridModule,
    SortingSettingsModule,
    UsersModule,
    RolesModule,
    RecordHistoryModule,
    ContentChoiceModule,
    WorkflowStepperModule,
    ApplicationsSummaryModule,
    SearchMenuModule,
    AggregationBuilderModule,
    TagboxModule,
    SnackbarSpinnerModule,
    SkeletonTableModule,
    UserSummaryModule,
    EditableTextModule,
    CronExpressionControlModule,
    MapModule,
    DashboardFilterModule,
    ButtonActionModule,
    WidgetChoiceModule,
    TabsSettingsModule,
    // === Pipes ===
    DateModule,
    ReadableCronModule,
    CronParserModule,
    SummaryCardSettingsModule,
    RoleSummaryModule,
    GraphQLSelectModule,
    EmptyModule,
    NavbarModule,
    // === Directives
    SkeletonModule,
    FullScreenModule,
    // === UTILS COMPONENTS ===
    UnsubscribeModule,
    // === VIEWS ===
    ViewsModule,
  ],
  declarations: [],
  imports: [],
})
export class Module {}
