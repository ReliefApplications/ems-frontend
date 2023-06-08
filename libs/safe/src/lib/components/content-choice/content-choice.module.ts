import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeContentChoiceComponent } from './content-choice.component';

/**
 * SafeContentChoiceModule is a class used to manage all the modules and components
 * related to the choice of content in a new page, new step etc.
 */
@NgModule({
  declarations: [SafeContentChoiceComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [SafeContentChoiceComponent],
})
export class SafeContentChoiceModule {}
