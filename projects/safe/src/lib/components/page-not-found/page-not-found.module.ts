import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePageNotFoundComponent } from './page-not-found.component';

@NgModule({
  declarations: [SafePageNotFoundComponent],
  imports: [CommonModule],
  exports: [SafePageNotFoundComponent],
})
export class SafePageNotFoundModule {}
