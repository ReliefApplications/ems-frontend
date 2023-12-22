import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Utils component to remove subscription to subjects.
 * Can be extended by any component, that would use ngOnDestroy to do so.
 * In order to extend it in another component, do as follow:
 * ```export class AnyOtherComponent extends UnsubscribeComponent```
 *
 * In order to use auto removal of subscriptions, do as follow:
 * ```anySubscription.pipe(takeUntil(this.destroy$)).subscribe() ```
 */
@Component({
  selector: 'shared-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss'],
})
export class UnsubscribeComponent implements OnDestroy {
  /**
   * Subject to destroy
   */
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * Emit Destroy event, and unsubscribe to destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
