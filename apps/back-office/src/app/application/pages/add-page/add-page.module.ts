import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPageRoutingModule } from './add-page-routing.module';
import { AddPageComponent } from './add-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatRippleModule } from '@angular/material/core';
import {
  SafeContentChoiceModule,
  SafeFormsDropdownModule,
} from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import { DividerModule, ButtonModule } from '@oort-front/ui';

/**
 * Add page module.
 */
@NgModule({
  declarations: [AddPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    AddPageRoutingModule,
    MatRippleModule,
    SafeContentChoiceModule,
    TranslateModule,
    SafeFormsDropdownModule,
    DividerModule,
    AbilityModule,
    ButtonModule,
  ],
})
export class AddPageModule {}
