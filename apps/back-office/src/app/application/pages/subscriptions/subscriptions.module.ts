import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsComponent } from './subscriptions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SpinnerModule, MenuModule } from '@oort-front/ui';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import {
  SafeButtonModule,
  SafeIconModule,
  SafeGraphQLSelectModule,
  SafeModalModule,
} from '@oort-front/safe';
import { DividerModule } from '@oort-front/ui';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Application subscriptions page module.
 */
@NgModule({
  declarations: [SubscriptionsComponent],
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    SpinnerModule,
    MenuModule,
    MatTableModule,
    MatAutocompleteModule,
    DividerModule,
    SafeButtonModule,
    SafeIconModule,
    TranslateModule,
    SafeGraphQLSelectModule,
    SafeModalModule,
  ],
})
export class SubscriptionsModule {}
