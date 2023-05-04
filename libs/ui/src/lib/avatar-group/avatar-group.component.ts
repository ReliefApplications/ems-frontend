import {
  Component,
  Input,
  AfterViewInit,
  Renderer2,
  ElementRef,
  QueryList,
  ContentChildren,
} from '@angular/core';
import { AvatarGroupStack } from './enums/avatar-group-stack.enum';
import { AvatarComponent } from '../avatar/avatar.component';
import { Size } from '../shared/size.enum';
import { AvatarShape } from '../avatar/enums/avatar-shape.enum';

/**
 * UI Avatar group component
 */
@Component({
  selector: 'ui-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
})
export class AvatarGroupComponent implements AfterViewInit {
  @Input() size: Size | string = Size.MEDIUM;
  @Input() shape: AvatarShape | string = AvatarShape.CIRCLE;
  @Input() stack: AvatarGroupStack | string = AvatarGroupStack.TOP;
  @Input() limit = 5;

  @ContentChildren(AvatarComponent) avatars!: QueryList<AvatarComponent>;

  /**
   * Constructor
   *
   * @param renderer Renderer2
   * @param el The host element
   */
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  avatarGroupStack = AvatarGroupStack;

  ngAfterViewInit(): void {
    if (this.stack === AvatarGroupStack.TOP) {
      const avatars = this.el.nativeElement.querySelectorAll('ui-avatar');
      const total_avatars = avatars.length;
      Array.from(avatars).forEach((avatar: any, index: number) => {
        this.renderer.setStyle(avatar, 'z-index', `${total_avatars - index}`);
      });
    }
  }
}
