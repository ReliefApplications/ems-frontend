import { Component, Input} from '@angular/core';
import { AvatarGroupStack } from './enums/avatar-group-stack.enum'
import { json } from 'stream/consumers';

@Component({
  selector: 'ui-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
})
export class AvatarGroupComponent{
  @Input() stack:AvatarGroupStack = AvatarGroupStack.TOP;
  @Input() limit: any = '';
  @Input() avatars: any[] = [];

  
  public arrayAvatars = [{
    "size":"large",
    "variant": "tertiary",
    "image":"",
    "shape":"circle",
    "initials": true,
  },
  {
    "size":"large",
    "variant": "tertiary",
    "image":"https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "shape":"circle",
    "initials": true,
  },
  {
    "size":"large",
    "variant": "secondary",
    "image":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
    "shape":"circle",
    "initials": false,
  }]

  avatarGroupStack = AvatarGroupStack;
}
