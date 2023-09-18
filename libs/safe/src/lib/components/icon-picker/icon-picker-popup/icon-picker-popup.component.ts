import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { IconName } from '../icon-picker.const';

/**
 * Icon picker popup component
 */
@Component({
  selector: 'safe-icon-picker-popup',
  templateUrl: './icon-picker-popup.component.html',
  styleUrls: ['./icon-picker-popup.component.scss'],
})
export class IconPickerPopupComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close: EventEmitter<string> = new EventEmitter();
  public searchControl = new FormControl('');
  private show = true;
  @Input() icons!: string[];
  @Input() color!: string;
  @Input() fontFamily = 'fa';
  private filteredIcons!: BehaviorSubject<IconName[]>;
  public filteredIcons$!: Observable<IconName[]>;

  /** Listen to click event on the document */
  @HostListener('click')
  clickInside() {
    this.show = true;
  }

  /** Listen to document click event and close the component if outside of it */
  @HostListener('document:click')
  clickout() {
    if (!this.show) {
      this.close.emit();
    }
    this.show = false;
  }

  /**
   * Select icon
   *
   * @param icon icon name
   */
  select(icon: string): void {
    this.close.emit(icon);
    this.show = false;
  }
  // this.filteredIcons.next(this.icons);
  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe((value) => {
      if (value) {
        this.filteredIcons.next(
          this.icons.filter((icon: string) =>
            icon.toLowerCase().includes(value.toLowerCase())
          )
        );
      } else {
        this.filteredIcons.next(this.icons);
      }
    });
    this.filteredIcons = new BehaviorSubject<IconName[]>(this.icons);
    this.filteredIcons$ = this.filteredIcons.asObservable();
  }
}
