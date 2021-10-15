import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'safe-new-app-button',
  templateUrl: './new-app-button.component.html',
  styleUrls: ['./new-app-button.component.scss']
})

export class NewAppButtonComponent implements OnInit {

  @Output() clickEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  click($event: any): void {
    console.log('click');
    this.clickEvent.emit();
  }
}
