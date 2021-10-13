import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'safe-recent-app-button',
  templateUrl: './recent-app-button.component.html',
  styleUrls: ['./recent-app-button.component.css']
})

export class RecentAppButtonComponent implements OnInit {

  @Output() onClickEvent: EventEmitter<any> = new EventEmitter();

  userCount = 25;
  status = 'A';
  appName = 'Signal';
  creationDate = 'Created: ';

  constructor() { }

  ngOnInit(): void {
  }

  onClick($event: any): void {
    console.log('click');
    this.onClickEvent.emit();
  }
}
