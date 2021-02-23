import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { WhoWidgetGridComponent, WhoWidgetGridModule } from '@who-ems/builder';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    WhoWidgetGridModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const whoWidgetGrid = createCustomElement(WhoWidgetGridComponent, { injector: this.injector });

    customElements.define('who-widget-grid', whoWidgetGrid);
  }
}
