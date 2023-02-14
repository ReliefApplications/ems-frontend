import { Component, HostListener, Inject, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Icon picker that loads the icon list with the given font family to display those icons as a grid
 */
@Component({
  selector: 'safe-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SafeIconPickerComponent,
      multi: true,
    },
  ],
})
export class SafeIconPickerComponent implements ControlValueAccessor {
  /**
   * Icon list data
   */
  @Input() set iconList(iconListData: string[]) {
    // @TODO Takes some time to display the picker because of the list size
    // Maybe implement on scroll load feature??
    if (iconListData) {
      this.iconListData = iconListData;
      this.filteredIconList = iconListData;
    }
  }
  @Input() fontFamily = 'fa';

  /**
   * On click display the grid icon list
   */
  @HostListener('click')
  onClick() {
    this.displayIconList = true;
  }

  /**
   * On escape close the grid icon list
   */
  @HostListener('document:keydown.escape')
  onEsc() {
    this.displayIconList = false;
  }

  private iconListData!: string[];
  public filteredIconList!: string[];
  public selectedIcon!: string;
  public primaryColor!: string;
  public displayIconList = false;
  onChange!: (value: string) => void;
  onTouched!: () => void;

  /**
   * Component for the layer styling
   *
   * @param environment platform environment
   */
  constructor(@Inject('environment') environment: any) {
    this.primaryColor = environment.theme.primary;
  }

  /**
   * Gets the value from the parent form control
   * @param icon Value set from the linked form control
   */
  writeValue(icon: string): void {
    this.selectedIcon = icon;
  }

  /**
   * Register the change function from the parent form to use it
   *
   * @param fn onChange function from the parent form
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register the touch function from the parent form to use it
   *
   * @param fn onTouched function from the parent form
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Updates the parent form with the given icon
   *
   * @param icon Icon value
   */
  public setIcon(icon: string) {
    this.selectedIcon = icon;
    this.onChange(icon);
    this.onTouched();
  }

  /**
   * Filters the icon list by the given search value
   *
   * @param event Input event value
   */
  public filterIconList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredIconList = this.iconListData.filter((icon: string) =>
      icon.toLowerCase().includes(filterValue.toLowerCase())
    );
  }
}
