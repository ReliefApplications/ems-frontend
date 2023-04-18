import { Component, Input } from '@angular/core';
import { AvatarGroupStack } from './enums/avatar-group-stack.enum'

@Component({
  selector: 'ui-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
})
export class AvatarGroupComponent {
  @Input() stack:AvatarGroupStack = AvatarGroupStack.TOP;
  @Input() limit: any = '';

  avatarGroupStack = AvatarGroupStack;
}
