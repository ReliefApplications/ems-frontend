import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonComponent } from './button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SafeButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    SafeButtonComponent
  ]
})
export class SafeButtonModule { }
