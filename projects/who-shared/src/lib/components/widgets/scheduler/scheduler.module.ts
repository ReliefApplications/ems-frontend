import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoSchedulerComponent } from './scheduler.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';

@NgModule({
  declarations: [WhoSchedulerComponent],
  imports: [
    CommonModule,
    SchedulerModule
  ],
  exports: [WhoSchedulerComponent]
})
export class WhoSchedulerModule { }
