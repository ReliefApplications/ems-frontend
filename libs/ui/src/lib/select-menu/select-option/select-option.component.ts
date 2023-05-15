import { CdkListbox } from '@angular/cdk/listbox';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  Injector,
} from '@angular/core';
import { SelectMenuComponent } from '../select-menu.component';

/**
 * UI Select option component
 */
@Component({
  selector: 'ui-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
  providers: [CdkListbox],
})
export class SelectOptionComponent {
  @Input() value!: any;
  @Input() selected = false;
  @Output() optionClick = new EventEmitter<any>();

  private parent!: SelectMenuComponent;

  /** gets if the option can be/are selected */
  get isSelected(): boolean {
    if (!this.parent.multiselect) {
      // If multi selection not allowed, only last selected value saved can be displayed as selected
      this.selected =
        this.parent.selectionControl.value?.includes(this.value) ?? false;
    }
    return this.selected;
  }

  /**
   * UI Select option constructor
   *
   * @param injector Angular injector
   */
  constructor(private injector: Injector) {
    this.parent = this.injector.get<SelectMenuComponent>(SelectMenuComponent);
  }
  /**
   * Emit optionClick output and updates option selected status
   */
  onChangeFunction(): void {
    this.selected = !this.selected;
    this.optionClick.emit(this.selected);
  }
}
