import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonComponent } from './button.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    SafeButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [
    SafeButtonComponent
  ]
})
export class SafeButtonModule { }
