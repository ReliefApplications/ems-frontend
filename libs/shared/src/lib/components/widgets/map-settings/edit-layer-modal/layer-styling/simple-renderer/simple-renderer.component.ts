import { Component, Input, Inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconPickerModule } from '../../../../../icon-picker/icon-picker.module';
import { TranslateModule } from '@ngx-translate/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import {
  DividerModule,
  FormWrapperModule,
  SliderModule,
  SpinnerModule,
} from '@oort-front/ui';
import { GeometryType } from '../../../../../ui/map/interfaces/layer-settings.type';

/**
 * Layer simple renderer settings component.
 */
@Component({
  selector: 'shared-simple-renderer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconPickerModule,
    FormWrapperModule,
    TranslateModule,
    InputsModule,
    SpinnerModule,
    SliderModule,
    DividerModule,
  ],
  templateUrl: './simple-renderer.component.html',
  styleUrls: ['./simple-renderer.component.scss'],
})
export class SimpleRendererComponent implements AfterViewInit {
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Show icon size control */
  @Input() showSize = true;
  /** Show style control */
  @Input() showStyle = true;
  /** Type of geometry ( point or polygon ) */
  @Input() geometryType: GeometryType = 'Point';
  /** Loading status */
  public loading = true;
  /** Primary color of the platform (set by environment) */
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
