import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GradientPickerModule } from '../../../../../controls/gradient-picker/gradient-picker.module';
import {
  FormWrapperModule,
  SelectMenuModule,
  SliderModule,
} from '@oort-front/ui';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { Fields } from '../../../../../../models/layer.model';
import { UnsubscribeComponent } from '../../../../../../components/utils/unsubscribe/unsubscribe.component';

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
export class HeatmapRendererComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;

  /** All scalar fields */
  private scalarFields = new BehaviorSubject<Fields[]>([]);
  /** Scalar fields as observable */
  public scalarFields$ = this.scalarFields.asObservable();

  ngOnInit(): void {
    this.fields$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.scalarFields.next(
        value.filter((field) => ['number'].includes(field.type.toLowerCase()))
      );
    });
  }
}
