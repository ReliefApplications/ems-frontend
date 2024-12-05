import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLogComponent } from './activity-log.component';
import { ActivityLogRoutingModule } from './activity-log-routing.module';
import { ActivityModule as ApplicationActivityLogModule } from '@oort-front/shared';
import { SkeletonTableModule } from '@oort-front/shared';
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
    ApplicationActivityLogModule,
  ],
  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
