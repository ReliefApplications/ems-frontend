import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuplicateApplicationComponent } from './duplicate-application.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [DuplicateApplicationComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [DuplicateApplicationComponent]
})
export class DuplicateApplicationModule { }
