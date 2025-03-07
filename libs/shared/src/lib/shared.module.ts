import { NgModule } from '@angular/core';
import { FormModule } from './components/form/form.module';
import { AccessModule } from './components/access/access.module';
import { LayoutModule } from './components/layout/layout.module';
import { FormBuilderModule } from './components/form-builder/form-builder.module';
import { WidgetGridModule } from './components/widget-grid/widget-grid.module';
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
import { RoleSummaryModule } from './components/role-summary/role-summary.module';
import { EmptyModule } from './components/ui/empty/empty.module';
import { NavbarModule } from './components/navbar/navbar.module';
import { ReadableCronModule } from './pipes/readable-cron/readable-cron.module';
import { CronParserModule } from './pipes/cron-parser/cron-parser.module';
import { UnsubscribeModule } from './components/utils/unsubscribe/unsubscribe.module';
import { ViewsModule } from './views/views.module';
import { EditableTextModule } from './components/editable-text/editable-text.module';
import { CronExpressionControlModule } from './components/controls/cron-expression-control/cron-expression-control.module';
import { MapModule } from './components/ui/map';
import { FullScreenModule } from './directives/fullscreen/fullscreen.module';
import { DashboardFilterModule } from './components/dashboard-filter/dashboard-filter.module';
import { GraphQLSelectModule } from '@oort-front/ui';
import { SortingSettingsModule } from './components/widgets/common/sorting-settings/sorting-settings.module';
import { WidgetChoiceModule } from './components/widget-choice/widget-choice.module';
import { ApplicationsArchiveModule } from './components/applications-archive/applications-archive.module';
import { ReferenceDataDropdownModule } from './survey/components/reference-data-dropdown/reference-data-dropdown.module';
import { ListFilterComponent } from './components/list-filter/list-filter.component';
import { StatusOptionsComponent } from './components/status-options/status-options.component';
import { DashboardFilterIconComponent } from './components/dashboard-filter-icon/dashboard-filter-icon.component';

/** Main module for the shared project */
@NgModule({
  exports: [
    LayoutModule,
    AccessModule,
    FormModule,
    FormBuilderModule,
    WidgetGridModule,
    SortingSettingsModule,
    RolesModule,
    RecordHistoryModule,
    ContentChoiceModule,
    WorkflowStepperModule,
    ApplicationsSummaryModule,
    SearchMenuModule,
    AggregationBuilderModule,
    TagboxModule,
    SnackbarSpinnerModule,
    ApplicationsArchiveModule,
    SkeletonTableModule,
    UserSummaryModule,
    EditableTextModule,
    ListFilterComponent,
    CronExpressionControlModule,
    MapModule,
    DashboardFilterModule,
    DashboardFilterIconComponent,
    WidgetChoiceModule,
    ReferenceDataDropdownModule,
    StatusOptionsComponent,
    // === Pipes ===
    DateModule,
    ReadableCronModule,
    CronParserModule,
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
  imports: [
    ListFilterComponent,
    StatusOptionsComponent,
    DashboardFilterIconComponent,
  ],
})
export class Module {}
