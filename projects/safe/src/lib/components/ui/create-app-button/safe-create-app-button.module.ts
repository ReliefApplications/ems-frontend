import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAppButtonComponent } from './create-app-button.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    CreateAppButtonComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    CreateAppButtonComponent
  ]
})
export class SafeCreateAppButtonModule { }
