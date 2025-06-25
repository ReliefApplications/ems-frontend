import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, FormWrapperModule, IconModule } from '@oort-front/ui';
import { fileExplorerView } from '../types/file-explorer-view.type';
import { FileExplorerWidgetComponent } from '../file-explorer-widget/file-explorer-widget.component';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';

/**
 * File explorer widget toolbar.
 */
@Component({
  selector: 'shared-file-explorer-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    IconModule,
    FormWrapperModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './file-explorer-toolbar.component.html',
  styleUrls: ['./file-explorer-toolbar.component.scss'],
})
export class FileExplorerToolbarComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** File explorer view */
  @Input() view: fileExplorerView = 'list';
  /** Search control */
  public searchControl: FormControl = new FormControl();
  /** Parent component */
  private parent: FileExplorerWidgetComponent | null = inject(
    FileExplorerWidgetComponent,
    { optional: true }
  );

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.parent) {
          this.parent.onFilterChange({
            search: value,
          });
        }
      });
  }

  /**
   * Update view
   *
   * @param view selected view
   */
  public onChangeView(view: fileExplorerView) {
    if (this.parent) {
      this.parent.view = view;
    }
  }
}
