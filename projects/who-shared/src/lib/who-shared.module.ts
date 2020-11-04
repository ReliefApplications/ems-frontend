import { NgModule } from '@angular/core';
import { WhoFormModule } from './components/form/form.module';
import { WhoAccessModule } from './components/access/access.module';
import { WhoLayoutModule } from './components/layout/layout.module';
import { WhoFormBuilderModule } from './components/form-builder/form-builder.module';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    WhoLayoutModule,
    WhoAccessModule,
    WhoFormModule,
    WhoFormBuilderModule
  ]
})
export class WhoSharedModule { }
