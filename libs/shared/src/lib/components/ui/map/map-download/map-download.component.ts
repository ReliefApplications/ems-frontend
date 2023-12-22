import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  DividerModule,
  IconModule,
  RadioModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';

/**
 * Map download component
 */
@Component({
  standalone: true,
  selector: 'shared-map-download',
  templateUrl: './map-download.component.html',
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    DividerModule,
    RadioModule,
    SelectMenuModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  styleUrls: ['./map-download.component.scss'],
})
export class MapDownloadComponent {
  /** Whether the menu is expanded or not */
  public expanded = false;
  /** View options */
  public viewOptions = [
    {
      label: this.translate.instant(
        'components.map.controls.download.view.all'
      ),
      value: 'map',
    },
    {
      label: this.translate.instant(
        'components.map.controls.download.view.current'
      ),
      value: 'current',
    },
  ];
  /** Layers options */
  public layersOptions = [
    {
      label: this.translate.instant(
        'components.map.controls.download.layers.all'
      ),
      value: 'all',
    },
    {
      label: this.translate.instant(
        'components.map.controls.download.layers.visible'
      ),
      value: 'visible',
    },
    {
      label: this.translate.instant(
        'components.map.controls.download.layers.selected'
      ),
      value: 'selected',
    },
  ];
  /** Layers */
  public layers: { label: string }[] = [
    {
      label: 'layer 1',
    },
    {
      label: 'layer 2',
    },
  ];
  /** Output options */
  public outputOptions = ['csv', 'xlsx', 'geojson', 'png'];
  /** Form group */
  public formGroup: FormGroup;

  /**
   * Creates the form to handle the layers selection
   *
   * @param fb form builder
   * @param translate common translate service
   */
  constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.formGroup = fb.group({
      view: ['map', Validators.required],
      layers: ['all', Validators.required],
      selectedLayers: [{ value: [] as string[] }],
      output: ['xlsx', Validators.required],
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
