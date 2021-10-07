import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSchedulerComponent } from './scheduler.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [SafeSchedulerComponent],
    imports: [
        CommonModule,
        SchedulerModule,
        MatTooltipModule
    ],
  exports: [SafeSchedulerComponent]
})
export class SafeSchedulerModule { }
