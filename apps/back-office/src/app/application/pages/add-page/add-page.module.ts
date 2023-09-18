import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPageRoutingModule } from './add-page-routing.module';
import { AddPageComponent } from './add-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SafeContentChoiceModule,
  SafeFormsDropdownModule,
  SafeWidgetChoiceModule,
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
    AddPageRoutingModule,
    SafeContentChoiceModule,
    TranslateModule,
    SafeFormsDropdownModule,
    DividerModule,
    AbilityModule,
    ButtonModule,
    SafeWidgetChoiceModule,
  ],
})
export class AddPageModule {}
