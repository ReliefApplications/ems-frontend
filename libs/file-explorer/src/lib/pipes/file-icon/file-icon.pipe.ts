import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileIcon',
  standalone: true,
})
export class FileIconPipe implements PipeTransform {
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

  transform(value: string): string {
    const ext = value.split('.').pop()?.toLowerCase() || '';
    return this.map[ext] || this.map['default'];
  }
}
