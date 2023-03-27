import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

/**
 * Component for configuring the settings for heatmaps
 *
 * @class HeatmapSettingsComponent
 * @typedef {HeatmapSettingsComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'safe-heatmap-settings',
  templateUrl: './heatmap-settings.component.html',
  styleUrls: ['./heatmap-settings.component.scss'],
})
export class HeatmapSettingsComponent implements OnInit {
  public isEditing = false;
  public heatmapForm: UntypedFormGroup = new UntypedFormGroup({});
  public gradients = [
    { start: 'blue', end: 'red' },
    { start: '#283E51', end: '#9BBDDC' },
  ];
  public selectedGradient = this.gradients[0];

  @Input() settings: any;
  @Output() settingsChange = new EventEmitter();

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.heatmapForm = this.formBuilder.group({
      //colorGradient: [],
      radius: [25],
      blur: [15],
      minOpacity: [1.0],
      maxPointIntensity: [1.0],
      maxZoom: [1.0],
    });
    //this.heatmapForm.setValue(this.settings);
  }

  onSubmit() {
    console.log(this.heatmapForm.controls);
    this.isEditing = false;
    //this.settingsChange.emit(this.heatmapForm.value);
  }

  onEdit() {
    this.isEditing = true;
  }

  selectGradient(gradient: any) {
    this.selectedGradient = gradient;
  }
}
