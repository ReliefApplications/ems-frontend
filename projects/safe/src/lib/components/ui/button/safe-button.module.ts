import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonComponent } from './safe-button.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SafeButtonComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [SafeButtonComponent]
})
export class SafeButtonModule {
}
