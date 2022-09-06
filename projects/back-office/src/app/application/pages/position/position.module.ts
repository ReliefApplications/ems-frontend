import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionRoutingModule } from './position-routing.module';
import { PositionComponent } from './position.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {
  SafeConfirmModalModule,
  SafeButtonModule,
  SafeModalModule,
} from '@safe/builder';
import { PositionModalComponent } from './components/position-modal/position-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Application position module.
 */
@NgModule({
  declarations: [PositionComponent, PositionModalComponent],
  imports: [
    CommonModule,
    PositionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    SafeConfirmModalModule,
    SafeButtonModule,
    MatButtonModule,
    TranslateModule,
    SafeModalModule,
  ],
  exports: [PositionComponent],
})
export class PositionModule {}
