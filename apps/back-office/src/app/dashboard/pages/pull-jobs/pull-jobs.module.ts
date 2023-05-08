import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullJobsRoutingModule } from './pull-jobs-routing.module';
import { PullJobsComponent } from './pull-jobs.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import {
  SafeButtonModule,
  SafeSkeletonTableModule,
  SafeIconModule,
  SafeCronParserModule,
  SafeDateModule,
} from '@oort-front/safe';
import { DividerModule } from '@oort-front/ui';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

/** Pull Jobs page module. */
@NgModule({
  declarations: [PullJobsComponent],
  imports: [
    CommonModule,
    PullJobsRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    DividerModule,
    SafeButtonModule,
    MatPaginatorModule,
    TranslateModule,
    MatChipsModule,
    SafeSkeletonTableModule,
    SafeIconModule,
    SafeCronParserModule,
    SafeDateModule,
  ],
})
export class PullJobsModule {}
