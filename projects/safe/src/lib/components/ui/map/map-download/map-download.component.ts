import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SafeButtonModule } from '../../button/button.module';
import { SafeIconModule } from '../../icon/icon.module';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import {
  FormGroup,
  FormsModule,
  FormControl,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { SafeDividerModule } from '../../divider/divider.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    TranslateModule,
    ReactiveFormsModule,
  ],
  styleUrls: ['./map-download.component.scss'],
})
export class SafeMapDownloadComponent {
  public expanded = false;
  public views = [
    this.translate.instant(
      'components.widget.settings.map.downloadViews.currentViews'
    ),
    this.translate.instant(
      'components.widget.settings.map.downloadViews.allViews'
    ),
  ];
  public layers = [
    this.translate.instant(
      'components.widget.settings.map.downloadLayers.allLayers'
    ),
    this.translate.instant(
      'components.widget.settings.map.downloadLayers.visibleLayers'
    ),
    this.translate.instant(
      'components.widget.settings.map.downloadLayers.selectedLayers'
    ),
  ];
  public layersToSelect = ''; // Corresponds to the current 'layers' option selected
  public availableLayers: string[] = [];
  public downloadOutputs = ['CSV', 'Excel', 'GeoJSON', 'PNG'];
  public form: FormGroup;

  /**
   * Creates the form to handle the layers selection
   *
   * @param fb form builder
   * @param translate common translate service
   */
  constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.form = fb.group({
      layersToSelect: new FormControl('All layers'),
    });
  }

  /**
   * Toggles the display of the popup download menu.
   * If the element is hidden, it will be shown. If the element is shown, it will be hidden when clicking.
   */
  public toggleVisibility(): void {
    this.expanded = !this.expanded;
  }
}
