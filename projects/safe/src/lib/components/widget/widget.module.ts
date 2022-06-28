import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetComponent } from './widget.component';
import { SafeChartModule } from '../widgets/chart/chart.module';
import { SafeEditorModule } from '../widgets/editor/editor.module';
import { SafeGridWidgetModule } from '../widgets/grid/grid.module';
import { SafeMapModule } from '../widgets/map/map.module';
import { SafeSchedulerModule } from '../widgets/scheduler/scheduler.module';
import 'hammerjs';

/** Module for the widget component */
@NgModule({
  declarations: [SafeWidgetComponent],
  imports: [
    CommonModule,
    SafeChartModule,
    SafeEditorModule,
    SafeGridWidgetModule,
    SafeMapModule,
    SafeSchedulerModule,
  ],
  exports: [SafeWidgetComponent],
})
export class SafeWidgetModule {}
