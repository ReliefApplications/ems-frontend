import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Choices} from '../../models/choices.model';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.scss']
})
export class ConversationMessageComponent implements OnInit {

  @Input() type = '';

  @Input() imgSrc = '';

  @Input() backgroundColor = '';

  @Input() backgroundColorReply = '';

  @Input() text = '';

  @Input() reply = '';

  @Input() choices: Choices[];

  @Output() btnChoiceClick: EventEmitter<any> = new EventEmitter();

  public ml = '';
  public mr = '';

  constructor() {
    // this.imgSrc = environment.profilePhotoDefault;
    this.choices = [{value: '', text: ''}];
  }

  ngOnInit(): void {
    const msg = document.getElementsByClassName('messageGlobal');
    if (msg !== null) {
      if (this.reply === 'true'){
        this.ml = 'auto';
        this.mr = '0';
      }
      else {
        this.ml = '0';
        this.mr = 'auto';
      }
    }
  }

  btnChoiceClickFn($event: any , ch: Choices): void{
    this.btnChoiceClick.emit(ch);
    // console.log($event.target);
    $event.currentTarget.parentElement.setAttribute('style', 'display: none');
  }

  btnChoiceCheckClickFn($event: any, ch: Choices): void {
    $event.target.parentElement.setAttribute('color', 'Accent');
  }
}
