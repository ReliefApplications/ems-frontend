import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DateModule,
  FormWrapperModule,
  IconModule,
  PaginatorModule,
  TableModule,
  TabsModule,
} from '@oort-front/ui';
import { SkeletonTableModule } from '../skeleton/skeleton-table/public-api';
import { EmptyModule } from '../ui/empty/empty.module';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { ActivitiesComponent } from './activities.component';

/** Module for components related to templates */
@NgModule({
  declarations: [ActivityLogComponent, ActivitiesComponent],
  imports: [
    CommonModule,
    TableModule,
    TranslateModule,
    IconModule,
    ButtonModule,
    ReactiveFormsModule,
    FormWrapperModule,
    DateModule,
    SkeletonTableModule,
    PaginatorModule,
    EmptyModule,
    TabsModule,
  ],
  exports: [ActivityLogComponent, ActivitiesComponent],
})
export class ActivityModule {}
