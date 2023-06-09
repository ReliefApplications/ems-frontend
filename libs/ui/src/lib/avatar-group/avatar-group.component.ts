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
 */
@Component({
  selector: 'ui-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
})
export class AvatarGroupComponent implements AfterViewInit {
  @Input() size: Size = 'medium';
  @Input() shape: AvatarShape = 'circle';
  @Input() stack: AvatarGroupStack = 'top';
  @Input() limit = 5;

  @ContentChildren(AvatarComponent) avatars!: QueryList<AvatarComponent>;

  /**
   * Constructor
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
