import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataComponent } from './reference-data.component';
import { SafeAccessModule, SafeGraphQLSelectModule } from '@oort-front/safe';
import { SpinnerModule } from '@oort-front/ui';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { SafeButtonModule } from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@oort-front/ui';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { UiModule } from '@oort-front/ui';

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
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    SafeButtonModule,
    TranslateModule,
    MatChipsModule,
    GridModule,
    TooltipModule,
    SafeGraphQLSelectModule,
    ButtonModule,
    UiModule,
  ],
})
export class ReferenceDataModule {}
