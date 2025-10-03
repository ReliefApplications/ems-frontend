import { Component, inject, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BreadCrumbItem,
  BreadCrumbModule,
} from '@progress/kendo-angular-navigation';
import { FileExplorerTagKey } from '../types/file-explorer-filter.type';
import { FileExplorerWidgetComponent } from '../file-explorer-widget/file-explorer-widget.component';

/**
 * Custom file explorer breadcrumb item interface
 */
interface FileExplorerBreadCrumbItem extends BreadCrumbItem {
  tag?: FileExplorerTagKey;
  id?: number | string;
}

/** Default breadcrumb items */
const defaultItems: FileExplorerBreadCrumbItem[] = [
  {
    icon: 'home',
  },
];

/**
 * File explorer breadcrumb component.
 * Indicates current path + allow user to navigate through tags.
 */
@Component({
  selector: 'shared-file-explorer-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadCrumbModule],
  templateUrl: './file-explorer-breadcrumb.component.html',
  styleUrls: ['./file-explorer-breadcrumb.component.scss'],
})
export class FileExplorerBreadcrumbComponent implements OnChanges {
  /** Selected tags */
  @Input() selectedTags: {
    tag: FileExplorerTagKey;
    id: number | string;
    text: string;
  }[] = [];
  /** Breadcrumb items */
  public items: FileExplorerBreadCrumbItem[] = [...defaultItems];
  /** Parent component */
  private parent: FileExplorerWidgetComponent | null = inject(
    FileExplorerWidgetComponent,
    { optional: true }
  );

  ngOnChanges(): void {
    this.items = [
      ...defaultItems,
      ...this.selectedTags.map((tag) => ({
        text: tag.text,
        title: tag.text,
        tag: tag.tag,
        id: tag.id,
      })),
    ];
  }

  /**
   * On breadcrumb item click, update parent tag selection up to that tag
   * If home is clicked, reset the list
   *
   * @param item Clicked breadcrumb item
   */
  public onItemClick(item: FileExplorerBreadCrumbItem): void {
    const index = this.items.findIndex(
      (e) => e.id === item.id && e.tag === item.tag
    );
    if (this.parent) {
      // Slice from 1 to avoid pushing 'home'
      this.parent.onSelectionChange(
        this.items.slice(1, index + 1).map((x) => ({
          tag: x.tag as FileExplorerTagKey,
          text: x.text as string,
          id: x.id as string | number,
        }))
      );
    }
  }
}
