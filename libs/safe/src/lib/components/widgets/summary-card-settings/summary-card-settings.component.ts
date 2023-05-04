import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

import { get } from 'lodash';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';

/** Define max height of summary card */
const MAX_ROW_SPAN = 4;
/** Define max width of summary card */
const MAX_COL_SPAN = 8;

/** Define default height of summary card */
const DEFAULT_CARD_HEIGHT = 2;
/** Define max width of summary card */
const DEFAULT_CARD_WIDTH = 2;

/**
 * Create a card form
 *
 * @param value card value, optional
 * @returns card as form group
 */
export const createCardForm = (value?: any): UntypedFormGroup => {
  return new FormGroup({
    title: new FormControl(get(value, 'title', 'New Card')),
    isDynamic: new FormControl(value.isDynamic),
    height: new FormControl(get(value, 'height', DEFAULT_CARD_HEIGHT), [
      Validators.min(1),
      Validators.max(MAX_ROW_SPAN),
    ]),
    width: new FormControl(get(value, 'width', DEFAULT_CARD_WIDTH), [
      Validators.min(1),
      Validators.max(MAX_COL_SPAN),
    ]),
    isAggregation: new FormControl(get(value, 'isAggregation', true)),
    resource: new FormControl(get(value, 'resource', null)),
    layout: new FormControl(get(value, 'layout', null)),
    aggregation: new FormControl(get(value, 'aggregation', null)),
    record: new FormControl(get(value, 'record', null)),
    html: new FormControl(get(value, 'html', null)),
    showDataSourceLink: new FormControl(
      get(value, 'showDataSourceLink', false)
    ),
    availableFields: new FormControl(get(value, 'availableFields', [])),
    useStyles: new FormControl(get(value, 'useStyles', true)),
    wholeCardStyles: new FormControl(get(value, 'wholeCardStyles', false)),
  });
};

/**
 * Summary Card Settings component.
 */
@Component({
  selector: 'safe-summary-card-settings',
  templateUrl: './summary-card-settings.component.html',
  styleUrls: ['./summary-card-settings.component.scss'],
})
export class SafeSummaryCardSettingsComponent implements OnInit, AfterViewInit {
  // === REACTIVE FORM ===
  tileForm: UntypedFormGroup | undefined;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  /**
   * Summary Card Settings component.
   *
   * @param fb Angular Form Builder.
   */
  constructor(private fb: UntypedFormBuilder) {}

  /**
   * Build the settings form, using the widget saved parameters.
   */
  ngOnInit(): void {
    const form = this.fb.group({
      id: this.tile.id,
      title: this.tile.settings.title,
      isDynamic: get(this.tile, 'settings.isDynamic', false),
      usePagination: get(this.tile, 'settings.usePagination', false),
      cards: this.fb.array(
        get(this.tile, 'settings.cards', []).map((x: any) => createCardForm(x))
      ),
    });
    this.tileForm = extendWidgetForm(form, this.tile.settings?.widgetDisplay);
    this.change.emit(this.tileForm);
  }

  /**
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });
  }
}
