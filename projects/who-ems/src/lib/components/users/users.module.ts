import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoUsersComponent } from './users.component';
import { WhoEditUserComponent } from './components/edit-user/edit-user.component';
import { WhoInviteUserComponent } from './components/invite-user/invite-user.component';

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

@NgModule({
  declarations: [WhoUsersComponent, WhoEditUserComponent, WhoInviteUserComponent],
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
        MatCheckboxModule,
        MatProgressSpinnerModule
    ],
  exports: [WhoUsersComponent]
})
export class WhoUsersModule { }
