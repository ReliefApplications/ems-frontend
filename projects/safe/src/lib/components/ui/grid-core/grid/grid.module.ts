import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridComponent } from './grid.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeExpandedCommentModule } from '../expanded-comment/expanded-comment.module';


@NgModule({
  declarations: [
    SafeGridComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SafeExpandedCommentModule
  ],
  exports: [
    SafeGridComponent
  ]
})
export class SafeGridModule { }
