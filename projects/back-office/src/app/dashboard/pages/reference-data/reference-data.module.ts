import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataComponent } from './reference-data.component';
import { SafeAccessModule, SafeGraphQLSelectModule, SafePreviousButtonModule } from '@safe/builder';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { SafeButtonModule } from '@safe/builder';
import { TranslateModule } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { SafeIconModule } from '@safe/builder';
import { GridModule } from '@progress/kendo-angular-grid';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Reference Data page module.
 */
@NgModule({
  declarations: [ReferenceDataComponent],
  imports: [
    CommonModule,
    ReferenceDataRoutingModule,
    SafePreviousButtonModule,
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
    SafeGraphQLSelectModule
  ],
})
export class ReferenceDataModule {}
