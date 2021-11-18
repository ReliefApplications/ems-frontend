import { Component, OnInit } from '@angular/core';
import { Page } from '@safe/builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public dashboardId = '60745912910c55004ccd79b3';
  public formId = '60a60a044473cd002a9baed1';
  public workflowId = '603f420adac33300299560f7';
  public applicationId = '6008387ac67fc800441130df';
  public selectedPageId = '';

  public pages: Page[] = [];

  constructor() { }

  ngOnInit(): void {}

  public setPages(pages: Page[]): void {
    this.pages = pages;
  }

  public openPage(id: string | undefined): void {
    this.selectedPageId = id || '';
  }
}
