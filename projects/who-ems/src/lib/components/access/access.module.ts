import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoAccessComponent } from './access.component';
import { WhoEditAccessComponent } from './edit-access/edit-access.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [WhoAccessComponent, WhoEditAccessComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule
  ],
  exports: [WhoAccessComponent]
})
export class WhoAccessModule { }
