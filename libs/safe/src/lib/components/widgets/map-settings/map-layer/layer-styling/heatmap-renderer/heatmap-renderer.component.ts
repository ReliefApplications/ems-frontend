import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { GradientPickerModule } from '../../../../../gradient-picker/gradient-picker.module';

@Component({
  selector: 'safe-heatmap-renderer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatSliderModule,
    GradientPickerModule,
  ],
  templateUrl: './heatmap-renderer.component.html',
  styleUrls: ['./heatmap-renderer.component.scss'],
})
export class HeatmapRendererComponent {
  @Input() formGroup!: FormGroup;
}
