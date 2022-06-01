import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { GridSettings } from '../../ui/core-grid/models/grid-settings.model';

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
  },
};

/**
 * Tab component to preview grid widget.
 */
@Component({
  selector: 'safe-tab-layout-preview',
  templateUrl: './tab-layout-preview.component.html',
  styleUrls: ['./tab-layout-preview.component.scss'],
})
export class SafeTabLayoutPreviewComponent implements OnInit, OnDestroy {
  @Input() data: LayoutPreviewData | null = null;
  public gridSettings: GridSettings = DEFAULT_GRID_SETTINGS;
  private subscription: any;
  /**
   * The constructor for the preview of the grid widget
   */
  constructor() {}

  /** Update grid actions, listening to form changes */
  ngOnInit(): void {
    if (this.data) {
      this.gridSettings = {
        ...this.data?.form?.getRawValue(),
        ...DEFAULT_GRID_SETTINGS,
      };
      this.subscription = this.data.form
        .get('query')
        ?.valueChanges.subscribe(() => {
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
   * Remove subscriptions.
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
