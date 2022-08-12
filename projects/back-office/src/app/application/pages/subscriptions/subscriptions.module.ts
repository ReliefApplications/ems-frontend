import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsComponent } from './subscriptions.component';
import { SubscriptionModalComponent } from './components/subscription-modal/subscription-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import {
  SafeConfirmModalModule,
  SafeButtonModule,
  SafeIconModule,
  SafeGraphQLSelectModule,
} from '@safe/builder';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Application subscriptions page module.
 */
@NgModule({
  declarations: [SubscriptionsComponent, SubscriptionModalComponent],
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
    SafeConfirmModalModule,
    MatAutocompleteModule,
    MatDividerModule,
    SafeButtonModule,
    SafeIconModule,
    TranslateModule,
    MatTooltipModule,
    SafeGraphQLSelectModule,
  ],
})
export class SubscriptionsModule {}
