import { NgModule } from '@angular/core';
import { WhoAccessModule } from './components/access/public-api';
import { WhoLayoutModule } from './components/layout/layout.module';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: [
    WhoLayoutModule,
    WhoAccessModule
  ]
})
export class WhoSharedModule { }
