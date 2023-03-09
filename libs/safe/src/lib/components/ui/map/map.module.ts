import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from './map.component';
import { TranslateModule } from '@ngx-translate/core';
import { PopupComponent } from './map-popup/map-popup.component';

/** Module for the map UI component */
@NgModule({
  declarations: [Component, PopupComponent],
  imports: [CommonModule, TranslateModule],
  exports: [Component],
})
export class Module {}
