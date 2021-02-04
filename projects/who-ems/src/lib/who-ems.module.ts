import { NgModule } from '@angular/core';
import { WhoFormModule } from './components/form/form.module';
import { WhoAccessModule } from './components/access/access.module';
import { WhoLayoutModule } from './components/layout/layout.module';
import { WhoFormBuilderModule } from './components/form-builder/form-builder.module';
import { WhoChartModule } from './components/widgets/chart/chart.module';
import { WhoChartSettingsModule } from './components/widgets/chart-settings/chart-settings.module';
import { WhoEditorModule } from './components/widgets/editor/editor.module';
import { WhoEditorSettingsModule } from './components/widgets/editor-settings/editor-settings.module';
import { WhoGridModule } from './components/widgets/grid/grid.module';
import { WhoGridSettingsModule } from './components/widgets/grid-settings/grid-settings.module';
import { WhoMapModule } from './components/widgets/map/map.module';
import { WhoMapSettingsModule } from './components/widgets/map-settings/map-settings.module';
import { WhoSchedulerModule } from './components/widgets/scheduler/scheduler.module';
import { WhoSchedulerSettingsModule } from './components/widgets/scheduler-settings/scheduler-settings.module';
import { WhoWidgetModule } from './components/widget/widget.module';
import { WhoWidgetGridModule } from './components/widget-grid/widget-grid.module';
import { WhoConfirmModalModule } from './components/confirm-modal/confirm-modal.module';
import { WhoUsersModule } from './components/users/users.module';
import { WhoRolesModule } from './components/roles/roles.module';
import { WhoPreviousButtonModule } from './components/previous-button/previous-button.module';
import { WhoConvertModalModule } from './components/convert-modal/convert-modal.module';
import { WhoRecordHistoryModule } from './components/record-history/record-history.module';

@NgModule({
  exports: [
    WhoLayoutModule,
    WhoAccessModule,
    WhoFormModule,
    WhoFormBuilderModule,
    WhoChartModule,
    WhoChartSettingsModule,
    WhoEditorModule,
    WhoEditorSettingsModule,
    WhoGridModule,
    WhoGridSettingsModule,
    WhoMapModule,
    WhoMapSettingsModule,
    WhoSchedulerModule,
    WhoSchedulerSettingsModule,
    WhoWidgetModule,
    WhoWidgetGridModule,
    WhoConfirmModalModule,
    WhoUsersModule,
    WhoRolesModule,
    WhoPreviousButtonModule,
    WhoConvertModalModule,
    WhoRecordHistoryModule
  ]
})
export class WhoEmsModule { }
