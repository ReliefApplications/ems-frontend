import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePreviousButtonComponent } from './previous-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * SafePreviousButtonModule is a class used to manage all the modules and components
 * related to the previous button.
 */
@NgModule({
  declarations: [SafePreviousButtonComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [SafePreviousButtonComponent],
})
export class SafePreviousButtonModule {}
