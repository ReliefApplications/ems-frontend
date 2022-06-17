import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarkersComponent } from './map-markers.component';



@NgModule({
  declarations: [
    MapMarkersComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [MapMarkersComponent]
})
export class MapMarkersModule { }
