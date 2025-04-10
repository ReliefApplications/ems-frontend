import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentChoiceComponent } from './content-choice.component';
import { AssetPipe } from '../../pipes/asset/asset.pipe';

/**
 * ContentChoiceModule is a class used to manage all the modules and components
 * related to the choice of content in a new page, new step etc.
 */
@NgModule({
  declarations: [ContentChoiceComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AssetPipe],
  exports: [ContentChoiceComponent],
})
export class ContentChoiceModule {}
