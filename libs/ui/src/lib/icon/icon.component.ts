import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { Variant } from '../types/variant';
import { Category } from '../types/category';
import { IconName, icon } from '@fortawesome/fontawesome-svg-core';
import {
  FaIconName,
  MatIconName,
  faV4toV6Mapper,
  getIconDefinition,
} from './icon.list';

/**
 * UI Icon Component
 * Display an icon with a given category and variant.
 */
@Component({
  selector: 'ui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnChanges {
  /** The name of the icon. */
  @Input() icon: FaIconName & MatIconName = '';
  /** The category of the icon. */
  @Input() category: Category = 'primary';
  /** The variant or style of the icon. */
  @Input() variant: Variant = 'default';
  /** The size of the icon. */
  @Input() size = 24;
  /** Boolean indicating whether the icon is outlined. */
  @Input() isOutlined = false;
  /** Font library */
  @Input() fontFamily: 'material' | 'fa' = 'material';

  /**
   * Icon component that renders the given icon for each type of font, fontawesome or material
   *
   * @param el Current host element
   * @param renderer Angular renderer2 in order to safely interact with the DOM to add fa svgs
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  /**
   * Formats the size input adding a 'px' suffix
   *
   * @returns Returns a string with the size in px
   */
  get fontSize(): string {
    return this.size + 'px';
  }

  /**
   * Resolve icon class by given category and variant
   *
   * @returns Returns a string array with the current variant and category class
   */
  get iconVariantAndCategory(): string[] {
    const classes = [];
    if (this.fontFamily !== 'fa') {
      if (this.isOutlined) {
        classes.push(
          ...['material-icons-outlined', 'material-symbols-outlined']
        );
      } else {
        classes.push(...['material-icons']);
      }
    }
    classes.push(
      this.category === 'secondary' || this.variant === 'light'
        ? 'icon-light'
        : this.variant === 'primary'
        ? 'icon-primary'
        : this.variant === 'success'
        ? 'icon-success'
        : this.variant === 'grey'
        ? 'icon-grey'
        : this.variant === 'danger'
        ? 'icon-danger'
        : this.variant === 'warning'
        ? 'icon-warning'
        : ''
    );
    return classes;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['icon']?.currentValue != changes['icon']?.previousValue) {
      this.setFASvgIcon();
    }
  }

  /**
   * Build up the FA svg icon and insert it in the current host element
   */
  private setFASvgIcon() {
    if (this.fontFamily === 'fa' && this.icon) {
      const iconDef = getIconDefinition(
        (faV4toV6Mapper[this.icon] ?? this.icon) as IconName
      );
      const i = icon(iconDef, {
        styles: {
          height: this.fontSize,
          width: this.fontSize,
          'line-height': this.fontSize,
          'font-size': this.fontSize,
        },
      });
      const isPreviousIcon = this.el.nativeElement.querySelector('span');
      if (isPreviousIcon) {
        this.renderer.removeChild(this.el.nativeElement, isPreviousIcon);
      }
      const wrapper = this.renderer.createElement('span');
      [...this.iconVariantAndCategory, 'inline-flex', 'align-middle']
        .filter((classProp) => !!classProp)
        .forEach((classProp) => {
          this.renderer.addClass(wrapper, classProp);
        });
      this.renderer.appendChild(wrapper, i.node[0]);
      if (wrapper) {
        this.renderer.appendChild(this.el.nativeElement, wrapper);
      }
    }
  }
}
