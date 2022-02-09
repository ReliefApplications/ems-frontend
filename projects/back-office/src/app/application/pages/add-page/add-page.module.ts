import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPageRoutingModule } from './add-page-routing.module';
import { AddPageComponent } from './add-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { SafeButtonModule, SafeContentChoiceModule } from '@safe/builder';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AddPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    AddPageRoutingModule,
    MatRippleModule,
    SafeButtonModule,
    SafeContentChoiceModule,
    TranslateModule,
  ],
})
export class AddPageModule {}
