import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeCheckboxTreeComponent } from './checkbox-tree.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CheckboxModule, ButtonModule } from '@oort-front/ui';

/**
 * SafeCheckboxTreeModule is a class used to manage all the modules and components
 * related to the checkbox trees.
 */
@NgModule({
  declarations: [SafeCheckboxTreeComponent],
  imports: [CommonModule, CdkTreeModule, CheckboxModule, ButtonModule],
  exports: [SafeCheckboxTreeComponent],
})
export class SafeCheckboxTreeModule {}
