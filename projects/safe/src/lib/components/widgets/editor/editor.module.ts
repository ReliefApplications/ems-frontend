import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditorComponent } from './editor.component';

@NgModule({
  declarations: [SafeEditorComponent],
  imports: [
    CommonModule
  ],
  exports: [SafeEditorComponent]
})
export class SafeEditorModule { }
