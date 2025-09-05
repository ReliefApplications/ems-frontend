import { Pipe, PipeTransform } from '@angular/core';

/**
 * File color pipe.
 * Get icon color from document name.
 */
@Pipe({
  name: 'fileColor',
  standalone: true,
})
export class FileColorPipe implements PipeTransform {
  /** Mapping between file extensions and standard colors */
  private map: Record<string, string> = {
    pdf: '#D32F2F',
    doc: '#1976D2',
    docx: '#1976D2',
    xls: '#388E3C',
    xlsx: '#388E3C',
    png: '#FBC02D',
    jpg: '#FBC02D',
    jpeg: '#FBC02D',
    gif: '#FBC02D',
    zip: '#7B1FA2',
    txt: '#616161',
    md: '#616161',
    default: '#9E9E9E',
  };

  /**
   * Transform document name into an icon color
   *
   * @param value document name
   * @returns icon color
   */
  transform(value: string): string {
    const ext = value.split('.').pop()?.toLowerCase() || '';
    return this.map[ext] || this.map['default'];
  }
}
