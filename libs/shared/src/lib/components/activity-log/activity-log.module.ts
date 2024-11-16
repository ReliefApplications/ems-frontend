import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLogComponent } from './activity-log.component';

/** Module for components related to templates */
@NgModule({
  declarations: [ActivityLogComponent],
  imports: [CommonModule],
  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
