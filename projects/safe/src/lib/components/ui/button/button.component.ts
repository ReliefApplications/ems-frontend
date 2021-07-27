import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'a[safe-button], button[safe-button]',
  templateUrl: './button.component.html',
  styleUrls: [
    './button.component.scss'
  ]
})
export class SafeButtonComponent extends MatButton implements OnInit  {

  ngOnInit(): void {
  }
}
