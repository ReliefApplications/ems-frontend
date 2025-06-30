import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { fileExplorerView } from '../types/file-explorer-view.type';
import { FileExplorerWidgetComponent } from '../file-explorer-widget/file-explorer-widget.component';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SortDescriptor } from '@progress/kendo-data-query';

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
    TranslateModule,
    TooltipModule,
    SelectMenuModule,
  ],
  templateUrl: './file-explorer-toolbar.component.html',
  styleUrls: ['./file-explorer-toolbar.component.scss'],
})
export class FileExplorerToolbarComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  /** File explorer view */
  @Input() view: fileExplorerView = 'list';
  /** Sort descriptor */
  @Input() sort: SortDescriptor[] = [];
  /** Search control */
  public searchControl: FormControl = new FormControl();
  /** Sort field control */
  public sortFieldControl: FormControl = new FormControl();
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

  ngOnChanges(): void {
    this.sortFieldControl.setValue(this.sort[0]?.field);
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

  /**
   * Update sort field
   *
   * @param field selected field
   */
  public onSortChange(field: string) {
    this.parent?.onSortChange([
      {
        field: field,
        dir: 'asc',
      },
    ]);
  }

  /**
   * Toggle sort direction
   */
  public onSortDirChange() {
    this.parent?.onSortChange([
      {
        field: this.sort[0]?.field,
        dir: this.sort[0]?.dir === 'asc' ? 'desc' : 'asc',
      },
    ]);
  }
}
