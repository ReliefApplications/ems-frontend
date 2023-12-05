import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetComponent } from './widget.component';
import { ChartModule } from '../widgets/chart/chart.module';
import { EditorModule } from '../widgets/editor/editor.module';
import { GridWidgetModule } from '../widgets/grid/grid.module';
import { SummaryCardModule } from '../widgets/summary-card/summary-card.module';
import { MapWidgetModule } from '../widgets/map/map.module';
import { TabsModule } from '../widgets/tabs/tabs.module';
import 'hammerjs';
import { IconModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Main Widget Module.
 * Appear in Dashboard Module.
 * Depending on the type of widget, a different component is loaded.
 */
@NgModule({
  declarations: [WidgetComponent],
  imports: [
    CommonModule,
    // UI elements
    IconModule,
    // Widgets
    ChartModule,
    EditorModule,
    GridWidgetModule,
    MapWidgetModule,
    SummaryCardModule,
    TabsModule,
    TooltipModule,
    TranslateModule,
  ],
  exports: [WidgetComponent],
})
export class WidgetModule {}
