import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import {
  TabsModule,
  DialogModule,
  ButtonModule,
  TooltipModule,
  SelectMenuModule,
  FormWrapperModule,
  IconModule,
  ToggleModule,
  AlertModule,
} from '@oort-front/ui';
import { debounceTime, takeUntil } from 'rxjs';

/**
 * Represents the data passed to the dialog component.
 */
interface DialogData {
  gridOptions: any;
}

/**
 * Edition of a single tab, in tabs widget
 */
@Component({
  selector: 'grid-settings-modal',
  templateUrl: './grid-settings-modal.component.html',
  styleUrls: ['./grid-settings-modal.component.scss'],
  standalone: true,
  imports: [
    TabsModule,
    DialogModule,
    IconModule,
    ButtonModule,
    TooltipModule,
    SelectMenuModule,
    FormWrapperModule,
    ToggleModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class GridSettingsModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  public onUpdate = new EventEmitter();

  public gridOptionsForm!: FormGroup;

  public defaultGridOptions = {
    minCols: 8,
    fixedRowHeight: 200,
    margin: 10,
  };

  /**
   * Constructs a new instance of the GridSettingsModalComponent.
   *
   * @param fb - The FormBuilder instance used for creating the form.
   * @param data - The data passed to the dialog.
   */
  constructor(
    private fb: FormBuilder,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    super();
  }

  ngOnInit(): void {
    // Init form and create control with name 'gridOptions'
    this.gridOptionsForm = this.fb.group({
      ...this.defaultGridOptions,
      ...this.data.gridOptions,
    });

    // Listen to grid settings updates
    this.gridOptionsForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((gridOptions) => {
        // update only if the form is valid
        if (this.gridOptionsForm.valid) {
          this.onUpdateGridOptions(gridOptions);
        }
      });
  }

  /**
   * Updates the grid options and emits the updated grid options.
   *
   * @param gridOptions - The new grid options to be applied.
   */
  public onUpdateGridOptions(gridOptions: any): void {
    gridOptions = {
      ...gridOptions,
      // block adding more columns by dragging or resizing
      maxCols: gridOptions.minCols,
    };
    this.onUpdate.emit(gridOptions);
  }
}