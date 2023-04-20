import { Component, Input, AfterViewInit, Renderer2, ElementRef} from '@angular/core';
import { AvatarGroupStack } from './enums/avatar-group-stack.enum'

@Component({
  selector: 'ui-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
})
export class AvatarGroupComponent implements AfterViewInit{
  @Input() stack:AvatarGroupStack = AvatarGroupStack.TOP;
  @Input() limit: any = '';
  @Input() avatars: any[] = [];

  constructor(private renderer: Renderer2, private el: ElementRef){}
  
  avatarGroupStack = AvatarGroupStack;

  ngAfterViewInit(): void {
    console.log(this.avatars);
    if(this.stack === AvatarGroupStack.TOP){
      const avatars = this.el.nativeElement.querySelectorAll('ui-avatar');
      const total_avatars = avatars.length;
      Array.from(avatars).forEach((avatar:any, index:number) => {
        this.renderer.setStyle(avatar, 'z-index', `${total_avatars - index}`);
      })
    }
  }
}
