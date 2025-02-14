import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from '@oort-front/ui';
import { ActivityLogComponent } from './activity-log.component';
import { ActivityLogGroupByPageComponent } from './activity-log-group-by-page/activity-log-group-by-page.component';
import { ActivityLogGroupByUserComponent } from './activity-log-group-by-user/activity-log-group-by-user.component';
import { ActivityLogListComponent } from './activity-log-list/activity-log-list.component';

/** Module for components related to templates */
@NgModule({
  declarations: [ActivityLogComponent],
  imports: [
    CommonModule,
    TranslateModule,
    TabsModule,
    ActivityLogListComponent,
    ActivityLogGroupByPageComponent,
    ActivityLogGroupByUserComponent,
  ],
  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
