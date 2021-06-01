import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ColumnBase, ColumnComponent } from '@progress/kendo-angular-grid';
import { MatDialog } from '@angular/material/dialog';
import { SafeDownloadService } from '../../services/download.service';
import { GradientSettings } from '@progress/kendo-angular-inputs';

const MULTISELECT_TYPES: string[] = ['checkbox', 'tagbox'];

const GRADIENT_SETTINGS: GradientSettings = {
  opacity: false
};

@Component({
  selector: 'safe-grid-column',
  templateUrl: './grid-column.component.html',
  styleUrls: ['./grid-column.component.css'],
  providers: [{
    provide: ColumnBase,
    useExisting: forwardRef(() => SafeGridColumnComponent)
  }]
})
export class SafeGridColumnComponent extends ColumnComponent {

  // === CONST ACCESSIBLE IN TEMPLATE ===
  public multiSelectTypes: string[] = MULTISELECT_TYPES;

  @Input()
  customField: any;

  @Output()
  expandComment: EventEmitter<any> = new EventEmitter<any>();

  public gradientSettings = GRADIENT_SETTINGS;
  public editionActive = false;

  constructor(public dialog: MatDialog, private downloadService: SafeDownloadService) {
    super();
  }

  /* Dialog to open if text or comment overlows
  */
  public onExpandComment(item: any, rowTitle: any): void {
    this.expandComment.emit({item, rowTitle});
  }

  /* Check if element overflows
  */
  isEllipsisActive(e: any): boolean {
    return (e.offsetWidth < e.scrollWidth);
  }

  /* Download the file.
*/
  public onDownload(file: any): void {
    const path = `download/file/${file.content}`;
    this.downloadService.getFile(path, file.type, file.name);
  }

}
