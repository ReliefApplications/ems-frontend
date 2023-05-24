import { Component, Input, Inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconPickerModule } from '../../../../../icon-picker/icon-picker.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatSliderModule } from '@angular/material/slider';

/**
 * Layer simple renderer settings component.
 */
@Component({
  selector: 'safe-simple-renderer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconPickerModule,
    MatFormFieldModule,
    TranslateModule,
    InputsModule,
    MatProgressSpinnerModule,
    MatSliderModule,
  ],
  templateUrl: './simple-renderer.component.html',
  styleUrls: ['./simple-renderer.component.scss'],
})
export class SimpleRendererComponent implements AfterViewInit {
  @Input() formGroup!: FormGroup;
  @Input() showSize = true;
  public loading = true;
  private primaryColor!: string;

  /**
   * Layer simple renderer settings constructor.
   *
   * @param environment platform environment
   */
  constructor(@Inject('environment') environment: any) {
    this.primaryColor = environment.theme.primary;
  }

  ngAfterViewInit(): void {
    // If color not chosen, set primary color as default
    if (!this.formGroup.value.color) {
      this.formGroup.controls.color.setValue(this.primaryColor);
    }
    this.loading = false;
  }
}
