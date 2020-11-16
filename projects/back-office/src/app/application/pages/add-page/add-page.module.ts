import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPageRoutingModule } from './add-page-routing.module';
import { AddPageComponent } from './add-page.component';


@NgModule({
  declarations: [AddPageComponent],
  imports: [
    CommonModule,
    AddPageRoutingModule
  ]
})
export class AddPageModule { }
