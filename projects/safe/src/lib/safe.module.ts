import { NgModule } from '@angular/core';
import { SafeFormModule } from './components/form/form.module';
import { SafeAccessModule } from './components/access/access.module';
import { SafeLayoutModule } from './components/layout/layout.module';
import { SafeFormBuilderModule } from './components/form-builder/form-builder.module';
import { SafeChartModule } from './components/widgets/chart/chart.module';
import { SafeChartSettingsModule } from './components/widgets/chart-settings/chart-settings.module';
import { SafeEditorModule } from './components/widgets/editor/editor.module';
import { SafeEditorSettingsModule } from './components/widgets/editor-settings/editor-settings.module';
import { SafeGridModule } from './components/widgets/grid/grid.module';
import { SafeGridSettingsModule } from './components/widgets/grid-settings/grid-settings.module';
import { SafeMapModule } from './components/widgets/map/map.module';
import { SafeMapSettingsModule } from './components/widgets/map-settings/map-settings.module';
import { SafeSchedulerModule } from './components/widgets/scheduler/scheduler.module';
import { SafeSchedulerSettingsModule } from './components/widgets/scheduler-settings/scheduler-settings.module';
import { SafeWidgetModule } from './components/widget/widget.module';
import { SafeWidgetGridModule } from './components/widget-grid/widget-grid.module';
import { SafeConfirmModalModule } from './components/confirm-modal/confirm-modal.module';
import { SafeUsersModule } from './components/users/users.module';
import { SafeRolesModule } from './components/roles/roles.module';
import { SafePreviousButtonModule } from './components/previous-button/previous-button.module';
import { SafeConvertModalModule } from './components/convert-modal/convert-modal.module';
import { SafeRecordHistoryModule } from './components/record-history/record-history.module';
import { SafeRecordModalModule } from './components/record-modal/record-modal.module';
import { SafeStatusModalModule } from './components/status-modal/status-modal.module';
import { SafeProfileModule } from './pages/profile/profile.module';
import { SafeSearchResourceGridModalModule } from './components/search-resource-grid-modal/search-resource-grid-modal.module';
import { SafeButtonModule } from './components/ui/button/button.module';
import { SafeContentChoiceModule } from './components/content-choice/content-choice.module';
import { SafeNewAppButtonModule } from './components/ui/new-app-button/safe-new-app-button.module';
import {MatIconModule} from '@angular/material/icon';

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
        SafeGridModule,
        SafeGridSettingsModule,
        SafeMapModule,
        SafeMapSettingsModule,
        SafeSchedulerModule,
        SafeSchedulerSettingsModule,
        SafeWidgetModule,
        SafeWidgetGridModule,
        SafeConfirmModalModule,
        SafeStatusModalModule,
        SafeUsersModule,
        SafeRolesModule,
        SafePreviousButtonModule,
        SafeConvertModalModule,
        SafeRecordHistoryModule,
        SafeRecordModalModule,
        SafeProfileModule,
        SafeSearchResourceGridModalModule,
        SafeButtonModule,
        SafeContentChoiceModule,
        SafeNewAppButtonModule
    ],
    imports: [
        MatIconModule
    ],
})
export class SafeModule { }
