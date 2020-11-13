import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoGridComponent } from './grid.component';
import { WhoSubGridComponent } from './sub-grid/sub-grid.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { WhoFormModalModule } from '../../form-modal/form-modal.module';

@NgModule({
  declarations: [
    WhoGridComponent,
    WhoSubGridComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    WhoFormModalModule
  ],
  exports: [WhoGridComponent]
})
export class WhoGridModule { }
