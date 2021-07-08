import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Message} from '../models/message.model';
import {User} from '../models/user.model';

@Component({
  selector: 'app-va-conversation',
  templateUrl: './va-conversation.component.html',
  styleUrls: ['./va-conversation.component.scss']
})
export class VaConversationComponent implements OnInit, OnChanges {

  @Input() form: any[] = [];
  public records: any[] = [];

  public currentText: string;
  @ViewChild(CdkVirtualScrollViewport) viewport: any;

  public messages: Message[] = [];
  public iCurrentQuestion: number;

  constructor() {
    this.currentText = '';
    console.log(this.messages);
    this.iCurrentQuestion = 0;
  }

  ngOnInit(): void {
    // this.speechToTextService.endSpeechEvent.subscribe(
    //   (text) => {
    //     this.currentText = text;
    //   }
    // );
    // this.controllerService.botReplied.subscribe(
    //   () => {
    //     this.updateScrollViewPos();
    //   }
    // );

    // window.setTimeout(() => {
    //   console.log('this.form');
    //   console.log(this.form);
    //   this.sendQuestionMsg(this.form[0].name);
    //   }, 5000);
  }

  ngOnChanges(changes: SimpleChanges): void{
    console.log('ngAfterContentInit');
    if (this.form !== undefined) {
      console.log('*this.form*');
      console.log(this.form);
      this.sendQuestionMsg();
    }
  }

  msgUpdated(msg: any): void{
    if (typeof msg === 'string'){
      this.currentText = msg;
    }
  }

  sendReplyMsg(msg: string): void {
    if (msg !== '') {
      this.addMsg('',
        msg,
        'true',
        new User('Me', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png'),
        Date.now(),
        []);
      console.log(this.messages);

      // reset input text
      this.currentText = '';

      this.updateScrollViewPos();

      this.sendQuestionMsg();
    }
  }

  sendQuestionMsg(): void {
    console.log('this.currentText');
    console.log(this.currentText);
    let nextQuest = '';
    if (this.iCurrentQuestion < this.form.length){
      console.log(this.iCurrentQuestion);
      console.log(this.form.length);
      nextQuest = this.form[this.iCurrentQuestion].title;

      this.addMsg('',
        nextQuest,
        'false',
        new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
        Date.now(),
        []);
    }
    else if (this.iCurrentQuestion === this.form.length) {
      nextQuest = 'Thank you for your time, bye!';

      this.addMsg('',
        nextQuest,
        'false',
        new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
        Date.now(),
        ['restart']);
    }
    if (this.iCurrentQuestion <= this.form.length){
      this.iCurrentQuestion++;
      this.updateScrollViewPos();
    }
  }

  addMsg(type: string,
         text: string,
         reply: string,
         user: User,
         date: number,
         choices: string[]): void {
    this.messages.push(new Message(type, text, reply, user, date, choices));
  }

  updateScrollViewPos(): void {
    setTimeout(() => {
      this.viewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 0);
    setTimeout(() => {
      this.viewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 50);
  }

  startSpeech(): void {
    // this.speechToTextService.start();
  }

  choiceClick(e: any): void{
    console.log(e);
    this.sendReplyMsg(e);
  }

}
