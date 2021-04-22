import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSchedulerComponent } from './scheduler.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';

@NgModule({
  declarations: [SafeSchedulerComponent],
  imports: [
    CommonModule,
    SchedulerModule
  ],
  exports: [SafeSchedulerComponent]
})
export class SafeSchedulerModule { }
