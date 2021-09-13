import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAddUserComponent } from './add-user.component';

@NgModule({
  declarations: [
    SafeAddUserComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SafeAddUserComponent]
})
export class SafeAddUserModule { }
