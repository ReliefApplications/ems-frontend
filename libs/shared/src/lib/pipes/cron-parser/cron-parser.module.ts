import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CronParserPipe } from './cron-parser.pipe';

/**
 * Pipe to get next iteration dates from cron values.
 */
@NgModule({
  declarations: [CronParserPipe],
  imports: [CommonModule],
  exports: [CronParserPipe],
})
export class CronParserModule {}
