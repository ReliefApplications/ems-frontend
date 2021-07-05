import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VirtualAssistantComponent} from './virtual-assistant.component';
import {VirtualAssistantRoutingModule} from './virtual-assistant-routing.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [VirtualAssistantComponent],
  imports: [
    CommonModule,
    VirtualAssistantRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  exports: [VirtualAssistantComponent]
})
export class VirtualAssistantModule { }
