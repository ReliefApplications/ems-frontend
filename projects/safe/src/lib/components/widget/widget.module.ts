import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetComponent } from './widget.component';
import { SafeChartModule } from '../widgets/chart/chart.module';
import { SafeEditorModule } from '../widgets/editor/editor.module';
import { SafeGridWidgetModule } from '../widgets/grid/grid.module';
import { SafeMapModule } from '../widgets/map/map.module';
import { SafeSchedulerModule } from '../widgets/scheduler/scheduler.module';
import { SafeSummaryCardModule } from '../widgets/summary-card/summary-card.module';
import 'hammerjs';

/**
 *
 */
@NgModule({
  declarations: [SafeWidgetComponent],
  imports: [
    CommonModule,
    SafeChartModule,
    SafeEditorModule,
    SafeGridWidgetModule,
    SafeMapModule,
    SafeSchedulerModule,
    SafeSummaryCardModule,
  ],
  exports: [SafeWidgetComponent],
})
export class SafeWidgetModule {}
