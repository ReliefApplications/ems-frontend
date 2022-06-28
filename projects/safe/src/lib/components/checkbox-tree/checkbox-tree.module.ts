import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeCheckboxTreeComponent } from './checkbox-tree.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

/**
 * SafeCheckboxTreeModule is a class used to manage all the modules and components
 * related to the checkbox trees.
 */
@NgModule({
  declarations: [SafeCheckboxTreeComponent],
  imports: [
    CommonModule,
    CdkTreeModule,
    MatTreeModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [SafeCheckboxTreeComponent],
})
export class SafeCheckboxTreeModule {}
