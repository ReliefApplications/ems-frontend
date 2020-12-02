import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoPreviousButtonComponent } from './previous-button.component';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [WhoPreviousButtonComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [WhoPreviousButtonComponent]
})
export class WhoPreviousButtonModule { }
