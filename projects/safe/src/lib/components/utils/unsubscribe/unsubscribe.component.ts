import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'safe-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss'],
})
export class SafeUnsubscribeComponent implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * Emit Destroy event, and unsubscribe to destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
