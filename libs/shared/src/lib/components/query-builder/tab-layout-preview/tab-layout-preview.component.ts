import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { GridSettings } from '../../ui/core-grid/models/grid-settings.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** Layout preview interface */
export interface LayoutPreviewData {
  form: any;
  defaultLayout: any;
}

/** Default grid settings provided to core grid */
const DEFAULT_GRID_SETTINGS = {
  actions: {
    delete: false,
    history: true,
    convert: false,
    update: false,
    inlineEdition: false,
    remove: false,
  },
};

/**
 * Tab component to preview grid widget.
 */
@Component({
  selector: 'shared-tab-layout-preview',
  templateUrl: './tab-layout-preview.component.html',
  styleUrls: ['./tab-layout-preview.component.scss'],
})
export class TabLayoutPreviewComponent implements OnInit {
  /** Layout preview data */
  @Input() data: LayoutPreviewData | null = null;
  /** Grid settings */
  public gridSettings: GridSettings = DEFAULT_GRID_SETTINGS;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /** Update grid actions, listening to form changes */
  ngOnInit(): void {
    if (this.data) {
      this.gridSettings = {
        ...this.data?.form?.getRawValue(),
        ...DEFAULT_GRID_SETTINGS,
      };
      this.data.form
        .get('query')
        ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.gridSettings = {
            ...this.data?.form?.getRawValue(),
            ...DEFAULT_GRID_SETTINGS,
          };
        });
    }
  }

  /**
   * Updates layout parameters.
   *
   * @param value new value
   */
  onGridLayoutChange(value: any): void {
    if (this.data) {
      this.data.form?.get('display')?.setValue(value);
    }
  }

  /**
   * Updates pageSize parameter.
   *
   * @param value new value
   */
  onPageSizeChange(value: any): void {
    if (this.data) {
      this.data.form?.get('query')?.patchValue({ pageSize: value });
    }
  }
}
