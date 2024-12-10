import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  PaginatorModule,
  TableModule,
  DateModule as UIDateModule,
} from '@oort-front/ui';
import { DateModule } from '../../pipes/date/date.module';
import { SkeletonTableModule } from '../skeleton/skeleton-table/public-api';
import { EmptyModule } from '../ui/empty/empty.module';
import { ActivityLogComponent } from './activity-log.component';

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
    RouterModule,
  ],
  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
