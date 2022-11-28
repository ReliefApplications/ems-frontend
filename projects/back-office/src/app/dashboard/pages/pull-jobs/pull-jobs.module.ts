import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullJobsRoutingModule } from './pull-jobs-routing.module';
import { PullJobsComponent } from './pull-jobs.component';
import { PullJobModalComponent } from './components/pull-job-modal/pull-job-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import {
  SafeButtonModule,
  SafeSkeletonTableModule,
  SafeIconModule,
  SafeGraphQLSelectModule,
  SafeModalModule,
  SafeDividerModule,
  SafeReadableCronModule,
  SafeAlertModule,
} from '@safe/builder';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

/** Pull Jobs page module. */
@NgModule({
  declarations: [PullJobsComponent, PullJobModalComponent],
  imports: [
    CommonModule,
    PullJobsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatExpansionModule,
    SafeDividerModule,
    SafeButtonModule,
    MatPaginatorModule,
    TranslateModule,
    MatChipsModule,
    SafeSkeletonTableModule,
    SafeIconModule,
    SafeGraphQLSelectModule,
    SafeModalModule,
    SafeReadableCronModule,
    SafeAlertModule,
  ],
})
export class PullJobsModule {}
