import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GradientPickerModule } from '../../../../../controls/gradient-picker/gradient-picker.module';
import {
  FormWrapperModule,
  SelectMenuModule,
  SliderModule,
} from '@oort-front/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fields } from '../../../../../../models/layer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Layer Heatmap renderer component
 */
@Component({
  selector: 'shared-heatmap-renderer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    GradientPickerModule,
    SliderModule,
    SelectMenuModule,
  ],
  templateUrl: './heatmap-renderer.component.html',
  styleUrls: ['./heatmap-renderer.component.scss'],
})
export class HeatmapRendererComponent implements OnInit {
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** All scalar fields */
  private scalarFields = new BehaviorSubject<Fields[]>([]);
  /** Scalar fields as observable */
  public scalarFields$ = this.scalarFields.asObservable();
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.fields$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.scalarFields.next(
          value.filter((field) =>
            ['integer', 'number'].includes(field.type.toLowerCase())
          )
        );
      });
  }
}
