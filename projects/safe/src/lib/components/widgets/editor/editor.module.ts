import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditorComponent } from './editor.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [SafeEditorComponent],
    imports: [
        CommonModule,
        MatTooltipModule
    ],
  exports: [SafeEditorComponent]
})
export class SafeEditorModule { }
