import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDisplayTabComponent } from './display-tab.component';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { UiModule } from '@oort-front/ui';

/** Display tab Module for summary card edition */
@NgModule({
  declarations: [SafeDisplayTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    UiModule,
  ],
  exports: [SafeDisplayTabComponent],
})
export class SafeDisplayTabModule {}
