import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { WhoConfirmModalModule } from '@who-ems/builder';
import { AddFormModule } from '../../../components/add-form/add-form.module';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [FormsComponent],
    imports: [
        CommonModule,
        FormsRoutingModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatChipsModule,
        WhoConfirmModalModule,
        AddFormModule,
    ],
  exports: [FormsComponent]
})
export class FormsModule { }
