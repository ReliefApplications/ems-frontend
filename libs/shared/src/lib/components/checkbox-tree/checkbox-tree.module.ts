import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxTreeComponent } from './checkbox-tree.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CheckboxModule, ButtonModule } from '@oort-front/ui';

/**
 * CheckboxTreeModule is a class used to manage all the modules and components
 * related to the checkbox trees.
 */
@NgModule({
  declarations: [CheckboxTreeComponent],
  imports: [CommonModule, CdkTreeModule, CheckboxModule, ButtonModule],
  exports: [CheckboxTreeComponent],
})
export class CheckboxTreeModule {}
