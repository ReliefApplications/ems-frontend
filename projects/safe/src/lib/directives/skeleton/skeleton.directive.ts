import {
  ComponentFactoryResolver,
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
 * Dircetive to replace ng-container with skeleton indicators.
 */
@Directive({
  selector: '[safeSkeleton]',
})
export class SafeSkeletonDirective implements OnChanges {
  @Input('safeSkeleton') loading = false;
  @Input('safeSkeletonRepeat') repeat = 1;
  @Input('safeSkeletonWidth') width: string | number = '';
  @Input('safeSkeletonHeight') height = '';
  @Input('safeSkeletonShape') shape = 'text'; // text / rectangle / circle
  // @Input() className = '';

  private factory = this.resolver.resolveComponentFactory(SkeletonComponent);

  /**
   * Constructor for skeleton directive
   *
   * @param tpl Access template
   * @param vcr View container references
   * @param resolver Factory resolver for components
   */
  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.loading) {
      this.vcr.clear();

      if (changes.loading.currentValue) {
        Array.from({ length: this.repeat }).forEach(() => {
          const ref = this.vcr.createComponent(this.factory);

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
