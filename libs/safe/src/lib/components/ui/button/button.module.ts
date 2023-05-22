import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeButtonComponent } from './button.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SpinnerModule, IconModule } from '@oort-front/ui';
/**
 * Button component module.
 */
@NgModule({
  declarations: [SafeButtonComponent],
  imports: [CommonModule, MatButtonModule, SpinnerModule, IconModule],
  exports: [SafeButtonComponent],
})
export class SafeButtonModule {}
