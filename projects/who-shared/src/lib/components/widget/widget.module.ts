import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoWidgetComponent } from './widget.component';
import { WhoChartModule } from '../widgets/chart/public-api';
import { WhoEditorModule } from '../widgets/editor/public-api';
import { WhoGridModule } from '../widgets/grid/public-api';
import { WhoMapModule } from '../widgets/map/map.module';
import { WhoSchedulerModule } from '../widgets/scheduler/public-api';

@NgModule({
  declarations: [WhoWidgetComponent],
  imports: [
    CommonModule,
    WhoChartModule,
    WhoEditorModule,
    WhoGridModule,
    WhoMapModule,
    WhoSchedulerModule
  ],
  exports: [WhoWidgetComponent]
})
export class WhoWidgetModule { }
