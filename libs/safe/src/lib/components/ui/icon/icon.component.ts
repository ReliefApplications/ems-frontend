import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { IconVariant } from './icon-variant.enum';
import { Variant } from '@oort-front/ui';

/**
 * Component for custom icons
 */
@Component({
  selector: 'safe-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class SafeIconComponent implements OnInit {
  @Input() icon = '';

  @Input() inline = false;

  @Input() variant: IconVariant | string = IconVariant.DEFAULT;

  @Input() size = 24;

  @Input() fontSet!: string;

  colorVariant = Variant;
  uiVariant = Variant.DEFAULT;

  /** @returns A getter that returns the display style of the host element. */
  @HostBinding('style.display') get display() {
    return this.inline ? 'inline-flex' : 'flex';
  }

  ngOnInit(): void {
    this.convertVariantToUi;
  }

  /**
   * Formats the size input adding a 'px' suffix
   *
   * @returns Returns a string with the size in px
   */
  get fontSize(): string {
    return this.size + 'px';
  }

  /**
   * Compares the variant passed with a string to return a valid color variant.
   */
  convertVariantToUi(): void {
    switch (this.variant) {
      case this.colorVariant.DEFAULT:
        this.uiVariant = this.colorVariant.DEFAULT;
        break;
      case this.colorVariant.GREY:
        this.uiVariant = this.colorVariant.GREY;
        break;
      case this.colorVariant.DANGER:
        this.uiVariant = this.colorVariant.DANGER;
        break;
      case this.colorVariant.LIGHT:
        this.uiVariant = this.colorVariant.LIGHT;
        break;
      case this.colorVariant.PRIMARY:
        this.uiVariant = this.colorVariant.PRIMARY;
        break;
      case this.colorVariant.SUCCESS:
        this.uiVariant = this.colorVariant.SUCCESS;
        break;
    }
  }
}
