import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetComponent } from './widget.component';
import { SafeChartModule } from '../widgets/chart/chart.module';
import { SafeEditorModule } from '../widgets/editor/editor.module';
import { SafeGridWidgetModule } from '../widgets/grid/grid.module';
import { SafeSummaryCardModule } from '../widgets/summary-card/summary-card.module';
import { SafeMapWidgetModule } from '../widgets/map/map.module';
import { TabsModule } from '../widgets/tabs/tabs.module';
import 'hammerjs';

/**
 * Main Widget Module.
 * Appear in Dashboard Module.
 * Depending on the type of widget, a different component is loaded.
 */
@NgModule({
  declarations: [SafeWidgetComponent],
  imports: [
    CommonModule,
    SafeChartModule,
    SafeEditorModule,
    SafeGridWidgetModule,
    SafeMapWidgetModule,
    SafeSummaryCardModule,
    TabsModule,
  ],
  exports: [SafeWidgetComponent],
})
export class SafeWidgetModule {}
