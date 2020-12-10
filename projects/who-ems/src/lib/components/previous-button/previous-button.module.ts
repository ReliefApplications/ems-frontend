import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoPreviousButtonComponent } from './previous-button.component';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [WhoPreviousButtonComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [WhoPreviousButtonComponent]
})
export class WhoPreviousButtonModule { }
