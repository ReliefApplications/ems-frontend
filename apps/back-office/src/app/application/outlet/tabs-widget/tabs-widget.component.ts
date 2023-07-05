import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Tab {
  label: string;
  type: string;
  content?: string;
}

@Component({
  selector: 'app-tabs-widget',
  templateUrl: './tabs-widget.component.html',
  styleUrls: ['./tabs-widget.component.scss'],
})
export class TabsWidgetComponent {
  widget: any;
  tabs: Tab[] = [];
  header = true;
  settings: any = null;
  selectedTab = 0;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    const routingData = this.router.getCurrentNavigation()?.extras.state;
    console.log(routingData);
    this.tabs = [
      {
        label: 'super dashboard',
        type: 'dashboard',
        content: '649ec24820cbd84bdd2fe314',
      },
      {
        label: 'super dashboard',
        type: 'dashboard',
        content: '649ec24820cbd84bdd2fe314',
      },
      {
        label: 'my form',
        type: 'form',
        content: '64a51ac3080ab82497d60783',
      },
    ];
    this.loadTab(0);
  }

  loadTab(index: number) {
    const tab = this.tabs.at(index);
    if (tab) {
      this.router.navigate([`./${tab.type}/${tab.content}`], {
        relativeTo: this.activatedRoute,
        skipLocationChange: true,
      });
      this.selectedTab = index;
    }
  }

  removeTab(event: MouseEvent, index: number) {
    console.log('remove');
    event.preventDefault();
    event.stopPropagation();
  }
}
