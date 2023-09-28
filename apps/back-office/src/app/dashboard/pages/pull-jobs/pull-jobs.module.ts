import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullJobsRoutingModule } from './pull-jobs-routing.module';
import { PullJobsComponent } from './pull-jobs.component';
import { IconModule, TooltipModule } from '@oort-front/ui';
import {
  SkeletonTableModule,
  CronParserModule,
  DateModule,
  StatusOptionsComponent,
  EmptyModule,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import {
  DividerModule,
  MenuModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
} from '@oort-front/ui';

/** Pull Jobs page module. */
@NgModule({
  declarations: [PullJobsComponent],
  imports: [
    CommonModule,
    PullJobsRoutingModule,
    IconModule,
    MenuModule,
    DividerModule,
    PaginatorModule,
    TranslateModule,
    SkeletonTableModule,
    CronParserModule,
    DateModule,
    ButtonModule,
    TableModule,
    StatusOptionsComponent,
    EmptyModule,
    TooltipModule,
  ],
})
export class PullJobsModule {}
