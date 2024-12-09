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
} from '@oort-front/ui';
import { SkeletonTableModule } from '../skeleton/skeleton-table/public-api';
import { EmptyModule } from '../ui/empty/empty.module';
import { ActivityLogComponent } from './activity-log.component';
import { DateModule } from '../../pipes/date/date.module';

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
  ],
  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
