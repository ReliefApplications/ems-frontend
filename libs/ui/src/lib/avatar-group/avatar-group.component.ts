import {
  Component,
  Input,
  AfterViewInit,
  Renderer2,
  ElementRef,
  QueryList,
  ContentChildren,
} from '@angular/core';
import { AvatarGroupStack } from './types/avatar-group-stack';
import { AvatarComponent } from '../avatar/avatar.component';
import { Size } from '../types/size';
import { AvatarShape } from '../avatar/types/avatar-shape';

/**
 * UI Avatar group component
 * Display a group of avatars.
 */
@Component({
  selector: 'ui-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
})
export class AvatarGroupComponent implements AfterViewInit {
  /** Size of the avatars. */
  @Input() size: Size = 'medium';
  /** Shape of the avatars. */
  @Input() shape: AvatarShape = 'circle';
  /** Stack order of the avatars. */
  @Input() stack: AvatarGroupStack = 'top';
  /** Limit on the number of avatars displayed. */
  @Input() limit = 5;
  /** List of AvatarComponent children. */
  @ContentChildren(AvatarComponent) avatars!: QueryList<AvatarComponent>;

  /**
   * Constructor of AvatarGroupComponent
   *
   * @param renderer Renderer2
   * @param el The host element
   */
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.stack === 'top') {
      const avatars = this.el.nativeElement.querySelectorAll('ui-avatar');
      const total_avatars = avatars.length;
      Array.from(avatars).forEach((avatar: any, index: number) => {
        this.renderer.setStyle(avatar, 'z-index', `${total_avatars - index}`);
      });
    }
  }
}
