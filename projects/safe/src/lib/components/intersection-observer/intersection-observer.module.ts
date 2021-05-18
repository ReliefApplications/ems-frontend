import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeIntersectionObserverComponent } from './intersection-observer.component';

@NgModule({
  declarations: [
    SafeIntersectionObserverComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SafeIntersectionObserverComponent
  ]
})
export class SafeIntersectionObserverModule { }
