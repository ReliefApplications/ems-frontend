import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonComponent } from './button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SafeSpinnerModule } from '../spinner/spinner.module';

@NgModule({
  declarations: [
    SafeButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    SafeSpinnerModule
  ],
  exports: [
    SafeButtonComponent
  ]
})
export class SafeButtonModule { }
