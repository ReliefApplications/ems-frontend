import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SafeButtonModule } from '../../button/button.module';
import { SafeIconModule } from '../../icon/icon.module';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormsModule } from '@angular/forms';
import { SafeDividerModule } from '../../divider/divider.module';

/**
 * map download component
 */
@Component({
  standalone: true,
  selector: 'safe-map-download',
  templateUrl: './map-download.component.html',
  imports: [
    CommonModule,
    SafeButtonModule,
    SafeIconModule,
    SafeDividerModule,
    MatRadioModule,
    MatSelectModule,
    FormsModule,
  ],
  styleUrls: ['./map-download.component.scss'],
})
export class SafeMapDownloadComponent {
  public expanded = false;
  public views = ['Current view', 'All views'];
  public layers = ['All layers', 'Visible layers', 'Selected layers'];
  public layersToSelect = ''; // Corresponds to the current 'layers' option selected
  public availableLayers: string[] = [];
  public downloadOutputs = ['CSV', 'Excel', 'GeoJSON', 'PNG'];
  /**
   * Toggles the display of the popup download menu
   *
   * If the element is hidden, it will be shown. If the element is shown, it will be hidden when clicking.
   */
  public toggleVisibility(): void {
    this.expanded = !this.expanded;
  }
}
