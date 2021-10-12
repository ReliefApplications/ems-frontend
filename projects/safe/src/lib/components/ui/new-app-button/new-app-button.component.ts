import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'safe-new-app-button',
  templateUrl: './new-app-button.component.html',
  styleUrls: ['./new-app-button.component.scss']
})

export class NewAppButtonComponent implements OnInit {

  @Output() onClickEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClick($event: any): void {
    console.log('click');
    this.onClickEvent.emit();
  }
}
