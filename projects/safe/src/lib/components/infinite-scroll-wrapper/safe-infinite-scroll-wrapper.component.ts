import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { DebouncedFunc, throttle as _throttle } from 'lodash-es';

const SCROLL_DELAY = 500;

@Component({
  selector: 'safe-infinite-scroll-wrapper',
  templateUrl: './safe-infinite-scroll-wrapper.component.html',
  styleUrls: ['./safe-infinite-scroll-wrapper.component.scss']
})
export class SafeInfiniteScrollWrapperComponent {

  @Input()
  loadMoreData = false;

  @Input()
  noMoreData = false;

  @Output()
  checkScroll: EventEmitter<void> = new EventEmitter<void>();

  public onTableScroll: DebouncedFunc<(event: any) => void> = _throttle(this.onCheckScroll, SCROLL_DELAY);

  constructor() {
  }

  private onCheckScroll(event: any): void {
    if (!this.loadMoreData && !this.noMoreData) {
      const tableViewHeight = event.target.offsetHeight; // viewport: ~500px
      const tableScrollHeight = event.target.scrollHeight; // length of all table
      const scrollLocation = event.target.scrollTop; // how far user scrolled

      // If the user has scrolled within 200px of the bottom, add more data
      const buffer = 10;
      const limit = tableScrollHeight - tableViewHeight - buffer;
      if (scrollLocation > limit) {
        this.checkScroll.emit();
      }
    }
  }


}
