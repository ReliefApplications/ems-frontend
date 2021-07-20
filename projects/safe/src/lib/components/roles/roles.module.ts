import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRolesComponent } from './roles.component';
import { SafeAddRoleComponent } from './components/add-role/add-role.component';
import { SafeEditRoleComponent } from './components/edit-role/edit-role.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SafeConfirmModalModule } from '../confirm-modal/confirm-modal.module';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [SafeRolesComponent, SafeAddRoleComponent, SafeEditRoleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    SafeConfirmModalModule,
    MatSortModule,
    MatAutocompleteModule
  ],
  exports: [SafeRolesComponent]
})
export class SafeRolesModule { }
