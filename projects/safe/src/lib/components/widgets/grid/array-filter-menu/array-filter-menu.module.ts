import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeArrayFilterMenuComponent } from './array-filter-menu.component';



@NgModule({
  declarations: [
    SafeArrayFilterMenuComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SafeArrayFilterMenuComponent]
})
export class SafeArrayFilterMenuModule { }
