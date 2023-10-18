import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FaIconName, getIconDefinition } from '@oort-front/ui';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import {
  IconName,
  icon as iconCreator,
} from '@fortawesome/fontawesome-svg-core';

/**
 * Icon picker popup component
 */
@Component({
  selector: 'shared-icon-picker-popup',
  templateUrl: './icon-picker-popup.component.html',
  styleUrls: ['./icon-picker-popup.component.scss'],
})
export class IconPickerPopupComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close: EventEmitter<string> = new EventEmitter();
  public searchControl = new FormControl('');
  private show = true;
  @Input() icons!: string[];
  @Input() color!: string;
  private filteredIcons!: BehaviorSubject<FaIconName[]>;
  public filteredIcons$!: Observable<FaIconName[]>;
  public svgIcons: any = {};

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
   * Constructor of the IconPickerPopupComponent in order to extend the UnsubscribeComponent class
   */
  constructor() {
    super();
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
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
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
    this.filteredIcons = new BehaviorSubject<FaIconName[]>(this.icons);
    this.filteredIcons$ = this.filteredIcons.asObservable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['icons']?.currentValue !== changes['icons']?.previousValue) {
      this.createIconsSvgs();
    }
  }

  /**
   * Create related svg icons for the given icon list
   */
  private createIconsSvgs() {
    this.svgIcons = {};
    this.icons.forEach((icon) => {
      const iconDef = getIconDefinition(icon as IconName);
      const i = iconCreator(iconDef, {
        styles: {
          ...(this.color && { color: this.color }),
        },
      });
      this.svgIcons[icon] = i.html[0];
    });
  }
}
