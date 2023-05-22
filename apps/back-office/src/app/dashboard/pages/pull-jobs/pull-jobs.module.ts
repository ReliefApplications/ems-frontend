import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullJobsRoutingModule } from './pull-jobs-routing.module';
import { PullJobsComponent } from './pull-jobs.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import {
  SafeButtonModule,
  SafeSkeletonTableModule,
  SafeDividerModule,
  SafeCronParserModule,
  SafeDateModule,
} from '@oort-front/safe';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { IconModule } from '@oort-front/ui';

/** Pull Jobs page module. */
@NgModule({
  declarations: [PullJobsComponent],
  imports: [
    CommonModule,
    PullJobsRoutingModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    SafeDividerModule,
    SafeButtonModule,
    MatPaginatorModule,
    TranslateModule,
    MatChipsModule,
    SafeSkeletonTableModule,
    SafeCronParserModule,
    SafeDateModule,
    IconModule,
  ],
})
export class PullJobsModule {}
