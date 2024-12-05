import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLogComponent } from './activity-log.component';
import { ActivityLogRoutingModule } from './activity-log-routing.module';
import { ActivityModule, SkeletonTableModule } from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Workflow module for application preview.
 */
@NgModule({
  declarations: [ActivityLogComponent],
  imports: [
    CommonModule,
    ActivityLogRoutingModule,
    SkeletonTableModule,
    TranslateModule,
    ActivityModule,
  ],
  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
