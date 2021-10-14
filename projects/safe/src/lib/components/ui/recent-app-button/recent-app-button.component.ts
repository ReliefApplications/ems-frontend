import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'safe-recent-app-button',
  templateUrl: './recent-app-button.component.html',
  styleUrls: ['./recent-app-button.component.css']
})

export class RecentAppButtonComponent implements OnInit {

  @Output() appClickEvent: EventEmitter<any> = new EventEmitter();

  @Output() previewEvent: EventEmitter<any> = new EventEmitter();
  @Output() saveAccessEvent: EventEmitter<any> = new EventEmitter();
  @Output() duplicateEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();

  @Input() app: any;

  badge: {
    letter: string;
    color: string;
    backgroundColor: string;
  };

  constructor() {
    this.badge = {letter: '?', color: 'black', backgroundColor: 'white'};
  }

  ngOnInit(): void {
    console.log('this.users');
    // console.log(this.users);
    // const a = new Date(this.creationDate);
    // console.log(this.creationDate);
    // console.log(this.creationDate.toString());
    // console.log(new Date(this.creationDate));
    // console.log(new Date(this.creationDate).toString());
    // console.log(new Date(this.creationDate.toString()).getTime());
    // this.date = new Date(this.creationDate).toLocaleDateString('en-US');
    // console.log(this.date);

    console.log(this.numberFormatter(9812345));
    console.log(this.numberFormatter(3212));
    console.log(this.numberFormatter(329));
    console.log(this.numberFormatter(2));


    this.convertStatus();
  }

  convertStatus(): void {
    switch (this.app.status) {
      case 'active':
        this.badge.letter = 'A';
        this.badge.color = '#95DD65';
        this.badge.backgroundColor = 'rgba(149, 221, 101, 0.2)';
        break;
      case 'pending':
        this.badge.letter = 'P';
        this.badge.color = '#F4AE52';
        this.badge.backgroundColor = 'rgba(244, 174, 82, 0.2)';
        break;
      case 'archived':
        this.badge.letter = 'D';
        this.badge.color = '#F14343';
        this.badge.backgroundColor = 'rgba(241, 67, 67, 0.19)';
        break;
      default:
        this.badge.letter = '?';
        this.badge.color = 'black';
        this.badge.backgroundColor = 'white';
        break;
    }
  }

  // numberFormatter(num: number): string {
  //   if (num > 999999) {
  //     return (num / 1000000).toFixed(1) + 'M';
  //   }
  //   else if (num > 999) {
  //     return (num / 1000).toFixed(1) + 'k';
  //   }
  //   else {
  //     return num.toString();
  //   }
  // }
  numberFormatter(num: number): string {
    if (num > 999999) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    else if (num > 999) {
      return (num / 1000).toFixed(1) + 'k';
    }
    else {
      return num.toString();
    }
  }

  appClick(e: any): void {
    console.log('click');
    this.appClickEvent.emit(this.app.id);
  }
}
