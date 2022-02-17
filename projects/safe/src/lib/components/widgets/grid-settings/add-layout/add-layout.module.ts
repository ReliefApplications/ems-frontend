import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLayoutComponent } from './add-layout.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [AddLayoutComponent],
  imports: [CommonModule, MatDialogModule],
  exports: [AddLayoutComponent],
})
export class AddLayoutModule {}
