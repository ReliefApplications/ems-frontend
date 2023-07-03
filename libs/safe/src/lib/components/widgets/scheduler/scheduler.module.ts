import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSchedulerComponent } from './scheduler.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { TranslateModule } from '@ngx-translate/core';

/** Module for scheduler  component */
@NgModule({
  declarations: [SafeSchedulerComponent],
  imports: [CommonModule, SchedulerModule, TranslateModule],
  exports: [SafeSchedulerComponent],
})
export class SafeSchedulerModule {}
