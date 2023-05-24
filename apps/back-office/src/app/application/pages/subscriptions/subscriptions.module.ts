import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsComponent } from './subscriptions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import {
  SafeIconModule,
  SafeGraphQLSelectModule,
  SafeModalModule,
} from '@oort-front/safe';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import {
  MenuModule,
  ButtonModule,
  DividerModule,
  SpinnerModule,
  TableModule,
} from '@oort-front/ui';

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
    MatAutocompleteModule,
    DividerModule,
    SafeIconModule,
    TranslateModule,
    SafeGraphQLSelectModule,
    SafeModalModule,
    ButtonModule,
    TableModule,
  ],
})
export class SubscriptionsModule {}
