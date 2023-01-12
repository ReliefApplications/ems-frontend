import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeInviteUsersModule } from '../components/invite-users/invite-users.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeUsersTableModule } from '../components/users-table/users-table.module';
import { SafeApplicationUsersComponent } from './application-users.component';

/** Module for components related to application users */
@NgModule({
  declarations: [SafeApplicationUsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSortModule,
    MatChipsModule,
    MatRippleModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    SafeButtonModule,
    MatTooltipModule,
    SafeInviteUsersModule,
    TranslateModule,
    SafeSkeletonTableModule,
    MatTabsModule,
    SafeUsersTableModule,
  ],
  exports: [SafeApplicationUsersComponent],
})
export class SafeApplicationUsersModule {}
