import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataComponent } from './reference-data.component';
import { SafeAccessModule, SafeGraphQLSelectModule } from '@oort-front/safe';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { SafeButtonModule } from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { SafeIconModule } from '@oort-front/safe';
import { GridModule } from '@progress/kendo-angular-grid';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { ButtonModule } from '@progress/kendo-angular-buttons';

/**
 * Reference Data page module.
 */
@NgModule({
  declarations: [ReferenceDataComponent],
  imports: [
    CommonModule,
    ReferenceDataRoutingModule,
    SafeAccessModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    SafeButtonModule,
    TranslateModule,
    MatChipsModule,
    SafeIconModule,
    GridModule,
    MatTooltipModule,
    SafeGraphQLSelectModule,
    ButtonModule,
  ],
})
export class ReferenceDataModule {}
