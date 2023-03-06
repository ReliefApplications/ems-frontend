import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPreviewRoutingModule } from './app-preview-routing.module';
import { AppPreviewComponent } from './app-preview.component';
import { PreviewToolbarModule } from './components/preview-toolbar/preview-toolbar.module';
import { SafeLayoutModule, SafeLeftSidenavModule } from '@safe/builder';

/**
 * Main Module of Application preview capacity.
 * Duplicates most features of the front-office when executed.
 */
@NgModule({
  declarations: [AppPreviewComponent],
  imports: [
    CommonModule,
    AppPreviewRoutingModule,
    SafeLayoutModule,
    SafeLeftSidenavModule,
    PreviewToolbarModule,
  ],
})
export class AppPreviewModule {}
