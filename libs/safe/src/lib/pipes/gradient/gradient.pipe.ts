import { Pipe, PipeTransform } from '@angular/core';

type Gradient = { color: string; ratio: number }[] | null;

/**
 * Gradient pipe
 * Get linear gradient from gradient definition
 */
@Pipe({
  name: 'safeGradient',
  standalone: true,
})
export class GradientPipe implements PipeTransform {
  /**
   * Transform gradient value into background css property value
   *
   * @param value gradient
   * @param degrees rotation in degrees
   * @returns background css property value if gradient is defined
   */
  transform(value?: Gradient, degrees?: number): string {
    if (value) {
      const sorted = value.slice().sort((a, b) => a.ratio - b.ratio);
      if (degrees) {
        return (
          'linear-gradient(' +
          degrees +
          'deg, ' +
          sorted.map((g) => `${g.color} ${g.ratio * 100}%`).join(', ') +
          ')'
        );
      } else {
        return (
          'linear-gradient(to left, ' +
          sorted.map((g) => `${g.color} ${g.ratio * 100}%`).join(', ') +
          ')'
        );
      }
    } else {
      return '';
    }
  }
}
