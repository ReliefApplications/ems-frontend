import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFormModalComponent } from './add-form-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeGraphQLSelectModule,
  SafeIconModule,
  SafeModalModule,
} from '@safe/builder';

/**
 * Add form module.
 */
@NgModule({
  declarations: [AddFormModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatChipsModule,
    TranslateModule,
    SafeIconModule,
    SafeGraphQLSelectModule,
    SafeModalModule,
  ],
  exports: [AddFormModalComponent],
})
export class AddFormModule {}
