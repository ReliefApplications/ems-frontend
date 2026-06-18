import { Injectable } from '@angular/core';

/** Shared service to preview PDFs/images and download other files. */
@Injectable({
  providedIn: 'root',
})
export class FilePreviewService {
  // /**
  //  * Opens a generated file button target from parsed HTML content.
  //  *
  //  * @param event click event
  //  * @param data record or survey data containing the file value
  //  */
  // public openFileFromEvent(event: MouseEvent, data: unknown): void {
  //   const target = event.target as HTMLElement | null;
  //   const fileButton = target?.closest<HTMLButtonElement>(
  //     'button[type="file"][field][index]'
  //   );
  //   if (!fileButton) {
  //     return;
  //   }
  //   event.preventDefault();
  //   const fieldName = fileButton.getAttribute('field');
  //   const index = fileButton.getAttribute('index');
  //   if (!fieldName || Number.isNaN(Number(index))) {
  //     this.showFilePreviewError();
  //     return;
  //   }
  //   const file = get(
  //     data,
  //     `${fieldName}[${index}]`,
  //     null
  //   ) as PreviewFile | null;
  //   if (file) {
  //     this.openFile(file);
  //   }
  // }
}
