import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPageRoutingModule } from './add-page-routing.module';
import { AddPageComponent } from './add-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentChoiceModule, WidgetChoiceModule } from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import {
  DividerModule,
  ButtonModule,
  GraphQLSelectModule,
  FormWrapperModule,
} from '@oort-front/ui';

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
    ContentChoiceModule,
    TranslateModule,
    DividerModule,
    AbilityModule,
    ButtonModule,
    WidgetChoiceModule,
    GraphQLSelectModule,
    FormWrapperModule,
  ],
})
export class AddPageModule {}
