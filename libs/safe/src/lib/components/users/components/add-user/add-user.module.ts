import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAddUserComponent } from './add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DialogModule, FormWrapperModule } from '@oort-front/ui';

/** Module for the add user component */
@NgModule({
  declarations: [SafeAddUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    FormWrapperModule,
  ],
  exports: [SafeAddUserComponent],
})
export class SafeAddUserModule {}
