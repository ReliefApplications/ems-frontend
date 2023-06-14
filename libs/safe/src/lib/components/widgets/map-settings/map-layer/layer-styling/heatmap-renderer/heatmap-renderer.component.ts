import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GradientPickerModule } from '../../../../../gradient-picker/gradient-picker.module';
import { FormWrapperModule, SliderModule } from '@oort-front/ui';

/**
 * Layer Heatmap renderer component
 */
@Component({
  selector: 'safe-heatmap-renderer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    GradientPickerModule,
    SliderModule,
  ],
  templateUrl: './heatmap-renderer.component.html',
  styleUrls: ['./heatmap-renderer.component.scss'],
})
export class HeatmapRendererComponent {
  @Input() formGroup!: FormGroup;
}
