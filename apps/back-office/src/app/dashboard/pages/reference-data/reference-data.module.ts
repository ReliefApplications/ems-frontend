import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataComponent } from './reference-data.component';
import { SafeAccessModule } from '@oort-front/safe';
import { GraphQLSelectModule, IconModule, SpinnerModule } from '@oort-front/ui';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { TranslateModule } from '@ngx-translate/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  TooltipModule,
  ButtonModule as UiButtonModule,
  SelectMenuModule,
  TextareaModule,
  FormWrapperModule,
} from '@oort-front/ui';

/**
 * Reference Data page module.
 */
@NgModule({
  declarations: [ReferenceDataComponent],
  imports: [
    CommonModule,
    ReferenceDataRoutingModule,
    SafeAccessModule,
    SpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    TranslateModule,
    IconModule,
    GridModule,
    TooltipModule,
    GraphQLSelectModule,
    ButtonModule,
    TextareaModule,
    UiButtonModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
})
export class ReferenceDataModule {}
