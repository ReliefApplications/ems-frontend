import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUsersComponent } from './users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import {
  MenuModule,
  CheckboxModule,
  ButtonModule,
  TableModule,
  SpinnerModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { SafeInviteUsersModule } from './components/invite-users/invite-users.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';

/** Module for components related to users */
@NgModule({
  declarations: [SafeUsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MenuModule,
    MatIconModule,
    FormWrapperModule,
    MatAutocompleteModule,
    MatRippleModule,
    SpinnerModule,
    CheckboxModule,
    MatDividerModule,
    SafeInviteUsersModule,
    TranslateModule,
    SafeSkeletonTableModule,
    ButtonModule,
    TableModule,
  ],
  exports: [SafeUsersComponent],
})
export class SafeUsersModule {}
