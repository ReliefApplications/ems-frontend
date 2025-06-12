import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, FormWrapperModule, IconModule } from '@oort-front/ui';
import { fileExplorerView } from '../../types/fie-explorer-view.type';
import { FileExplorerWidgetComponent } from '../file-explorer-widget/file-explorer-widget.component';

/**
 * File explorer widget toolbar.
 */
@Component({
  selector: 'oort-front-file-explorer-toolbar',
  standalone: true,
  imports: [CommonModule, IconModule, FormWrapperModule, ButtonModule],
  templateUrl: './file-explorer-toolbar.component.html',
  styleUrls: ['./file-explorer-toolbar.component.scss'],
})
export class FileExplorerToolbarComponent {
  /** File explorer view */
  @Input() view: fileExplorerView = 'list';
  /** Parent component */
  private parent: FileExplorerWidgetComponent | null = inject(
    FileExplorerWidgetComponent,
    { optional: true }
  );

  /**
   * Update view
   *
   * @param view selected view
   */
  public onChangeView(view: fileExplorerView) {
    console.log(view);
    console.log(this.parent);
    if (this.parent) {
      this.parent.view = view;
    }
  }
}
