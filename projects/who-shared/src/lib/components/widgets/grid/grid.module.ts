import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoGridComponent } from './grid.component';
import 'hammerjs';
import { WhoSubGridComponent } from './sub-grid/sub-grid.component';
import { GridModule } from '@progress/kendo-angular-grid';

@NgModule({
  declarations: [
    WhoGridComponent,
    WhoSubGridComponent
  ],
  imports: [
    CommonModule,
    GridModule
  ],
  exports: [WhoGridComponent]
})
export class WhoGridModule { }
