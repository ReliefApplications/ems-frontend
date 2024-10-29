import { Inject, Pipe, PipeTransform } from '@angular/core';
import isNil from 'lodash/isNil';

/**
 * Replace asset path to include correct href.
 */
@Pipe({
  name: 'sharedAsset',
  standalone: true,
})
export class AssetPipe implements PipeTransform {
  /** Current href, from environment */
  private href = '';

  /**
   * Replace asset path to include correct href.
   *
   * @param environment Environment configuration
   */
  constructor(@Inject('environment') environment: any) {
    if (!isNil(environment.href)) {
      this.href = environment.href;
    }
  }

  /**
   * Add href before asset path
   *
   * @param value asset path
   * @returns corrected asset path, including href
   */
  transform(value: string): string {
    return this.href + value;
  }
}
