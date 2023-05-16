import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ToggleModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDisplayTabComponent } from './display-tab.component';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SafeIconModule } from '../../../../ui/icon/icon.module';

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
    ToggleModule,
    MatTooltipModule,
    SafeIconModule,
  ],
  exports: [SafeDisplayTabComponent],
})
export class SafeDisplayTabModule {}
