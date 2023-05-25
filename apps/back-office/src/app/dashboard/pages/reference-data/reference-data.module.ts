import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataComponent } from './reference-data.component';
import { SafeAccessModule, SafeGraphQLSelectModule } from '@oort-front/safe';
import { SpinnerModule } from '@oort-front/ui';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '@oort-front/safe';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  TooltipModule,
  ButtonModule as UiButtonModule,
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
    MatSelectModule,
    MatOptionModule,
    TranslateModule,
    SafeIconModule,
    GridModule,
    TooltipModule,
    SafeGraphQLSelectModule,
    ButtonModule,
    TextareaModule,
    UiButtonModule,
    FormWrapperModule,
  ],
})
export class ReferenceDataModule {}
