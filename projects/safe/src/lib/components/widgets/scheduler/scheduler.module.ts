import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSchedulerComponent } from './scheduler.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { TranslateModule } from '@ngx-translate/core';
import { PDFModule } from '@progress/kendo-angular-scheduler';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonModule } from '@progress/kendo-angular-buttons';

/**
 * Scheduler Widget Module.
 */
@NgModule({
  declarations: [SafeSchedulerComponent],
  imports: [
    CommonModule,
    SchedulerModule,
    TranslateModule,
    PDFModule,
    MatMenuModule,
    ButtonModule
  ],
  exports: [SafeSchedulerComponent],
})
export class SafeSchedulerModule {}
