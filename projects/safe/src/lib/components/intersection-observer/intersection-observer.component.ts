import { ElementRef, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'safe-intersection-observer',
  templateUrl: './intersection-observer.component.html',
  styleUrls: ['./intersection-observer.component.scss']
})
export class SafeIntersectionObserverComponent implements OnInit, OnDestroy {

  @Input() loading = true;
  @Output() intersect = new EventEmitter();

  @HostBinding('class.loading') get loadingClass(): boolean {
    return this.loading;
  }

  private observer!: IntersectionObserver;
  isIntersecting = false;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this));
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    console.log('intersection');
    const entry = entries[0];
    this.isIntersecting = entry.isIntersecting;
    if (this.isIntersecting) {
      console.log('intersect');
      this.intersect.emit(entry.intersectionRatio);
    }
  }
}
