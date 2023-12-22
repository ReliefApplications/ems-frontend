import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { SkeletonComponent } from '@progress/kendo-angular-indicators';
import random from 'lodash/random';

/**
 * Directive to replace ng-container with skeleton indicators.
 */
@Directive({
  selector: '[sharedSkeleton]',
})
export class SkeletonDirective implements OnChanges {
  /** Input decorator for loading */
  @Input('sharedSkeleton') loading = false;
  /** Input decorator for repeat */
  @Input('sharedSkeletonRepeat') repeat = 1;
  /** Input decorator for width */
  @Input('sharedSkeletonWidth') width: string | number = '';
  /** Input decorator for height */
  @Input('sharedSkeletonHeight') height = '';
  /** Input decorator for shape */
  @Input('sharedSkeletonShape') shape = 'text'; // text / rectangle / circle

  /**
   * Directive to replace ng-container with skeleton indicator
   *
   * @param tpl template reference
   * @param vcr view container ref
   */
  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.loading) {
      this.vcr.clear();

      if (changes.loading.currentValue) {
        Array.from({ length: this.repeat }).forEach(() => {
          const ref = this.vcr.createComponent(SkeletonComponent);

          Object.assign(ref.instance, {
            width: this.width === 'rand' ? `${random(30, 90)}%` : this.width,
            height: this.height,
            shape: this.shape,
            // className: this.className,
          });
        });
      } else {
        this.vcr.createEmbeddedView(this.tpl);
      }
    }
  }
}
