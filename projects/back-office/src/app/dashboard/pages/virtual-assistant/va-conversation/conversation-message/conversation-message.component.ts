import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.scss']
})
export class ConversationMessageComponent implements OnInit {

  @Input() imgSrc = '';

  @Input() backgroundColor = '';

  @Input() backgroundColorReply = '';

  @Input() text = '';

  @Input() reply = '';

  @Input()
  choices: string[] = [];

  @Output() btnChoiceClick: EventEmitter<any> = new EventEmitter();

  public ml = '';
  public mr = '';

  constructor() {
    console.log(this.choices);
    // this.imgSrc = environment.profilePhotoDefault;
  }

  ngOnInit(): void {
    const msg = document.getElementsByClassName('messageGlobal');
    if (msg !== null) {
      console.log(this.reply);
      if (this.reply === 'true'){
        // document.getElementsByClassName('messageGlobal').style.backgroundColor = this.backgroundColorReply;
        this.ml = 'auto';
        this.mr = '0';

      } else {
        // document.getElementsByClassName('messageGlobal').style.backgroundColor = this.backgroundColor;
        this.ml = '0';
        this.mr = 'auto';
      }
    }
  }

  btnChoiceClickFn($event: any , ch: string): void{
    this.btnChoiceClick.emit(ch);
    console.log('$event.target');
    $event.target.parentElement.setAttribute('style', 'display: none');
  }
}
