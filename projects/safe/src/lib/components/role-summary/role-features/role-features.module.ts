import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleFeaturesComponent } from './role-features.component';

/**
 * Features tab of Role Summary component.
 * Visible only in applications.
 */
@NgModule({
  declarations: [RoleFeaturesComponent],
  imports: [CommonModule],
  exports: [RoleFeaturesComponent],
})
export class RoleFeaturesModule {}
