import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationDropdownComponent } from './application-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SafeApplicationDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule
  ],
  exports: [
    SafeApplicationDropdownComponent
  ]
})
export class SafeApplicationDropdownModule { }
