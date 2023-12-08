import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadableCronPipe } from './readable-cron.pipe';

/**
 * Human readable cron module.
 * Pipe to display cron as human readable values.
 */
@NgModule({
  declarations: [ReadableCronPipe],
  imports: [CommonModule],
  exports: [ReadableCronPipe],
})
export class ReadableCronModule {}
