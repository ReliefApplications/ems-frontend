import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DateModule as UIDateModule,
  FormWrapperModule,
  IconModule,
  PaginatorModule,
  TableModule,
  TabsModule,
} from '@oort-front/ui';
import { SkeletonTableModule } from '../skeleton/skeleton-table/public-api';
import { EmptyModule } from '../ui/empty/empty.module';
import { ActivityLogComponent } from './activity-log.component';
import { DateModule } from '../../pipes/date/date.module';
import { ActivityLogGroupByPageComponent } from './activity-log-group-by-page/activity-log-group-by-page.component';
import { ActivityLogGroupByUserComponent } from './activity-log-group-by-user/activity-log-group-by-user.component';
import { ActivityLogListComponent } from './activity-log-list/activity-log-list.component';

/** Module for components related to templates */
@NgModule({
  declarations: [ActivityLogComponent],
  imports: [
    CommonModule,
    TableModule,
    TranslateModule,
    IconModule,
    ButtonModule,
    UIDateModule,
    ReactiveFormsModule,
    FormWrapperModule,
    SkeletonTableModule,
    PaginatorModule,
    EmptyModule,
    DateModule,
    TabsModule,
    ActivityLogListComponent,
    ActivityLogGroupByPageComponent,
    ActivityLogGroupByUserComponent,
  ],
  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
