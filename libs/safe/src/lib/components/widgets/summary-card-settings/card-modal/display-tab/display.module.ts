import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ToggleModule, TooltipModule, FormWrapperModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDisplayTabComponent } from './display-tab.component';
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
    FormWrapperModule,
    MatDividerModule,
    TooltipModule,
    ToggleModule,
    SafeIconModule,
  ],
  exports: [SafeDisplayTabComponent],
})
export class SafeDisplayTabModule {}
