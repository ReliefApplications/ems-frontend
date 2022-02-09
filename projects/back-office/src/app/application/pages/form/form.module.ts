import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import {
  SafeFormModule,
  SafeAccessModule,
  SafeButtonModule,
} from '@safe/builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormRoutingModule,
    SafeFormModule,
    SafeAccessModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    SafeButtonModule,
    TranslateModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
