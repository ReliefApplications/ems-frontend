import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoProfileComponent } from './profile.component';



@NgModule({
  declarations: [WhoProfileComponent],
  imports: [
    CommonModule
  ],
  exports: [WhoProfileComponent]
})
export class WhoProfileModule { }
