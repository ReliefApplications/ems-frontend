import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetComponent } from './widget.component';
import { SafeChartModule } from '../widgets/chart/public-api';
import { SafeEditorModule } from '../widgets/editor/public-api';
import { SafeGridModule } from '../widgets/grid/public-api';
import { SafeMapModule } from '../widgets/map/map.module';
import { SafeSchedulerModule } from '../widgets/scheduler/public-api';
import 'hammerjs';

@NgModule({
  declarations: [SafeWidgetComponent],
  imports: [
    CommonModule,
    SafeChartModule,
    SafeEditorModule,
    SafeGridModule,
    SafeMapModule,
    SafeSchedulerModule
  ],
  exports: [SafeWidgetComponent]
})
export class SafeWidgetModule { }
