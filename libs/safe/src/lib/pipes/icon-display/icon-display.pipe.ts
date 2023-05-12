import { Pipe, PipeTransform } from '@angular/core';

/**
 * Format the given icon and fontFamily into a class to render in an <i> element
 */
@Pipe({
  name: 'safeIconDisplay',
})
export class SafeIconDisplayPipe implements PipeTransform {
  /**
   * Attaches the font family prefix to the given icon
   *
   * @param iconName Icon name
   * @param fontFamily Icon font family in order to attach it to the given icon
   * @returns Formatted icon class
   */
  transform(iconName: string, fontFamily: string): string {
    let iconClassName = '';

    switch (fontFamily) {
      case 'fa':
        iconClassName = 'fa fa-';
        break;

      default:
        break;
    }
    return iconClassName + iconName;
  }
}
