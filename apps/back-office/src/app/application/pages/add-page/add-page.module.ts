import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPageRoutingModule } from './add-page-routing.module';
import { AddPageComponent } from './add-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SafeContentChoiceModule,
  SafeFormsDropdownModule,
} from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import { DividerModule, ButtonModule } from '@oort-front/ui';
import { SafeWidgetChoiceModule } from 'libs/safe/src/lib/components/widget-choice/widget-choice.module';

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
