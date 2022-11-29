import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPullJobModalComponent } from './edit-pull-job-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeAlertModule,
  SafeGraphQLSelectModule,
  SafeModalModule,
  SafeReadableCronModule,
} from '@safe/builder';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';

/**
 * Edit pull job module.
 */
@NgModule({
  declarations: [EditPullJobModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SafeModalModule,
    SafeGraphQLSelectModule,
    SafeReadableCronModule,
    SafeAlertModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatChipsModule,
  ],
  exports: [EditPullJobModalComponent],
})
export class EditPullJobModalModule {}
