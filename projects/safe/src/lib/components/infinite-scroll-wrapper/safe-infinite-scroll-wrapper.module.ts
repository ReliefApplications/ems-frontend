import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeInfiniteScrollWrapperComponent } from './safe-infinite-scroll-wrapper.component';

@NgModule({
  declarations: [SafeInfiniteScrollWrapperComponent],
  imports: [
    CommonModule
  ],
  exports: [SafeInfiniteScrollWrapperComponent]
})
export class SafeInfiniteScrollWrapperModule { }
