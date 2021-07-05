import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VirtualAssistantComponent} from './virtual-assistant.component';

@NgModule({
  declarations: [VirtualAssistantComponent],
  imports: [
    CommonModule,
  ],
  exports: [VirtualAssistantComponent]
})
export class VirtualAssistantModule { }
