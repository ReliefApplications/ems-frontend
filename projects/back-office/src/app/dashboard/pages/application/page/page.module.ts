import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { PageComponent } from './page.component';


@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    PageRoutingModule
  ]
})
export class PageModule { }
