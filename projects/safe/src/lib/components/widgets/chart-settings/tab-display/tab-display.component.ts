import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { LEGEND_POSITIONS, TITLE_POSITIONS } from '../constants';

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
  implements OnInit
{
  @Input() formGroup!: UntypedFormGroup;
  @Input() type: any;

  public legendPositions = LEGEND_POSITIONS;
  public titlePositions = TITLE_POSITIONS;
  public sizes = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26,
    28,
  ];  
  public selectTitlePosition = 'top';

  /** @returns the form for the chart */
  public get chartForm(): UntypedFormGroup {
    return this.formGroup.get('chart') as UntypedFormGroup;
  }
  

  /**
   * Constructor of the display tab of the chart settings modal.
   */
  constructor() {
    super();
  }

  ngOnInit(): void {
    const sizeControl = this.chartForm.get('title.size');
    sizeControl?.setValue(sizeControl.value);
    sizeControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onToggleStyle(''));
    

    const TitlePosition = this.chartForm.get('title.position');
    if(TitlePosition){
      this.selectTitlePosition = TitlePosition.value;
    }
    this.chartForm.patchValue({
      title: { position: this.selectTitlePosition }
    })
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

  //when change the position, set chartForm.title.position as the new position
  onPositionSelectionChange(event: any){
    this.chartForm.patchValue({
      title: { position: event.value }
    })
  }
}
