import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePageNotFoundComponent } from './page-not-found.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SafePageNotFoundComponent],
  imports: [CommonModule, RouterModule],
  exports: [SafePageNotFoundComponent],
})
export class SafePageNotFoundModule {}
