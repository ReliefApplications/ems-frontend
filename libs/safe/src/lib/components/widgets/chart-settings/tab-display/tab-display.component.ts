import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LEGEND_POSITIONS, TITLE_POSITIONS } from '../constants';
import { SafeChartComponent } from '../../chart/chart.component';

/**
 * Display tab of the chart settings modal.
 */
@Component({
  selector: 'safe-tab-display',
  templateUrl: './tab-display.component.html',
  styleUrls: ['./tab-display.component.scss'],
})
export class TabDisplayComponent
  extends SafeUnsubscribeComponent
  implements OnInit, AfterViewInit
{
  @Input() formGroup!: UntypedFormGroup;
  @Input() type: any;
  public chartSettings: any;

  public legendPositions = LEGEND_POSITIONS;
  public titlePositions = TITLE_POSITIONS;
  public sizes = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26,
    28,
  ];

  public series: any;

  /** @returns the form for the chart */
  public get chartForm(): UntypedFormGroup {
    return this.formGroup.get('chart') as UntypedFormGroup;
  }

  @ViewChild(SafeChartComponent) chartComponent!: SafeChartComponent;

  /**
   * Constructor of the display tab of the chart settings modal.
   *
   * @param fb
   */
  constructor(public fb: UntypedFormBuilder) {
    super();
  }

  ngOnInit(): void {
    const sizeControl = this.chartForm.get('title.size');
    sizeControl?.setValue(sizeControl.value);
    sizeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onToggleStyle(''));
    // Set the chart settings and add delay to avoid changes to be too frequent
    this.chartSettings = this.formGroup.value;
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.chartSettings = value;
      });
  }

  ngAfterViewInit(): void {
    this.chartComponent.series$
      .pipe(takeUntil(this.destroy$))
      .subscribe((series) => {
        this.series = series;
        console.log(this.series);

        const seriesForm = this.fb.group({
          serieColor: null,
        });
        this.seriesFormArray.push(seriesForm);
      });

    console.log(this.chartForm.get('series'));
    console.log(this.chartForm.get('series')?.value);
  }

  /**
   *
   */
  get seriesFormArray() {
    return this.chartForm.controls['series'] as UntypedFormArray;
  }

  /**
   * Toggles boolean controls for title style and update font.
   *
   * @param controlName name of form control.
   */
  onToggleStyle(controlName: string): void {
    const control = this.chartForm.get(controlName);
    control?.setValue(!control.value);

    let font = '';
    if (this.chartForm.get('title.bold')?.value) {
      font = font + 'bold ';
    }
    if (this.chartForm.get('title.italic')?.value) {
      font = font + 'italic ';
    }
    font = font + this.chartForm.get('title.size')?.value.toString();
    font = font + 'pt sans-serif';
    if (this.chartForm.get('title.underline')?.value) {
      font = font + '; text-decoration: underline;';
    }

    const font_control = this.chartForm.get('title.font');
    font_control?.setValue(font);
  }
}
