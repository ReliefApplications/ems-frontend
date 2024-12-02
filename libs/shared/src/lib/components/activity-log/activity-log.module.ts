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
} from '@oort-front/ui';
import { SkeletonTableModule } from '../skeleton/skeleton-table/public-api';
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
    ReactiveFormsModule,
    FormWrapperModule,
    DateModule,
    SkeletonTableModule,
    PaginatorModule,
  ],
  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
