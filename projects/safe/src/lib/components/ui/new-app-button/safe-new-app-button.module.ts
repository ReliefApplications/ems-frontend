import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewAppButtonComponent } from './new-app-button.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    NewAppButtonComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    NewAppButtonComponent
  ]
})
export class SafeNewAppButtonModule { }
