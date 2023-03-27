import { Pipe, PipeTransform } from '@angular/core';

type Gradient = { color: string; ratio: number }[] | null;

@Pipe({
  name: 'safeGradient',
  standalone: true,
})
export class GradientPipe implements PipeTransform {
  transform(value?: Gradient): string {
    if (value) {
      const sorted = value.sort((a, b) => a.ratio - b.ratio);
      return (
        'linear-gradient(to left, ' +
        sorted.map((g) => `${g.color} ${g.ratio * 100}%`).join(', ') +
        ')'
      );
    } else {
      return '';
    }
  }
}
