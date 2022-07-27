import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGroupsComponent } from './groups.component';

/**
 * SafeGroupsModule manages modules and components
 * related to the groups tab
 */
@NgModule({
  declarations: [SafeGroupsComponent],
  imports: [CommonModule],
  exports: [SafeGroupsComponent],
})
export class SafeGroupsModule {}
