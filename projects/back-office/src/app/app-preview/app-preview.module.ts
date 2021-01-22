import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppPreviewRoutingModule } from './app-preview-routing.module';
import { AppPreviewComponent } from './app-preview.component';
import { WhoLayoutModule } from '@who-ems/builder';
import { PreviewToolbarModule } from './components/preview-toolbar/preview-toolbar.module';

@NgModule({
  declarations: [AppPreviewComponent],
  imports: [
    CommonModule,
    AppPreviewRoutingModule,
    WhoLayoutModule,
    PreviewToolbarModule
  ]
})
export class AppPreviewModule { }
