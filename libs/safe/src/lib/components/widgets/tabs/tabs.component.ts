import { Component, Input } from '@angular/core';

@Component({
  selector: 'safe-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  @Input() settings: any;
}
