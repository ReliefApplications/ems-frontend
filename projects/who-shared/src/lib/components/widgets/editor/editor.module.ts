import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoEditorComponent } from './editor.component';

@NgModule({
  declarations: [WhoEditorComponent],
  imports: [
    CommonModule
  ],
  exports: [WhoEditorComponent]
})
export class WhoEditorModule { }
