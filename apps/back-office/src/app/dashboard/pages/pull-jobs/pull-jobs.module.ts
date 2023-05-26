import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullJobsRoutingModule } from './pull-jobs-routing.module';
import { PullJobsComponent } from './pull-jobs.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import {
  SafeSkeletonTableModule,
  SafeIconModule,
  SafeCronParserModule,
  SafeDateModule,
} from '@oort-front/safe';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import {
  DividerModule,
  MenuModule,
  ButtonModule,
  TableModule,
  ChipModule,
} from '@oort-front/ui';

/** Pull Jobs page module. */
@NgModule({
  declarations: [PullJobsComponent],
  imports: [
    CommonModule,
    PullJobsRoutingModule,
    MatButtonModule,
    MatIconModule,
    MenuModule,
    DividerModule,
    MatPaginatorModule,
    TranslateModule,
    SafeSkeletonTableModule,
    SafeIconModule,
    SafeCronParserModule,
    SafeDateModule,
    ButtonModule,
    TableModule,
    ChipModule,
  ],
})
export class PullJobsModule {}
