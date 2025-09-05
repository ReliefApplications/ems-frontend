import { Pipe, PipeTransform } from '@angular/core';

/**
 * File icon pipe.
 * Get icon name from document name.
 */
@Pipe({
  name: 'fileIcon',
  standalone: true,
})
export class FileIconPipe implements PipeTransform {
  /** Mapping between file types & icon names */
  private map: Record<string, string> = {
    pdf: 'file-pdf',
    doc: 'file-word',
    docx: 'file-word',
    xls: 'file-excel',
    xlsx: 'file-excel',
    png: 'file-image',
    jpg: 'file-image',
    jpeg: 'file-image',
    gif: 'file-image',
    zip: 'file-zipper',
    txt: 'file-text',
    md: 'file-text',
    default: 'file',
  };

  /**
   * Transform document name into an icon name
   *
   * @param value document name
   * @returns icon name
   */
  transform(value: string): string {
    const ext = value.split('.').pop()?.toLowerCase() || '';
    return this.map[ext] || this.map['default'];
  }
}
