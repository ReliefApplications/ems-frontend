import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullJobsRoutingModule } from './pull-jobs-routing.module';
import { PullJobsComponent } from './pull-jobs.component';
import { IconModule } from '@oort-front/ui';
import {
  SafeSkeletonTableModule,
  SafeCronParserModule,
  SafeDateModule,
} from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import {
  DividerModule,
  MenuModule,
  ButtonModule,
  TableModule,
  ChipModule,
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
    SafeSkeletonTableModule,
    SafeCronParserModule,
    SafeDateModule,
    ButtonModule,
    TableModule,
    ChipModule,
  ],
})
export class PullJobsModule {}
